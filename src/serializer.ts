/**
 * Copyright (C) 2014 Victor Derks
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 */

/* tslint:disable:no-bitwise */

module Dicom {
    export interface ISerializer {
        writeDefaultString(values, encodingUnitDelimiter: number, paddingValue: number);
    }

    export class Serializer implements ISerializer {
        public buffer: ArrayBuffer;

        writeDefaultString(values, encodingUnitDelimiter: number, paddingValue: number) {
            var byteView = new Uint8Array(this.buffer);

            for (var value in values) {
                // TODO
            }
        }

        serializeVariant(variant: Variant): ArrayBuffer {
            this.buffer = new ArrayBuffer(variant.getSerializedByteLength());

            variant.serialize(this);

            return this.buffer;
        }
    }
}