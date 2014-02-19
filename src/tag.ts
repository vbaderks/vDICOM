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
    }
}