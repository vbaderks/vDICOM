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
        public static ageString = new Representation("AS", "Age String", false, false); // TODO: check attributes
        public static attributeTag = new Representation("AT", "AttributeTag", false, false); // TODO: check attributes
        public static codeString = new Representation("CS", "Code String", true, false); // TODO: check attributes
        public static date = new Representation("DA", "Date", true, false); // TODO: check attributes
        public static decimalString = new Representation("DS", "Date", true, false); // TODO: check attributes
        public static dateTime = new Representation("DT", "Date Time", true, false); // TODO: check attributes
        public static floatingPointSingle = new Representation("FL", "Floating Point Single", true, false); // TODO: check attributes
        public static floatingPointDouble = new Representation("FD", "Floating Point Double", true, false); // TODO: check attributes
        public static integerString = new Representation("IS", "Integer String", true, false);
        public static none = new Representation("", "None", false, false);

        private static createMap() {
            var map = {};
            map[Representations.applicationEntity.vr] = Representations.applicationEntity;
            map[Representations.ageString.vr] = Representations.ageString;
            map[Representations.attributeTag.vr] = Representations.attributeTag;
            map[Representations.codeString.vr] = Representations.codeString;
            map[Representations.date.vr] = Representations.date;
            map[Representations.decimalString.vr] = Representations.decimalString;
            map[Representations.dateTime.vr] = Representations.dateTime;
            map[Representations.floatingPointSingle.vr] = Representations.floatingPointSingle;
            map[Representations.floatingPointDouble.vr] = Representations.floatingPointDouble;
            map[Representations.integerString.vr] = Representations.integerString;
            return map;
        }

        private static lookupMap = Representations.createMap();

        public static lookup(vr: string): Representation {
            var representation = Representations.lookupMap[vr];
            if (representation == null) {
                throw new Error("Invalid data: detected unknown VR: " + vr);
            }

            return representation;
        }
    }
} 