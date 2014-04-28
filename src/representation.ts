/**
 * Copyright (C) 2014 Victor Derks
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 */

/* tslint:disable:no-bitwise */

module Dicom {
    export enum RepresentationAtrributes {
        NONE = 0,
        LENGTH32_BIT = 1,
        TEXT_ENCODING_SENSITIVE = 2,
        ENDIAN_SENSITIVE = 4,
        IMPLICIT_LENGTH_ALLOWED = 8
    }

    export class Representation {
        public isLength32Bit: boolean;
        public isTextEncodingSensitive: boolean;
        public isEndianEncodingSensitive: boolean;

        constructor(public vr: string,
                    public name: string,
                    attributes: RepresentationAtrributes) {
            this.isLength32Bit = (attributes & RepresentationAtrributes.LENGTH32_BIT) !== 0;
            this.isTextEncodingSensitive = (attributes & RepresentationAtrributes.TEXT_ENCODING_SENSITIVE) !== 0;
            this.isEndianEncodingSensitive = (attributes & RepresentationAtrributes.ENDIAN_SENSITIVE) !== 0;
        }

        public serialize(serializer: ISerializer, values) {
        }
    }

    class StringRepresentation extends Representation {
        private paddingCharacter: number = 0x20;

        constructor(vr: string, name: string, attributes: RepresentationAtrributes) {
            super(vr, name, attributes);
        }

        public serialize(serializer: ISerializer, values) {
            if (this.isTextEncodingSensitive) {

            } else {
                serializer.writeDefaultString(values, 0x34, 0x20);
            }
        }
    }

    export class Representations {
        // Define all the Value Representations of table PS 3.5, 6.2-1
        public static applicationEntity = new Representation("AE", "Application Entity", RepresentationAtrributes.NONE);
        public static ageString = new StringRepresentation("AS", "Age String", RepresentationAtrributes.NONE);
        public static attributeTag = new Representation("AT", "AttributeTag", RepresentationAtrributes.ENDIAN_SENSITIVE);
        public static codeString = new Representation("CS", "Code String", RepresentationAtrributes.NONE);
        public static date = new Representation("DA", "Date", RepresentationAtrributes.NONE);
        public static decimalString = new Representation("DS", "Date", RepresentationAtrributes.NONE);
        public static dateTime = new Representation("DT", "Date Time", RepresentationAtrributes.NONE);
        public static floatingPointSingle = new Representation("FL", "Floating Point Single", RepresentationAtrributes.ENDIAN_SENSITIVE);
        public static floatingPointDouble = new Representation("FD", "Floating Point Double", RepresentationAtrributes.ENDIAN_SENSITIVE);
        public static integerString = new Representation("IS", "Integer String", RepresentationAtrributes.NONE);
        public static longString = new Representation("LO", "Long String", RepresentationAtrributes.NONE);
        public static longText = new Representation("LT", "Long Text", RepresentationAtrributes.NONE);
        public static otherByteString = new Representation("OB", "Other Byte String", RepresentationAtrributes.LENGTH32_BIT);
        public static otherFloatString = new Representation("OF", "Other Float String", RepresentationAtrributes.LENGTH32_BIT);
        public static otherWordString = new Representation("OW", "Other Word String", RepresentationAtrributes.LENGTH32_BIT);
        public static personName = new Representation("PN", "Person Name", RepresentationAtrributes.NONE);
        public static shortString = new Representation("SH", "Short String", RepresentationAtrributes.NONE);
        public static signedLong = new Representation("SL", "Signed Long", RepresentationAtrributes.NONE);
        public static sequenceOfItems = new Representation("SQ", "Sequence of Items", RepresentationAtrributes.LENGTH32_BIT);
        public static signedShort = new Representation("SS", "Signed Short", RepresentationAtrributes.NONE);
        public static shortText = new Representation("ST", "Short Text", RepresentationAtrributes.NONE);
        public static time = new Representation("TM", "Time", RepresentationAtrributes.NONE);
        public static uniqueIdentifier = new Representation("UI", "Unique Identifier", RepresentationAtrributes.NONE);
        public static unsignedLong = new Representation("UL", "Unsigned Long", RepresentationAtrributes.NONE);
        public static unknown = new Representation("UN", "Unknown", RepresentationAtrributes.LENGTH32_BIT);
        public static unsignedShort = new Representation("US", "Unsigned Short", RepresentationAtrributes.NONE);
        public static unlimitedText = new Representation("UT", "Unlimited Text", RepresentationAtrributes.LENGTH32_BIT);

        public static none = new Representation("", "None", RepresentationAtrributes.NONE);

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
            map[Representations.longString.vr] = Representations.longString;
            map[Representations.longText.vr] = Representations.longText;
            map[Representations.otherByteString.vr] = Representations.otherByteString;
            map[Representations.otherFloatString.vr] = Representations.otherFloatString;
            map[Representations.otherWordString.vr] = Representations.otherWordString;
            map[Representations.personName.vr] = Representations.personName;
            map[Representations.shortString.vr] = Representations.shortString;
            map[Representations.signedLong.vr] = Representations.signedLong;
            map[Representations.sequenceOfItems.vr] = Representations.sequenceOfItems;
            map[Representations.signedShort.vr] = Representations.signedShort;
            map[Representations.shortText.vr] = Representations.shortText;
            map[Representations.time.vr] = Representations.time;
            map[Representations.uniqueIdentifier.vr] = Representations.uniqueIdentifier;
            map[Representations.unsignedLong.vr] = Representations.unsignedLong;
            map[Representations.unknown.vr] = Representations.unknown;
            map[Representations.unsignedShort.vr] = Representations.unsignedShort;
            map[Representations.unlimitedText.vr] = Representations.unlimitedText;

            return map;
        }

        private static lookupMap = Representations.createMap();

        /**
         * @param {string} vr - the 2 character identification of the DICOM VR.
         * @returns {Representation} The representation instance that matches the VR.
         * @throws {Error} when the vr argument is not a valid DICOM VR.
         */
        public static lookup(vr: string): Representation {
            var representation = Representations.lookupMap[vr];
            if (representation == null) {
                throw new Error("Invalid data: detected unknown VR: " + vr);
            }

            return representation;
        }
    }
} 