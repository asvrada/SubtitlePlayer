import {sprintf} from "sprintf-js";
import j from "./Helper";

/**
 * Main Entry for loading files
 * @param {File} file
 */
function loadFile(file) {
    // Return a Promise
    return new Promise((resolve, reject) => {
        const loaders = {
            "srt": loadExtSRT,
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
                resolve(ret);
            } catch (e) {
                reject(e);
            }
        };

        fileReader.readAsText(file);
    });
}

function loadExtSRT(data) {
    const arrayStrings = data.match(/[^\r\n]+/g);

    /*
    File Format:
    ---------------------
    id (Required): 数字
    time stamp (Required): hh:mm:ss,mmm --> hh:mm:ss,mmm
    title (Optional): 字符串
    subtitle (Optional): 字符串
    空行 (Required)
    ----------------------
     */
    const scripts = [];
    /**
     * 用于保存当前数据
     * @type {Array}
     */
    const stackCache = [];
    let cur = 0;

    // 手动在末尾添加空行
    arrayStrings.push('');
    while (cur < arrayStrings.length) {
        let current = arrayStrings[cur].trim();
        cur += 1;

        if (!j.isEmptyString(current)) {
            stackCache.push(current);
        } else {
            if (j.isEmpty(stackCache)) {
                // 忽略多个空行
                continue;
            }

            /**
             * 单个字幕组
             * @type {{id: number, timeStamp: {from, to}, title: undefined|string, subtitle: undefined|string}}
             */
            let script = {
                /**
                 * 转换数字ID
                 */
                id: (function (str) {

                    const id = parseInt(str);
                    if (isNaN(id)) {
                        throw 'Exception: Failed to parse number: ' + str;
                    }

                    return id;
                })(stackCache.shift()),
                /**
                 * 分析时间起始信息
                 */
                timeStamp: (function (timeStamp) {
                    const reTimeStamp = /(\d{0,2}):(\d{0,2}):(\d{0,2}),(\d{0,3}) --> (\d{0,2}):(\d{0,2}):(\d{0,2}),(\d{0,3})/g;

                    let match = reTimeStamp.exec(timeStamp);
                    if (match.length !== 9) {
                        throw 'Exception: Illegal Time Stamp Format: ' + timeStamp;
                    }

                    match.shift();
                    match = match.map(function (each) {
                        return parseInt(each);
                    });

                    return {
                        from: j.convertToMillisec(match[0], match[1], match[2], match[3]),
                        to: j.convertToMillisec(match[4], match[5], match[6], match[7]),
                    };
                })(stackCache.shift()),
                title: stackCache.shift(),
                subtitle: stackCache.shift()
            };

            scripts.push(script);
        }
    }
    return scripts;
}

export {loadFile};
