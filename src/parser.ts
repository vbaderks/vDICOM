/**
 * Copyright (C) 2014 Victor Derks
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 */

/// <reference path="../Scripts/typings/node/node.d.ts" />

module Dicom {

    export class TransferSyntaxUids {
        public static implicitVRLittleEndian = "1.2.840.10008.1.2";
        public static explicitVRLittleEndian = "1.2.840.10008.1.2.1";
        public static explicitVRBigEndian = "1.2.840.10008.1.2.2";
    }

    enum FileSection {
        PREAMBLE,
        FILE_METAINFO,
        DATA_SET
    }

    enum ElementReadState {
        TAG,
        REPRESENTATION,
        LENGTH,
        VALUEDATA,
    }

    export class Parser {
        public tag: Dicom.Tag;
        public representation: Dicom.Representation;
        public length: number;
        public valueData;
        public ontag;
        public onelement;
        private readState: ElementReadState = ElementReadState.TAG;
        private buffer: ArrayBuffer;
        private position: number;
        private littleEndian: boolean = true;
        private explicitVREncoding: boolean = true;
        private fileSection: FileSection = FileSection.PREAMBLE;
        private ts;

        constructor(private part10File: boolean, uid?: string) {
            if (!part10File) {
                this.fileSection = FileSection.DATA_SET;
            }
            if (uid) {

            } else {
                this.transferSyntax = TransferSyntaxUids.explicitVRLittleEndian;
            }
        }

        public set transferSyntax(value: string) {
            this.ts = value;
            this.littleEndian = value != TransferSyntaxUids.explicitVRBigEndian;
            this.explicitVREncoding = value != TransferSyntaxUids.implicitVRLittleEndian;
        }

        /**
         * Tries to parse as many bytes as it can.
         * @returns false if more data is needed before it can parse. True means info has been parsed.
        */
        public parse(buffer: ArrayBuffer): boolean {
            this.buffer = buffer;
            this.position = 0;

            if (this.fileSection === FileSection.PREAMBLE) {
                if (!this.isAvailable(128 + 4)) {
                    return false;
                }

                this.position += 128;
                this.checkPrefix();
                this.position += 4;
                this.fileSection = FileSection.FILE_METAINFO;
            }

            while (this.readElement()) {
            }

            return true; // 
        }



        /**
         * Reads a DICOM element from the attached stream.
         * @returns true if the element was read successfully, false if there are not enough bytes available to read an element.
        */
        public readElement() {
            switch (this.readState) {
            case ElementReadState.TAG:
                return this.readTag() && this.readRepresentation() && this.readLength() && this.readValue();
            case ElementReadState.REPRESENTATION:
                return this.readRepresentation() && this.readLength() && this.readValue();
            case ElementReadState.LENGTH:
                return this.readLength() && this.readValue();
            case ElementReadState.VALUEDATA:
                return this.readRepresentation();
            }
        }

        private checkPrefix() {
            var view = new Uint8Array(this.buffer, this.position, 4);
            if (!(view[0] == 0x44 && view[1] == 0x49 && view[2] == 0x43 && view[3] == 0x4d)) {
                throw new Error("Invalid data: missing prefix DICM at offset 128");
            }
        }

        /**
         * Reads a DICOM tag from the buffer.
         * @returns true if the element was read successfully, false if there are not enough bytes available to read an element.
         */
        private readTag() {
            if (!this.isAvailable(4)) {
                return false;
            }

            this.tag = Dicom.Tag.create(this.retrieveUInt16EndianSensitive(), this.retrieveUInt16EndianSensitive());
            if (!this.validateTag()) {
                return false;
            }

            this.raiseOnTag();
            this.readState = ElementReadState.REPRESENTATION;
            return true;
        }

        private readRepresentation() {
            if (this.tag.isItemElement) {
                this.representation = Dicom.Representations.none;
            } else {
                if (this.explicitVREncoding) {
                    if (!this.isAvailable(2)) {
                        return false;
                    }

                    var view = new Uint8Array(this.buffer, this.position, 2);
                    var vr = String.fromCharCode(view[0], view[1]);
                    this.position += 2;
                    this.representation = Dicom.Representations.lookup(vr);
                } else {
                    //Representation = ResolveImplicitRepresentation();
                }
            }

            this.readState = ElementReadState.LENGTH;
            return true;
        }

        public readLength() {
            if (this.explicitVREncoding && !this.tag.isItemElement) {
                if (this.representation.isLength32Bit) {
                    if (!this.isAvailable(6)) {
                        return false;
                    }
                    this.position += 2; // skip 2 reserved bytes.
                    this.length = this.retrieveUInt32EndianSensitive();
                } else {
                    if (!this.isAvailable(2)) {
                        return false;
                    }
                    this.length = this.retrieveUInt16EndianSensitive();
                }
            } else {
                if (!this.isAvailable(4)) {
                    return false;
                }
                this.length = this.retrieveUInt32EndianSensitive();
            }

            this.readState = ElementReadState.VALUEDATA;
            return true;
        }

        private readValue() {
            if (!this.isAvailable(this.length)) {
                return false;
            }

            this.readValueData();

            this.raiseOnElement();
            this.readState = ElementReadState.TAG;
            return true;
        }

        private readValueData() {
            if (this.length === 0) {
                this.valueData = null;
                return;
            }

            var view = new Uint8Array(this.buffer, this.position, this.length);
            var result = new Uint8Array(this.length);
            for (var i = 0; i < view.length; i++) {
                result[i] = view[i];
            }

            this.valueData = result.buffer;
            this.position += this.length;
        }

        private retrieveUInt16() {
            var view = new Uint16Array(this.buffer, this.position, 1);
            this.position += 2;
            return view[0];
        }

        private retrieveUInt16EndianSensitive() {
            var view = new DataView(this.buffer);
            var result = view.getUint16(this.position, this.littleEndian);
            this.position += 2;
            return result;
        }

        private retrieveUInt32EndianSensitive() {
            var view = new DataView(this.buffer);
            var result = view.getUint32(this.position, this.littleEndian);
            this.position += 4;
            return result;
        }

        private isAvailable(byteCount: number) {
            return byteCount <= (this.buffer.byteLength - this.position);
        }

        private explicitRepresentationEncoding(tag: Dicom.Tag) {
            return this.explicitVREncoding && !tag.isItemElement;
        }

        private validateTag() {
            // TODO
            return true;
        }

        private raiseOnTag() {
            if (this.ontag && typeof (this.ontag) === "function") {
                this.ontag(this.tag);
            }
        }

        private raiseOnElement() {
            if (this.onelement && typeof (this.onelement) === "function") {
                this.onelement(this.tag, new Dicom.Variant(this.representation));
            }
        }
    }
}

if (typeof exports != "undefined") {
    exports.Parser = Dicom.Parser;
};
