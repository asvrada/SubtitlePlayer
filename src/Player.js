const STATE = {
    EMPTY: 'EMPTY',
    PAUSE: 'PAUSE',
    PLAYING: 'PLAYING',
    CHANGING: 'CHANGING'
};


export default class Player {
    constructor() {
        this.INTERVAL_SPEED = 233;
        this.scripts = null;

        this.state = STATE.EMPTY;

        // 字幕总时长
        this.maxMillSec = null;

        // Job ID for setTimeInterval
        this.jobID = null;
        // Time started playing
        this.beginPlayTime = null;
        // Time resumed playing
        this.resumeTime = null;

        /**
         * cursor at when we are playing right now in millsec
         * @param: {number | null}
         */
        this.cur = null;
        /**
         * Index of script the cursor is at right now
         * @param: {number | null}
         */
        this.curIndex = null;
        this.curScript = null;
    }

    load(scripts) {
        this.reset();

        this.scripts = scripts;

        this.state = STATE.PAUSE;
        this.maxMillSec = scripts[scripts.length - 1]["endTime"];

        this.cur = 0;
        this.curIndex = 0;
    }

    /**
     * Reset everything
     */
    reset() {
        this.state = STATE.EMPTY;

        this.scripts = null;

        if (this.jobID) {
            clearInterval(this.jobID);
            this.jobID = null;
        }

        this.beginPlayTime = null;
        this.resumeTime = null;
        this.maxMillSec = null;

        this.cur = null;
        this.curIndex = null;
        this.curScript = null;
    }

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
    }

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
    }

    moveCursorTo(millsec) {
        this.pause();

        this.resumeTime = millsec;
        this.curIndex = 0;
        this.cur = millsec;

        this.curScript = this.getCurScript();
    }

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
}