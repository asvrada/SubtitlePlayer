import {sprintf} from "sprintf-js";

export class FileLoader {
    /**
     *
     * @param {File} file
     */
    constructor(file) {
        // Init variables, all class's members must be initilzed here
        this.fileReader = null;
        this.fileExt = null;
        this.supportedExts = ["srt"];

        this.loaders = {
            "srt": this.loadExtSRT
        };

        // alias for this
        const self = this;

        // get its extension, file.name
        try {
            let arrayFileName = file.name.split(".");
            this.fileExt = arrayFileName[arrayFileName.length - 1].toLowerCase();
        } catch (e) {
            throw "Illegal file name " + file.name;
        }

        if (!(this.fileExt in this.supportedExts)) {
            throw sprintf("File Type not supported: %s\nSupported types: %j", this.fileExt, this.supportedExts);
        }

        this.fileReader = new FileReader();
        this.fileReader.onload = function (event) {
            // 文本位于 event.target.result
            let data = null;

            try {
                data = event.target.result;
            } catch (e) {
                throw "Can't read content of file. Detailed Error: " + e;
            }

            self.loaders[self.fileExt](data);
        };

        this.fileReader.readAsText(file);
    }

    loadExtSRT(data) {
        console.log("Loaded: ", data);

        // Return parsed data
        return [];
    }
}