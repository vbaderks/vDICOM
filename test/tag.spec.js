/// <reference path="../lib/jasmine.js"/>
/// <reference path="../src/vdicom.js"/>

describe("vDICOM - Dicom.Tag", function () {
    it("should be able to create Command tags", function () {
        var tag = new Dicom.Tag(1);
        expect(tag.groupNumber).toBe(0);
        expect(tag.elementNumber).toBe(1);
        expect(tag.isPrivate).toBeFalsy();
        expect(tag.isDataElement).toBeFalsy();
    });

    it("should be able to create file meta info tags", function () {
        var tag = new Dicom.Tag(0x00020010);
        expect(tag.groupNumber).toBe(2);
        expect(tag.elementNumber).toBe(16);
        expect(tag.isPrivate).toBeFalsy();
        expect(tag.isDataElement).toBeFalsy();
    });

    it("should be able to create private tags", function () {
        var tag = new Dicom.Tag(0x40011000, "creatorId");
        expect(tag.groupNumber).toBe(0x4001);
        expect(tag.elementNumber).toBe(0x1000);
        expect(tag.isPrivate).toBeTruthy();
        expect(tag.isDataElement).toBeTruthy();
    });

    it("should be able to act like a number", function () {
        var tag = new Dicom.Tag(0x00020010);
        expect(Number(tag)).toBe(0x00020010);
    });

    it("should have an equal operation", function () {
        var tag0 = new Dicom.Tag(0x00020010);
        var tag1 = new Dicom.Tag(0x00020010);

        expect(tag0.isEqual(tag1)).toBeTruthy();
    });

});
