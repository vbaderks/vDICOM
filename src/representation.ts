module Dicom {
    export class Representation {
        public vr: string;
        public name: string;
        public isLength32Bit: boolean;
        public isTextEncodingSensitive: boolean;

        constructor(vr: string, name: string, isLength32Bit: boolean, isTextEncodingSensitive: boolean) {
            this.vr = vr;
            this.name = name;
            this.isLength32Bit = isLength32Bit;
            this.isTextEncodingSensitive = isTextEncodingSensitive;
        }

    }

    export class Representations {
        // Define all the Value Representations of table PS 3.5, 6.2-1
        public static applicationEntity = new Representation("AE", "Application Entity", false, false);
        public static integerString = new Representation("IS", "Integer String", true, false);
        public static none = new Representation("NN", "None", false, false);

        private static createMap() {
            var map = {};
            map[Representations.applicationEntity.vr] = Representations.applicationEntity;
            map[Representations.integerString.vr] = Representations.integerString;
            return map;
        }

        private static lookupMap = Representations.createMap();

        public static lookup(vr: string) {
            var representation = Representations.lookupMap[vr];
            if (representation == null) {
                // TODO: handle error conditions.
            }

            return representation;
        }
    }
} 