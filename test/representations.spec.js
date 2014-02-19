/// <reference path="../lib/jasmine.js"/>
/// <reference path="../src/vdicom.js"/>

describe("jsDICOM - Dicom.Representations", function () {
    it("should be able to lookup all defined DICOM VRs", function () {
        var representation = Dicom.Representations.lookup("IS");
        expect(representation).toBe(Dicom.Representations.integerString);
        expect(Dicom.Representations.lookup("AE")).toBe(Dicom.Representations.applicationEntity);
    });

    it("should be able to handle an invalid VR", function () {
        // TODO
    });

    it("should be able to handle future VRs", function () {
        // TODO
    });
});
