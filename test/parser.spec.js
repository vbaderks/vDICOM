/// <reference path="../lib/jasmine.js"/>
/// <reference path="../src/vdicom.js"/>

function MemoryStream() {
    this.buffer = new Uint8Array(4000);
    this.position = 0;
}

/**
 * @param buffer: ArrayBuffer
*/
MemoryStream.prototype.write = function(buffer) {
    var byteArray = new Uint8Array(buffer);
    for (var i = 0; i < byteArray.length; i++) {
        this.buffer[this.position + i] = byteArray[i];
    }
    this.position += byteArray.length;
};

MemoryStream.prototype.getBuffer = function() {
    if (!ArrayBuffer.prototype.slice) {
        ArrayBuffer.prototype.slice = function(start, end) {
            var that = new Uint8Array(this);
            if (end == undefined) end = that.length;
            var result = new ArrayBuffer(end - start);
            var resultArray = new Uint8Array(result);
            for (var i = 0; i < resultArray.length; i++)
                resultArray[i] = that[i + start];
            return result;
        };
    }

    return this.buffer.buffer.slice(0, this.position);
};

function writeTag(stream, tag) {
    writeUInt16(stream, tag.groupNumber);
    writeUInt16(stream, tag.elementNumber);
}

function writeRepresentation(stream, representation) {
    var buffer = new Uint8Array(2);
    buffer[0] = representation.vr.charCodeAt(0);
    buffer[1] = representation.vr.charCodeAt(1);
    stream.write(buffer.buffer);
}

function writeUInt16(stream, value) {
    var buffer = new ArrayBuffer(2);
    var view = new DataView(buffer);
    view.setUint16(0, value, true);
    stream.write(buffer);
}

function writeUInt32(stream, value) {
    var buffer = new ArrayBuffer(4);
    var view = new DataView(buffer);
    view.setUint32(0, value, true);
    stream.write(buffer);
}

function writeElement(stream, tag, variant) {
    writeTag(stream, tag);
    writeRepresentation(stream, variant.representation);
    if (variant.representation.isLength32Bit) {
        writeUInt16(stream, 0);
        writeUInt32(stream, variant.length);
    } else {
        writeUInt16(stream, element.size);
    }
}

describe("jsDICOM - Dicom.Parser", function () {
    it("should be able to read elements in Explicit Little Endian", function () {
        var elements = new Array();
        var tagExpected = new Dicom.Tag(0x00020010);
        var variantExpected = new Dicom.Variant(Dicom.Representations.integerString, null);
        elements[Number(tagExpected)] = variantExpected;

        var stream = new MemoryStream();
        elements.forEach(function(variantValue, tagValue) {
            writeElement(stream, new Dicom.Tag(tagValue), variantValue);
        });

        var tag = null;
        var variant = null;
        var parser = new Dicom.Parser();
        parser.ontag = function(t) {
            tag = t;
        };
        parser.onelement = function(t, v) {
            variant = v;
        };

        var b = stream.getBuffer();
        parser.parse(b);

        expect(tag.isEqual(tagExpected)).toBeTruthy();
        expect(variant.isEqual(variantExpected)).toBeTruthy();
    });
});
