/**
 * Copyright (C) 2014 Victor Derks
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 */

/// <reference path="../Scripts/typings/node/node.d.ts" />

module Dicom {

    enum ElementReadState {
        TAG,
        REPRESENTATION,
        LENGTH,
        VALUEDATA,
    }

    export class Parser {
        public tag: Tag;
        public representation: Representation;
        public length: number;
        public valueData;
        public ontag;
        public onelement;
        private readState: ElementReadState = ElementReadState.TAG;
        private buffer: ArrayBuffer;
        private position: number;
        private littleEndian: boolean = true;
        private explicitVREncoding: boolean = true;

        public parse(buffer: ArrayBuffer) {
            this.buffer = buffer;
            this.position = 0;
            while (this.readElement()) {}
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
                    return this.readRepresentation();
                case ElementReadState.LENGTH:
                    return this.readRepresentation();
                case ElementReadState.VALUEDATA:
                    return this.readRepresentation();
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
                this.representation = Representations.none;
            } else {
                if (this.explicitVREncoding) {
                    if (!this.isAvailable(2)) {
                        return false;
                    }

                    var view = new Uint8Array(this.buffer, this.position, 2);
                    var vr = String.fromCharCode(view[0], view[1]);
                    this.position += 2;
                    this.representation = Representations.lookup(vr);
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

        private explicitRepresentationEncoding(tag:Tag) {
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
                this.onelement(this.tag, new Variant(this.representation));
            }
        }
    }
}