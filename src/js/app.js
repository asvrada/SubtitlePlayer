import Vue from 'vue/dist/vue.js';
import j from './helper';

import '../sass/app.scss';

const STATE = {
    noFileLoaded: '0',
    playing: '1',
    paused: '2',
    sliding: '3'
};

const REFRESH_INTERVAL = 233;

// 加载文件
function LoadFile(file) {
    let fileReader = new FileReader();

    // 先设置好加载时使用的 onload 函数
    fileReader.onload = function (e) {
        const arrayOfStrings = e.target.result.split("\n");
        loadFile(arrayOfStrings);
    };
    // 读取文件
    fileReader.readAsText(file);

    /**
     * Go through strings and parse out the info
     * @param {Array} arrayStrings
     */
    function loadFile(arrayStrings) {
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

                app.$data.file.scripts.push(script);
            }
        }

        // 修改结果
        // 由于这段代码需要在这个 callback 函数执行后才能正常工作
        // 所以只能放在这里
        app.$data.state = app.STATE.paused;
        app.$data.file.name = file.name;
        app.$data.file.maxMill = app.$data.file.scripts[app.$data.file.scripts.length - 1].timeStamp.to;
        app.$data.file.index = 0;
    }
}

/**
 * Player Class
 * 控制setInterval的运行
 */
class Player {
    constructor() {
        /**
         * setInterval 的 job ID
         */
        this.job = undefined;

        /**
         * 基准时间
         * @type {undefined}
         */
        this.zeroDate = undefined;

        /**
         * 继续播放需要抵消的时间
         * @type {number}
         */
        this.resumeTime = 0;
    }

    play() {
        if (this.job !== undefined) {
            throw 'Exception: Job already running';
        }

        this.zeroDate = new Date();
        this.resumeTime = app.cur;

        this.job = setInterval((function (that) {
            return function () {
                const cur = new Date() - that.zeroDate + that.resumeTime;

                app.cur = cur;
                app.scriptAtCursor();
            }
        })(this), REFRESH_INTERVAL);
    }

    pause() {
        clearInterval(this.job);
        this.job = undefined;
        this.zeroDate = undefined;
    }

    reset() {

    }
}

