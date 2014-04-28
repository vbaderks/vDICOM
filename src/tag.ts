/**
 * Copyright (C) 2014 Victor Derks
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 */

/* tslint:disable:no-bitwise */

module Dicom {

/**
 * @classdesc Represents the key to index DICOM elements.
 */
    export class Tag {
        public value: number;
        public privateCreator: string;

        constructor(value: number, privateCreator?: string) {
            this.value = value;
            this.privateCreator = privateCreator;
        }

        get groupNumber(): number {
            return this.value >> 16;
        }

        get elementNumber(): number {
            return this.value & 0xFFFF;
        }

        get isPrivate(): boolean {
            return (this.value & 0x10000) !== 0;
        }

        get isDataElement(): boolean {
            return this.groupNumber > 7 && this.groupNumber < 0xFFFF;
        }

        get isItemElement(): boolean {
            return false; // TODO: implement and test
        }

        public toString(): string {
            return "(" + Tag.decimalToHex(this.groupNumber, 4) + "," +
                         Tag.decimalToHex(this.elementNumber, 4) + ")";
        }

        public valueOf(): number {
            return this.value;
        }

        public isEqual(other: Tag): boolean {
            return this.value === other.value;
        }

        /**
         * @param groupNumber {type} The group number of the tag.
         */
        static create(groupNumber: number, elementNumber: number): Tag {
            return new Tag(groupNumber << 16 | elementNumber);
        }

        private static decimalToHex(d: number, padding) {
            var hex = Number(d).toString(16);
            padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

            while (hex.length < padding) {
                hex = "0" + hex;
            }
            return hex;
        }
    }
}

if (typeof exports != "undefined") {
    exports.Tag = Dicom.Tag;
}