<template>
    <div id="player" v-show="player.state !== 'EMPTY'">
        <!--status bar-->
        <div class="row" id="area-title">PLAYING: <span> {{ title }} </span></div>

        <!--area for time display-->
        <div class="row" id="area-time">
            <div class="container">
                <!-- Format:
                hh:mm:ss,mmm / hh:mm:ss,mmm
                -->
                <div id="timestamp" v-on:dblclick="handleDoubleClickTimestamp">
                    <i id="btn_set_timestamp" @click="handleDoubleClickTimestamp" class="fas fa-sliders-h"></i>
                    {{ cur_hour }}:{{ cur_min }}{{time_indicator}}{{ cur_sec }}
                    / {{ max_hour }}:{{ max_min }}:{{ max_sec }}
                </div>

                <div id="edit-timestamp" v-show="showTimeInput">
                    <p>Input Format: <span class="timeformat">hh:mm:ss</span> or <span class="timeformat">mm:ss</span>
                    </p>
                    <input id="time-input"
                           placeholder="hh:mm:ss"
                           v-model="modelTimestamp"
                           v-on:keydown.enter="submitTimestamp"
                           v-on:keydown.esc="handleDoubleClickTimestamp">
                    <div>
                        <button id="btn_jumpto" class="btn" v-on:click="submitTimestamp">Jump to</button>
                        <button id="btn_cancel" class="btn" v-on:click="handleDoubleClickTimestamp">Cancel</button>
                    </div>
                </div>

                <!--time slider-->
                <div id="range-input">
                    <input class="slider" type="range" min="0" v-bind:max="slider_max_val"
                           v-model="sliderCurComputed"
                           v-on:input="onSliderInput" v-on:change="onSliderChange">
                </div>
            </div>
        </div>

        <!--buttons, controls-->
        <div class="row" id="area-controls">
            <button class="btn" id="btn_play" v-show="player.state === 'PAUSE'" v-on:click="play">
                Play
            </button>
            <button class="btn" id="btn_pause" v-show="player.state === 'PLAYING'" v-on:click="pause">
                Pause
            </button>
        </div>

        <div class="row" id="area-subtitles">
            <div id="subtitle-wrapper" v-show="!!player.curScript">
                <p>{{player.curScript ? player.curScript.text : ""}}</p>
                <!--todo-->
                <!--<p>{{ subtitle }}</p>-->
            </div>
        </div>
    </div>
</template>

