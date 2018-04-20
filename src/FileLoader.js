import {sprintf} from "sprintf-js";

/**
 * Main Entry for loading files
 * @param {File} file
 */
function loadFile(file) {
    const supportedExts = ["srt", "txt"];
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

    if (!supportedExts.includes(fileExt)) {
        throw sprintf("File Type not supported: %s\nSupported types: %j", fileExt, supportedExts);
    }

    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        // onload
        fileReader.onload = function (event) {
            // 文本位于 event.target.result
            let data = null;

            try {
                data = event.target.result;
            } catch (e) {
                reject("Can't read content of file. Detailed Error: " + e);
            }

            resolve(loaders[fileExt](data));
        };

        fileReader.readAsText(file);
    });
}

function loadExtSRT(data) {
    // todo: Return parsed data
    const arrStrings = data.split("\n");

    return null;
}

function loadExtTxt(data) {
    console.log("loadExtTxt");
    window.debugRaw = data;

    const arrStrings = data.match(/[^\r\n]+/g);

    window.debugArr = arrStrings;

    return null;
}

export {loadFile};
