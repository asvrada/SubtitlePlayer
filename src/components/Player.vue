<template>
    <div class="container" id="player" v-show="player.state !== 'EMPTY'">
        <!--status bar-->
        <div class="row" id="area-title">Playing: <span> {{ title }} </span></div>

        <!--area for time display-->
        <div class="row" id="area-time">
            <div class="container">
                <!-- Format:
                hh:mm:ss,mmm / hh:mm:ss,mmm
                -->
                <div class="row" id="timestamp" v-on:dblclick="dbClickTimestamp">
                    <i id="btn_set_timestamp" @click="dbClickTimestamp" class="fas fa-sliders-h"></i>
                    {{ cur_hour }}:{{ cur_min }}{{time_indicator}}{{ cur_sec }}
                    / {{ max_hour }}:{{ max_min }}:{{ max_sec }}
                </div>

                <div class="row" id="edit-timestamp" v-show="userEditing">
                    <p>Input Format: <span class="timeformat">hh:mm:ss</span> or <span class="timeformat">mm:ss</span>
                    </p>
                    <input id="time-input"
                           placeholder="hh:mm:ss"
                           v-model="editTimestamp"
                           v-on:keyup.enter="submitTimestamp"
                           v-on:keyup.esc="dbClickTimestamp">
                    <div class="row">
                        <button id="btn_jumpto" class="btn" v-on:click="submitTimestamp">Jump to</button>
                        <button id="btn_cancel" class="btn" v-on:click="dbClickTimestamp">Cancel</button>
                    </div>
                </div>

                <!--time slider-->
                <div class="row" id="range-input">
                    <input class="slider" type="range" min="0" v-bind:max="player.maxMillSec"
                           v-model:value="sliderCurComputed"
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

        <div class="row center" id="area-subtitles">
            <div id="subtitle-wrapper">
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
            // watch it
            scripts: function ({scripts, name}) {
                this.player.load(scripts);
                this.title = name;
            }
        },
        data: function () {
            return {
                title: "",
                player: new Player(),
                userEditing: false,
                editTimestamp: "",
                sliderCur: ""
            };
        },
        methods: {
            play() {
                this.player.play();
            },
            pause() {
                this.player.pause();
            },
            dbClickTimestamp() {
                // 仅当该区域由隐藏变为显示时，运行以下代码
                if (!this.userEditing) {
                    // 状态变为暂停
                    this.pause();
                    // 将当前时间写入input
                    this.editTimestamp = this.cur_hour + ':' + this.cur_min + ':' + this.cur_sec;
                }

                // toggle 输入区域
                this.userEditing = !this.userEditing;
            },
            submitTimestamp() {
                const userInput = this.editTimestamp;

                // [hh:]mm:ss[,mmm]
                const reTimeStamp = /^(?:(\d{0,2}):)?(\d{0,2}):(\d{0,2})(?:,(\d{0,3}))?$/;
                let match = reTimeStamp.exec(userInput);
                if (match === null) {
                    // 重新将当前时间写入input
                    this.editTimestamp = this.cur_hour + ':' + this.cur_min + ':' + this.cur_sec;

                    alert(`Un-acceptable input format: ${userInput}\nPlease fix and try again`);
                    return;
                }

                // 跳转到用户输入的时间
                this.userEditing = false;
                this.player.pause();

                const cur = j.convertToMillisec(match[1], match[2], match[3], match[4]);

                // 设置当前时间
                this.player.moveCursorTo(cur);
            },
            onSliderInput() {
                this.player.moveCursorTo(parseInt(this.sliderCur));
            },
            onSliderChange() {
                this.player.moveCursorTo(parseInt(this.sliderCur));
            }
        },
        computed: {
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
            sliderCurComputed: {
                get() {
                    return (this.player.cur || 0).toString();
                },
                set(newVal) {
                    this.sliderCur = newVal;
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
                padding: 1em;
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
                .slider {
                    border: 0;
                    -webkit-appearance: none;
                    width: 100%;
                    height: 30px;
                    background: #000000;
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
                    border-radius: 10px;
                    background-color: rgba(128, 128, 128, 0.5);
                    font-size: 2em;
                    margin: 0;
                }
            }

        }
    }
</style>