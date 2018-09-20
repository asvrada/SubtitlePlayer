<template>
    <div id="player" v-show="player.state !== 'EMPTY'">
        <!--status bar-->
        <div id="area-title">Playing: <span> {{ title }} </span></div>

        <!--area for time display-->
        <div id="area-time">
            <!-- Format:
            hh:mm:ss,mmm / hh:mm:ss,mmm
            -->
            <div id="timestamp" v-on:dblclick="dbClickTimestamp">
                {{ cur_hour }}:{{ cur_min }}{{time_indicator}}{{ cur_sec }}
                / {{ max_hour }}:{{ max_min }}:{{ max_sec }}
            </div>

            <div id="edit-timestamp" v-show="userEditing">
                <p>Input Format: <span class="timeformat">hh:mm:ss</span> -or- <span class="timeformat">mm:ss</span></p>
                <input id="time-input"
                       placeholder="hh:mm:ss"
                       v-model="editTimestamp"
                       v-on:keyup.enter="submitTimestamp"
                       v-on:keyup.esc="dbClickTimestamp">
                <button class="btn" v-on:click="submitTimestamp">Jump to</button>
                <button class="btn" v-on:click="dbClickTimestamp">Cancel</button>
            </div>

            <!--time slider-->
            <div id="range-input">
                <input type="range" min="0" v-bind:max="player.maxMillSec" v-model:value="sliderCurComputed"
                       v-on:input="onSliderInput" v-on:change="onSliderChange">
            </div>
        </div>
        <!--buttons, controls-->
        <div id="area-controls">
            <button class="btn" v-show="player.state === 'PAUSE'" v-on:click="play">
                Play
            </button>
            <button class="btn" v-show="player.state === 'PLAYING'" v-on:click="pause">
                Pause
            </button>
        </div>

        <div id="area-subtitles">
            <p>{{player.curScript ? player.curScript.text : ""}}</p>
            <!--todo-->
            <!--<p>{{ subtitle }}</p>-->
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

    .btn {
        background-color: $night-color-button;
        color: $night-color-text;
        border: none;

        font-size: 1.5em;
        width: 4em;
        height: 2em;

        margin: 5px;
    }

    #player {
        box-sizing: border-box;

        #area-title {
            font-size: 2em;
        }

        #area-time {
            #timestamp {
                cursor: pointer;
                font-size: 4em;

                #edit-timestamp {
                    background: $night-color-grey;

                    padding: 15px 0 15px 0;
                    border-radius: 15px;

                    p {
                        margin: 0 0 5px 0;
                        padding: 0;
                    }
                    input {
                        border: none;
                        padding: 0;

                        width: 7em;
                        height: 1.5em;
                        font-size: 1em;

                        text-align: center;
                    }
                    button {
                        border: 0;
                        padding: 0;

                        width: 4em;
                        height: 1.5em;
                        font-size: 1em;

                        margin-left: 1em;
                    }
                }
            }

            #time-input {
                height: 2em;
                font-size: 1em;
            }

            #range-input {
                input {
                    margin: 20px 0 20px 0;
                    width: 70%;
                }
            }
        }

        #area-controls {
            padding-bottom: 10px;
        }

        #area-subtitles {
            p {
                font-size: 2em;

                margin: 0;
                padding-top: 2em;
                height: 3em;
            }
        }

    }
</style>