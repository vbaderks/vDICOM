/**
 * Copyright (C) 2014 Victor Derks
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 */

module Dicom {
    /**
     * @classdesc Holds the data and type (Value Representation) of a DICOM element.
     */
    export class Variant {
        public representation: Representation;
        public values: any;

        constructor(representation: Representation, values?: any) {
            this.representation = representation;

            if (values === undefined) {
                this.values = [];
                return;
            }
            if (values instanceof Array) {
                this.values = values;
                return;
            }
            this.values = [values];
        }

        public get count(): number {
            return this.values.length;
        }

        public isEqual(other: Variant): boolean {
            return this.representation === other.representation;
                   // TODO also include value in comparision && this.value === 
        }

        public serialize(serializer: ISerializer) {
            if (!this.count) {
                return; // nothing to serialize.
            }
            this.representation.serialize(serializer, this.values);
        }

        public getSerializedByteLength(): number {
            if (!this.count) {
                return 0; // nothing to serialize.
            }

            return 2000; // TODO
        }
    }
} 