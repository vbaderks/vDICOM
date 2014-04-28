/// <reference path="../lib/jasmine.js"/>
/// <reference path="../src/vdicom.js"/>

describe("vDICOM - Age String", function () {
    it("should be able to understand VR Age String", function () {
        expect(Dicom.Representations.ageString.isLength32Bit).toBeFalsy();
        expect(Dicom.Representations.ageString.isTextEncodingSensitive).toBeFalsy();
    });

    it("should be able to create Age String variants", function () {
        var variant = new Dicom.Variant(Dicom.Representations.ageString, "018M");
        expect(variant.values[0]).toBe("018M");
        expect(variant.count).toBe(1);

        variant = new Dicom.Variant(Dicom.Representations.ageString, ["018M", "019D"]);
        expect(variant.values[0]).toBe("018M");
        expect(variant.values[1]).toBe("019D");
        expect(variant.count).toBe(2);
    });

    it("should be able to serialize Age String variants", function() {
        var variant = new Dicom.Variant(Dicom.Representations.ageString, "018M");
        var serializer = new Dicom.Serializer();
        //serializer.
    });
});
