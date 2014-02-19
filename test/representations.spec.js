/// <reference path="../lib/jasmine.js"/>
/// <reference path="../src/vdicom.js"/>

describe("vDICOM - Dicom.Representations", function () {
    it("should be able to lookup all defined DICOM VRs", function () {
        expect(Dicom.Representations.lookup("AE")).toBe(Dicom.Representations.applicationEntity);
        expect(Dicom.Representations.lookup("AS")).toBe(Dicom.Representations.ageString);
        expect(Dicom.Representations.lookup("AT")).toBe(Dicom.Representations.attributeTag);
        expect(Dicom.Representations.lookup("CS")).toBe(Dicom.Representations.codeString);
        expect(Dicom.Representations.lookup("DA")).toBe(Dicom.Representations.date);
        expect(Dicom.Representations.lookup("DS")).toBe(Dicom.Representations.decimalString);
        expect(Dicom.Representations.lookup("DT")).toBe(Dicom.Representations.dateTime);
        expect(Dicom.Representations.lookup("FL")).toBe(Dicom.Representations.floatingPointSingle);
        expect(Dicom.Representations.lookup("FD")).toBe(Dicom.Representations.floatingPointDouble);
        expect(Dicom.Representations.lookup("IS")).toBe(Dicom.Representations.integerString);
    });

    it("should be able to handle an invalid VR", function () {
        expect(Dicom.Representations.lookup.bind(null, "QQ")).toThrow();
    });

    it("should be able to handle future VRs", function () {
        // TODO
    });
});