<script>
    import j from "../classes/Helper";
    import Player from "../classes/Player";

    export default {
        name: "Player",
        props: ["scripts"],
        watch: {
            // when change
            scripts: function ({scripts, name}) {
                this.player.load(scripts);
                this.title = name;
            }
        },
        mounted() {
            const self = this;

            window.addEventListener("keydown", function (e) {
                self.handleKeydown(e);
            })
        },
        data: function () {
            return {
                title: "",
                player: new Player(),
                showTimeInput: false,
                modelTimestamp: "",
                currentCursor: 0,
                // number of values for <input range>
                sliderStep: 500
            };
        },
        methods: {
            play() {
                this.player.play();
            },
            pause() {
                this.player.pause();
            },
            handleKeydown(e) {
                // when user try to type something into the <input> field, ignore
                if (this.showTimeInput) {
                    return
                }

                const key = e.key;
                const acceptKey = [" ", "ArrowLeft", "ArrowRight"];

                // if not what keypress that we are interested, ignore
                if (!acceptKey.includes(key)) {
                    return;
                }

                const self = this;

                const table = {
                    " ": () => {
                        // toggle play/pause
                        if (self.player.state === "PAUSE") {
                            self.play();
                        } else if (self.player.state === "PLAYING") {
                            self.pause();
                        }
                    },
                    "ArrowLeft": () => {
                        // todo: rewind by 1 second
                    },
                    "ArrowRight": () => {
                        // todo: advance by 1 second
                    }
                };

                table[key]();

                // finally, stop default behavior
                e.stopPropagation();
                e.preventDefault();
            },
            handleDoubleClickTimestamp() {
                // 仅当该区域由隐藏变为显示时，运行以下代码
                if (!this.showTimeInput) {
                    // 状态变为暂停
                    this.pause();
                    // 将当前时间写入input
                    this.modelTimestamp = this.cur_hour + ':' + this.cur_min + ':' + this.cur_sec;
                }

                // toggle 输入区域
                this.showTimeInput = !this.showTimeInput;
            },
            submitTimestamp() {
                const userInput = this.modelTimestamp;

                // [hh:]mm:ss[,mmm]
                const reTimeStamp = /^(?:(\d{0,2}):)?(\d{0,2}):(\d{0,2})(?:,(\d{0,3}))?$/;
                let match = reTimeStamp.exec(userInput);
                if (match === null) {
                    // 重新将当前时间写入input
                    this.modelTimestamp = this.cur_hour + ':' + this.cur_min + ':' + this.cur_sec;

                    alert(`Un-acceptable input format: ${userInput}\nPlease fix and try again`);
                    return;
                }

                // 跳转到用户输入的时间
                this.showTimeInput = false;
                this.player.pause();

                const cur = j.convertToMillisec(match[1], match[2], match[3], match[4]);

                // 设置当前时间
                this.player.moveCursorTo(cur);
            },
            onSliderInput() {
                this.player.moveCursorTo(this.currentCursor);
            },
            onSliderChange() {
                this.player.moveCursorTo(this.currentCursor);
            }
        },
        computed: {
            slider_max_val() {
                return this.sliderStep;
            },
            cur_hour() {
                return j.padZero(j.getHours(this.player.cur), 2);
            },
            cur_min() {
                return j.padZero(j.getMinutes(this.player.cur), 2);
            },
            cur_sec() {
                return j.padZero(j.getSeconds(this.player.cur), 2);
            },
            cur_mill() {
                return j.padZero(j.getMilliseconds(this.player.cur), 3);
            },
            max_hour() {
                return j.padZero(j.getHours(this.player.maxMillSec), 2);
            },
            max_min() {
                return j.padZero(j.getMinutes(this.player.maxMillSec), 2);
            },
            max_sec() {
                return j.padZero(j.getSeconds(this.player.maxMillSec), 2);
            },
            max_mill() {
                return j.padZero(j.getMilliseconds(this.player.maxMillSec), 3);
            },
            time_indicator() {
                if (this.player.state !== 'PLAYING') {
                    return ":";
                }

                // interval in millsec
                const interval = 500;
                return Math.floor(this.player.cur % (2 * interval) / interval) ? " " : ":";
            },
            // Convert between string (what the input HTML element displays)
            // and int (what this project used to represent time)
            sliderCurComputed: {
                get() {
                    const maxTimeRange = this.player.maxMillSec;
                    let cur = this.player.cur || 0;

                    cur = Math.floor(cur / maxTimeRange * this.sliderStep);

                    return cur.toString();
                },
                set(newVal) {
                    const maxTimeRange = this.player.maxMillSec;
                    let stepInput = parseInt(newVal);

                    stepInput = Math.floor(stepInput / this.sliderStep * maxTimeRange);

                    this.currentCursor = stepInput;
                }
            }
        }
    };
</script>

<style lang="scss">
    @import "../sass/color-pattern-night";

    .timeformat {
        color: $night-color-highlight;
    }

    .btn {
        border: 0;
        border-radius: 10px;

        height: 40px;
        width: 90px;

        cursor: pointer;
        font-size: 1em;
    }

    .row {
        margin: 10px;
    }

    #player {
        box-sizing: border-box;

        #area-title {
            font-size: 2em;
        }

        #area-time {

            #timestamp {
                user-select: none;

                cursor: pointer;
                font-size: 2em;
                font-family: "Lucida Console", Monaco, monospace;

                #btn_set_timestamp {
                    font-size: 0.7em;
                    color: #80808033;
                }
            }

            #edit-timestamp {
                display: inline-block;

                border-radius: 30px;
                padding: 20px;
                margin: 10px;
                background: $primary-color-dark;

                #time-input {
                    text-align: center;
                    margin-bottom: 20px;
                    width: 5em;
                    font-size: 3em;
                    color: $night-color-text;
                }

                #btn_jumpto {
                    background-color: $accent-color;
                }

                #btn_cancel {

                }

                button {
                    margin: 0 1em 0 1em;
                }
            }

            #range-input {
                max-width: 800px;

                margin: 20px auto;

                .slider {
                    border: 0;
                    -webkit-appearance: none;
                    width: 100%;
                    background: #494949;
                    height: 5px;
                    outline: none;
                    opacity: 0.7;
                    -webkit-transition: .2s;
                    transition: opacity .2s;
                }

                .slider:hover {
                    opacity: 1;
                }

                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 30px;
                    border-radius: 5px;
                    background: #ffffff;
                    cursor: pointer;
                }
            }
        }

        #area-controls {
            #btn_play {
                background-color: green;
            }

            #btn_pause {
                background-color: red;
            }
        }

        #area-subtitles {
            pointer-events: none;

            width: 100%;

            position: fixed;
            left: 0;
            bottom: 20px;

            #subtitle-wrapper {
                width: 80%;
                margin: 0 auto;
                text-align: center;

                p {
                    display: inline-block;

                    padding: 10px;
                    border-radius: 10px;
                    background-color: rgba(128, 128, 128, 0.2);
                    font-size: 2em;
                    margin: 0;
                }
            }
        }
    }
</style>