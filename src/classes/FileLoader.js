import * as parser from "subtitles-parser";

import * as jschardet from "jschardet";
import * as iconv from "iconv-lite";

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
            throw `File Type not supported: ${fileExt}\nSupported types: ${Object.keys(loaders)}`;
        }

        const fileReader = new FileReader();
        // onload
        fileReader.onload = function (event) {
            // 文本位于 event.target.result
            try {
                const data = event.target.result;

                const coding = jschardet.detect(data);
                const decodedData = iconv.decode(data, coding["encoding"]);

                const ret = loaders[fileExt](decodedData);
                resolve({
                    scripts: ret,
                    name: file.name
                });
            } catch (e) {
                reject(e);
            }
        };

        fileReader.readAsBinaryString(file);
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

export {loadFile};
