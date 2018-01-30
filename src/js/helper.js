const _export = {

    /**
     * Return true if the given obj is empty
     * @param obj
     * @returns {boolean}
     */
    isEmpty: function (obj) {
        // Check for null
        if (obj === null) {
            return true;
        }

        let result = false;

        switch (typeof obj) {
            case 'undefined':
                result = true;
                break;
            case 'object':
                // 有 length 属性且为 0 -> true
                if (obj.hasOwnProperty('length') && obj.length === 0) {
                    result = true;
                } else {
                    result = false;
                }
                break;
            case 'boolean':
                // false -> isEmpty:true
                result = !obj;
                break;
            case 'number':
                // 只有0才是true
                result = (obj === 0);
                break;
            case 'string':
                result = this.isEmptyString(obj);
                break;
            case 'function':
                result = false;
                break;
            default:
                throw 'Exception: Unknow type of obj' + obj;
        }

        return result;
    },

    /**
     * // 空字符串或者全为空格为true
     * @param str
     * @returns {boolean}
     */
    isEmptyString: function (str) {
        return str.trim() === '';
    },

    isNumber: function (val) {
        return typeof val === 'number';
    },

    /**
     * 填充一定数量的前置0
     * @param val
     * @param length
     * @returns {string}
     */
    padZero: function (val, length = 0) {
        let str = "" + val;
        let pad = new Array(length + 1).join('0');
        return pad.substring(0, pad.length - str.length) + str;
    },

    /**
     * 将时分秒转化为毫秒
     * @param {number|string} h
     * @param {number|string} m
     * @param {number|string} s
     * @param {number|string} milli
     * @returns {number}
     */
    convertToMillisec: function (h = 0, m = 0, s = 0, milli = 0) {
        h = parseInt(h);
        m = parseInt(m) % 60;
        s = parseInt(s) % 60;
        milli = parseInt(milli) % 1000;

        return h * 3600000 // 60*60*1000
            + m * 60000 // 60*1000
            + s * 1000
            + milli;
    },

    getHours: function (millsec) {
        // 60 * 60 * 1000
        return Math.floor(millsec / 3600000);
    },
    getMinutes: function (millsec) {
        // 60 * 1000
        return Math.floor(millsec / 60000) % 60;
    },
    getSeconds: function (millsec) {
        // 1000
        return Math.floor(millsec / 1000) % 60;
    },
    getMilliseconds: function (millsec) {
        return millsec % 1000;
    }
};

export default _export;