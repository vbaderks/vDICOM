module Dicom {

    export var representations = {
        "CODE_STRING": "CS",
        "INTEGER_STRING": "IS",
    };


    /**
     * @classdesc Represents the key to index DICOM elements.
     */
    export class Variant {
        public representation: Representation;
        public value: Object;

        constructor(representation: Representation, value?: string) {
            this.representation = representation;
            this.value = value;
        }

        public get size(): number {
            return 0;
        }

        public isEqual(other: Variant): boolean {
            return this.representation === other.representation;
                   // TODO also include value in comparision && this.value === 
        }
    }
} 