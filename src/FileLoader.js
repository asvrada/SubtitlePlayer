import {sprintf} from "sprintf-js";
import * as parser from "subtitles-parser";

/**
 * Main Entry for loading files
 * @param {File} file
 */
function loadFile(file) {
    // Return a Promise
    return new Promise((resolve, reject) => {
        const loaders = {
            "srt": loadExtSRT,
            "txt": loadExtTxt
        };

        let fileExt = null;

        // get its extension, file.name
        try {
            let arrayFileName = file.name.split(".");
            fileExt = arrayFileName[arrayFileName.length - 1].toLowerCase();
        } catch (e) {
            throw "Illegal file name " + file.name;
        }

        // Check extension
        if (!Object.keys(loaders).includes(fileExt)) {
            throw sprintf("File Type not supported: %s\nSupported types: %j", fileExt, Object.keys(loaders));
        }

        const fileReader = new FileReader();
        // onload
        fileReader.onload = function (event) {
            // 文本位于 event.target.result
            try {
                const data = event.target.result;
                const ret = loaders[fileExt](data);
                resolve({
                    scripts: ret,
                    name: file.name
                });
            } catch (e) {
                reject(e);
            }
        };

        fileReader.readAsText(file);
    });
}

// todo
function loadBlob(blob) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        // onload
        fileReader.onload = function (event) {
            // 文本位于 event.target.result
            try {
                const data = event.target.result;
                const ret = loadExtSRT(data);
                resolve({
                    scripts: ret,
                    name: "Demo 火星救援"
                });
            } catch (e) {
                reject(e);
            }
        };

        fileReader.readAsText(blob);
    });
}

function loadExtSRT(data) {
    /**
     * array of scripts
     * @type {[{id, startTime, endTime, text}]}
     */
    const scripts = parser.fromSrt(data, true);

    return scripts;
}

function loadExtTxt(data) {
    const arrayStrings = data.split(/(?:\r\n)|(?:\r)|(?:\n)/g);

    return arrayStrings;
}

export {loadFile, loadBlob};
