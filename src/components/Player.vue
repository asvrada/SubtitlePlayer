<template>
    <div id="player" v-show="player.state !== 'EMPTY'">
        <div id="area-time">
            <!-- Format:
            hh:mm:ss,mmm / hh:mm:ss,mmm
            -->
            <div>
                <div id="timestamp" v-on:dblclick="dbClickTimestamp">
                    {{ cur_hour }}:{{ cur_min }}:{{ cur_sec }},{{ cur_mill }}
                    / {{ max_hour }}:{{ max_min }}:{{ max_sec }},{{ max_mill }}
                </div>
                <div id="edit-timestamp" v-show="userEditing">
                    <p>Input format: hh:mm:ss,millsec</p>
                    <input placeholder="hh:mm:ss" v-model="editCur" v-on:keyup.enter="submitTimestamp">
                    <button v-on:click="submitTimestamp">Go</button>
                </div>
            </div>

            <div id="range-input">
                <input type="range" min="0" v-bind:max="player.maxMillSec" v-model:value="sliderCurComputed"
                       v-on:input="onSliderInput" v-on:change="onSliderChange">
            </div>
        </div>
        <div id="area-controls">
            <button v-show="player.state === 'PAUSE'" v-on:click="play">
                Play
            </button>
            <button v-show="player.state === 'PLAYING'" v-on:click="pause">
                Pause
            </button>
        </div>

        <div id="area-subtitles">
            <p>{{player.curScript ? player.curScript.text : ""}}</p>
            <!--<p>{{ subtitle }}</p>-->
        </div>
    </div>
</template>

<script>
    import j from "../Helper";
    import Player from "../Player";

    export default {
        name: "Player",
        props: ["scripts"],
        watch: {
            // watch it
            scripts: function (newVal) {
                this.player.load(newVal);
            }
        },
        data: function () {
            return {
                player: new Player(),
                userEditing: false,
                editCur: 0,
                sliderCur: null
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
                    this.editCur = this.cur_hour + ':' + this.cur_min + ':' + this.cur_sec + ',' + this.cur_mill;
                }

                // toggle 输入区域
                this.userEditing = !this.userEditing;
            },
            submitTimestamp() {
                const userInput = this.editCur;

                this.userEditing = false;
                this.player.pause();

                // [hh:]mm:ss[,mmm]
                const reTimeStamp = /(?:(\d+):)?(\d+):(\d+)(?:,(\d+))?/g;
                let match = reTimeStamp.exec(userInput);
                if (match.length !== 5) {
                    alert('Exception: Illegal input: ' + userInput + '\nPlease try again');
                    throw 'Exception: Illegal input: ' + userInput + '\nPlease try again';
                }

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

<style scoped lang="scss">
    #player {
        #area-time {
            #timestamp {
                font-size: 1.5em;
            }

            #edit-timestamp {
                span {

                }
                input {

                }
                button {

                }
            }

            #range-input {
                input {
                    width: 70%;
                }
            }
        }

        #area-controls {
            button {
                height: 1.5em;
                width: 4em;
                font-size: 2em;
            }
        }

        #area-subtitles {
            font-size: 2em;
        }
    }
</style>