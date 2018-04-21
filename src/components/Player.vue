<template>
    <div id="player" v-show="state !== 'EMPTY'">
        <h1>Player</h1>
        <div id="area-time">
            <!-- Format:
            hh:mm:ss,mmm / hh:mm:ss,mmm
            -->
            <div id="time-meter">
                <div id="group-time-display" v-on:dblclick="">
                    {{ cur_hour }}:{{ cur_min }}:{{ cur_sec }},{{ cur_mill }}
                    / {{ max_hour }}:{{ max_min }}:{{ max_sec }},{{ max_mill }}
                </div>
            </div>
        </div>
        <div id="area-btn">
            <button id="btnPlay" v-show="state === 'PAUSE'" v-on:click="play">
                Play
            </button>
            <button id="btnPause" v-show="state === 'PLAYING'" v-on:click="pause">
                Pause
            </button>
        </div>

        <div id="area-subtitle-display">
            <p id="title">{{curScript}}</p>
            <!--<p id="subtitle">{{ subtitle }}</p>-->
        </div>
    </div>
</template>

<script>
    import j from "../Helper";

    const STATE = {
        EMPTY: 'EMPTY',
        PAUSE: 'PAUSE',
        PLAYING: 'PLAYING',
        CHANGING: 'CHANGING'
    };

    export default {
        name: "Player",
        props: ["scripts"],
        watch: {
            // watch it
            scripts: function (newVal, oldVal) {
                this.load(newVal);
            }
        },
        data: function () {
            return {
                INTERVAL_SPEED: 233,
                state: STATE.EMPTY,

                // 字幕总时长
                maxMillSec: null,

                // Job ID for setTimeInterval
                jobID: null,
                // Time started playing
                beginPlayTime: null,
                // Time resumed playing
                resumeTime: null,

                /**
                 * cursor at when we are playing right now in millsec
                 * @param: {number | null}
                 */
                cur: null,
                /**
                 * Index of script the cursor is at right now
                 * @param: {number | null}
                 */
                curIndex: null,
                curScript: null,
            };
        },
        methods: {
            load(scripts) {
                this.reset();

                this.state = STATE.PAUSE;
                this.maxMillSec = scripts[scripts.length - 1]["endTime"];

                this.cur = 0;
                this.curIndex = 0;
            },
            /**
             * Reset everything
             */
            reset() {
                this.state = STATE.EMPTY;

                if (this.jobID) {
                    clearInterval(this.jobID);
                    this.jobID = null;
                }

                this.beginPlayTime = null;
                this.resumeTime = null;
                this.maxMillSec = null;

                this.cur = null;
            },
            play() {
                if (this.state === STATE.PLAYING) {
                    return;
                }

                if (this.jobID) {
                    throw "Can't play when already playing";
                }

                this.state = STATE.PLAYING;

                this.beginPlayTime = new Date();
                this.resumeTime = this.resumeTime || 0;

                const self = this;
                this.jobID = setInterval(() => {
                    self.cur = new Date() - self.beginPlayTime + self.resumeTime;

                    if (self.cur >= self.maxMillSec) {
                        self.cur = self.maxMillSec;

                        self.pause();
                    }

                    self.curScript = self.getCurScript();
                }, this.INTERVAL_SPEED);
            },
            pause() {
                if (this.state === STATE.PAUSE) {
                    return;
                }

                this.state = STATE.PAUSE;

                if (!this.jobID) {
                    throw "Already paused";
                }
                clearInterval(this.jobID);
                this.jobID = null;

                this.resumeTime = this.cur;
            },
            moveCursorTo(millsec) {
                this.pause();

                this.resumeTime = millsec;
                this.curIndex = 0;
                this.cur = millsec;

                this.curScript = this.getCurScript();
            },
            // return script object or null
            getCurScript() {
                if (this.state === STATE.EMPTY || this.cur === null) {
                    return null;
                }

                let index = this.curIndex;

                while (this.scripts[index].endTime < this.cur) {
                    index += 1;

                    if (index >= this.scripts.length) {
                        return null;
                    }
                }

                this.curIndex = index;

                // 还没播放到下一个字幕
                if (this.cur < this.scripts[this.curIndex].startTime) {
                    return null;
                }

                return this.scripts[this.curIndex];
            }
        },
        computed: {
            cur_hour() {
                return j.padZero(j.getHours(this.cur), 2);
            },
            cur_min() {
                return j.padZero(j.getMinutes(this.cur), 2);
            },
            cur_sec() {
                return j.padZero(j.getSeconds(this.cur), 2);
            },
            cur_mill() {
                return j.padZero(j.getMilliseconds(this.cur), 3);
            },
            max_hour() {
                return j.padZero(j.getHours(this.maxMillSec), 2);
            },
            max_min() {
                return j.padZero(j.getMinutes(this.maxMillSec), 2);
            },
            max_sec() {
                return j.padZero(j.getSeconds(this.maxMillSec), 2);
            },
            max_mill() {
                return j.padZero(j.getMilliseconds(this.maxMillSec), 3);
            },
        }
    };
</script>

<style scoped>

</style>