export default {
    /**
     * 填充一定数量的前置0
     * @param num
     * @param size: size of the zero-padded string
     * @returns {string}
     */
    padZero: function (num, size = 0) {
        num = num.toString();
        while (num.length < size) num = '0' + num;
        return num;
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
    },
};
