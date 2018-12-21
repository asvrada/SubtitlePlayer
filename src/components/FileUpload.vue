<template>
    <div id="app">
        <drop-zone id="drop-zone" v-on:fileUploaded="onFileUpload"></drop-zone>
        <button id="btn_demo" @click="loadDemo">Load Demo</button>
    </div>
</template>

<script>
    import {loadFile} from '../classes/FileLoader';
    import DropZone from './DropZone';

    import * as parser from "subtitles-parser";

    /**
     * events emited:
     * `scriptLoaded`
     */
    export default {
        name: "FileUpload",
        components: {DropZone},
        methods: {
            loadDemo() {
                const self = this;
                const PATH_DEMO = "./demo_martian.srt";
                fetch(PATH_DEMO).then(function (response) {
                    response.text().then(function (data) {
                        const scripts = parser.fromSrt(data, true);
                        self.$emit('scriptLoaded', {
                            scripts: scripts,
                            name: "demo_martian.srt"
                        });
                    });
                });
            },
            onFileUpload(newFile) {
                newFile = newFile[0];
                // add
                const self = this;
                loadFile(newFile).then(function (data) {
                    self.$emit('scriptLoaded', data);
                }).catch(function (err) {
                    alert(err);
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../sass/color-pattern-night";

    #app {
        #drop-zone {
            position: relative;
            display: inline-block;

            margin: 10px;

            width: 150px;
            height: 100px;
        }

        #btn_demo {
            position: relative;
            top: -63px;

            cursor: pointer;

            margin: 10px;

            width: 50px;
            height: 100px;

            border: 0;
            border-radius: 15px;
            background: #303F9F;
            color: white;
        }
    }
</style>