// Vue.js
const app = new Vue({
    el: '#app',
    data: {
        showAreaTimeInput: false,
        /**
         * 文件的有关信息
         */
        file: {
            name: "",
            scripts: [],
            /**
             * 上个播放的index
             */
            index: undefined,
            maxMill: 0
        },
        STATE: {
            noFileLoaded: '0',
            playing: '1',
            paused: '2',
            sliding: '3'
        },
        /**
         * 当前状态
         * @param {string}
         */
        state: '0',
        /**
         * runtime 的参数
         */
        runtime: {
            /**
             * 当前滑块所在时间，毫秒为单位
             * @param {number}
             */
            cur: 0,
            /**
             * 实际用于在数组中查询的index
             */
            currentIndex: undefined,
            /**
             * @param {Player}
             */
            player: new Player()
        },
        // 用户输入的时间
        newCur: '0'
    },
    computed: {
        /**
         * wrapper of runtime.cur
         */
        cur: {
            get: function () {
                return this.runtime.cur;
            },
            /**
             * 检测时间的合理性
             * @param {number} newVal
             */
            set: function (newVal = 0) {
                if (newVal < 0) {
                    newVal = 0;
                }
                if (newVal > this.file.maxMill) {
                    this.changeState(STATE.paused);
                    newVal = this.file.maxMill;
                }

                this.runtime.cur = newVal;
            }
        },
        /**
         * 字符串表示的cur
         * @param {string}
         */
        cur_str: {
            get: function () {
                return this.cur.toString();
            },
            set: function (newValue) {
                let val = parseInt(newValue);
                if (isNaN(val)) {
                    throw 'Exception: not a number: ' + newValue;
                }

                this.cur = val > this.file.maxMill ? this.file.maxMill : val;
            }
        },
        /**
         * 简单映射 file.index
         * 不超出范围
         * 用于作为数组index的cur
         * @param {number|undefined}
         */
        index: {
            get: function () {
                return this.file.index;
            },
            set: function (newValue) {
                // clamp
                if (newValue < 0) {
                    newValue = 0;
                }

                if (newValue >= this.file.scripts.length) {
                    newValue = this.file.scripts.length;
                }

                this.file.index = newValue;
            }
        },
        /**
         * 主字幕
         */
        title: function () {
            return this.runtime.currentIndex === undefined ? '' : this.file.scripts[this.runtime.currentIndex].title;
        },
        /**
         * 副字幕
         */
        subtitle: function () {
            return this.runtime.currentIndex === undefined ? '' : this.file.scripts[this.runtime.currentIndex].subtitle;
        },
        /**
         * 用户输入的时间
         * 格式为
         * [hh:]mm:ss[,mmm]
         */
        cur_str_formated: function () {
            return this.cur_hour + ':' + this.cur_min + ':' + this.cur_sec + ',' + this.cur_mill;
        },
        cur_hour: function () {
            return j.padZero(j.getHours(this.cur), 2);
        },
        cur_min: function () {
            return j.padZero(j.getMinutes(this.cur), 2);
        },
        cur_sec: function () {
            return j.padZero(j.getSeconds(this.cur), 2);
        },
        cur_mill: function () {
            return j.padZero(j.getMilliseconds(this.cur), 3);
        },
        max_hour: function () {
            return j.padZero(j.getHours(this.file.maxMill), 2);
        },
        max_min: function () {
            return j.padZero(j.getMinutes(this.file.maxMill), 2);
        },
        max_sec: function () {
            return j.padZero(j.getSeconds(this.file.maxMill), 2);
        },
        max_mill: function () {
            return j.padZero(j.getMilliseconds(this.file.maxMill), 3);
        }
    },
    methods: {
        /**
         * 改变状态
         * @param newState
         */
        changeState: function (newState) {
            let prevState = this.state;
            this.state = newState;
            let nextState = this.state;

            const stateChangeTable = {
                // noFileLoaded
                '0': function (that, to, from = STATE.noFileLoaded) {

                },
                // playing
                '1': function (that, to, from = STATE.playing) {
                    switch (to) {
                        case STATE.paused:
                            that.$data.runtime.player.pause();
                            break;
                        default:
                            break;
                    }
                },
                // paused
                '2': function (that, to, from = STATE.paused) {
                    switch (to) {
                        case STATE.playing:
                            // 如果播放结束，则从头开始
                            if (that.cur >= that.file.maxMill) {
                                that.cur = 0;
                                that.relocateIndex();
                                // todo: bug: 状态仍然是 paused
                                // quick fix
                                that.state = STATE.playing;
                            }

                            that.$data.runtime.player.play();
                            break;
                        default:
                            break;
                    }
                },
                // siliding
                '3': function (that, to, from = STATE.sliding) {
                    switch (to) {
                        default:
                            break;
                    }
                }
            };

            stateChangeTable[prevState](this, nextState);
        },
        /**
         * 默认index 就只落后实际情况一点
         * 根据 cur, index 设置 runtime.currentIndex
         */
        scriptAtCursor: function () {
            // "缓存"常用数据
            const cur = this.cur;
            const scripts = this.file.scripts;

            let index = this.index;
            // 跳过已结束的字幕
            while (scripts[index].timeStamp.to < cur) {
                index += 1;
            }
            // 设置 index
            this.index = index;

            if (cur < scripts[index].timeStamp.from) {
                // 还未到下一个
                // 显示空白
                this.runtime.currentIndex = undefined;
            } else {
                this.runtime.currentIndex = index;
            }
        },
        /**
         * 重新开始播放 或者 滑块停止移动后 或者 输入时间后
         * 调用该函数重新设置 index
         */
        relocateIndex: function () {
            this.changeState(STATE.paused);
            // todo: 二分法找index
            this.index = 0;
        },
        /**
         * 用户双击了时间改变区域
         */
        toggleTimeInput: function () {
            // 仅当该区域由隐藏变为显示时，运行以下代码
            if (!this.$data.showAreaTimeInput) {
                // 状态变为暂停
                this.changeState(STATE.paused);
                // 将当前时间写入input
                this.newCur = this.cur_str_formated;
            }

            // toggle 输入区域
            this.$data.showAreaTimeInput = !this.$data.showAreaTimeInput;
        },
        btnSetTime: function () {
            // 计算用户的输入时间是多少毫秒
            const input = this.newCur;

            // [hh:]mm:ss[,mmm]
            const reTimeStamp = /(?:(\d+):)?(\d+):(\d+)(?:,(\d+))?/g;
            let match = reTimeStamp.exec(input);
            if (match.length !== 5) {
                alert('Exception: Illegal input: ' + input + '\nPlease try again');
                throw 'Exception: Illegal input: ' + input + '\nPlease try again';
            }

            const cur = j.convertToMillisec(match[1], match[2], match[3], match[4]);

            // 设置当前时间
            this.cur = cur;
            // 重置 index
            this.relocateIndex();

            // 关闭显示
            this.$data.showAreaTimeInput = false;
        },
        btnPlay: function () {
            this.changeState(STATE.playing);
        },
        btnPause: function () {
            this.changeState(STATE.paused);
        },
        // Trigger on mouse release
        onSliderChange: function ()  {
            this.relocateIndex();
            this.scriptAtCursor();
        },
        // Trigger on mouse click
        onSliderInput: function () {
            this.changeState(STATE.paused);
        },
        filesChange: function (fileList) {
            if (typeof fileList !== 'object' || fileList.length === 0) {
                throw 'Exception: Failed to load file';
            }

            // 删除原先的文件
            this.$data.state = this.STATE.noFileLoaded;
            this.$data.file.name = "";
            this.$data.file.scripts = [];
            this.$data.file.maxMill = 0;

            LoadFile(fileList[0]);
        },
        mountFile: function (fileObj) {
            this.file = fileObj;
        }
    }
});
