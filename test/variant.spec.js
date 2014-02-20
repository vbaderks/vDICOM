/// <reference path="../lib/jasmine.js"/>
/// <reference path="../src/vdicom.js"/>

describe("vDICOM - Dicom.Variant", function () {
    it("should be able to create empty variants", function () {
        var variant = new Dicom.Variant(Dicom.Representations.integerString);
        expect(variant.representation).toBe(Dicom.Representations.integerString);
        expect(variant.count).toBe(0);
    });

    it("empty variants with the same VR should be equal", function () {
        var variant0 = new Dicom.Variant(Dicom.Representations.integerString);
        var variant1 = new Dicom.Variant(Dicom.Representations.integerString);

        expect(variant0.isEqual(variant1)).toBeTruthy();
    });

    it("empty variants with the different VR should not be equal", function () {
        var variant0 = new Dicom.Variant(Dicom.Representations.integerString);
        var variant1 = new Dicom.Variant(Dicom.Representations.applicationEntity);

        expect(variant0.isEqual(variant1)).toBeFalsy();
    });
});
