/**
 * Copyright (C) 2014 Victor Derks
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 */

module Dicom {
    /**
     * @classdesc Represents a DICOM part 10 file.
     */
    export class File {
        public fileMetainfo;
        public dataSet;
        constructor(fileMetainfo, dataSet) {
            this.fileMetainfo = fileMetainfo;
            this.dataSet = dataSet;
        }

        // Load function for node.js stream object.
        public static loadFromStream(stream) {
            
        }

        public static loadFromArrayBuffer(buffer: ArrayBuffer) {
        
        }
    }
} 