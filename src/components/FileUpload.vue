<template>
    <div id="fileUploader" class="container">
        <div class="row">
            <vue-upload
                    class="file-uploader"
                    extensions="srt"
                    accept="*"
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    ref="vueUpload">
                <i class="fa fa-plus"></i>
                Select file
                <br/>
                Support format: .srt
            </vue-upload>

            <button class="waves-effect waves-light btn" id="btn_demo" @click="loadDemo">Demo</button>
        </div>
    </div>
</template>

<script>
    import {loadFile} from '../classes/FileLoader';

    import VueUpload from 'vue-upload-component';
    import * as parser from "subtitles-parser";

    /**
     * events emited:
     * `scriptLoaded`
     */
    export default {
        name: "FileUpload",
        components: {VueUpload},
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
            inputFilter(newFile, oldFile, prevent) {
                if (newFile && !oldFile) {
                    // Before adding a file
                    // 添加文件前
                    // Filter system files or hide files
                    // 过滤系统文件 和隐藏文件
                    if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                        return prevent()
                    }
                    // Filter php html js file
                    // 过滤 php html js 文件
                    if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                        return prevent()
                    }
                }
            }
            ,
            inputFile(newFile, oldFile) {
                if (newFile && !oldFile) {
                    // add
                    const self = this;
                    loadFile(newFile.file).then(function (data) {
                        self.$emit('scriptLoaded', data);
                    }).catch(function (err) {
                        alert(err);
                    });
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../sass/color-pattern-night";

    #fileUploader {
        .file-uploader {
            padding: 20px;
            border-radius: 15px;
            background: #21308e;

            cursor: pointer;
        }

        #btn_demo {
            margin: 0 0 0 20px;
            border: 0;
            border-radius: 15px;
            background: #21308e;
            color: white;

            width: 175px;
            height: 84px;
            position: relative;
            top: -37px;
        }
    }
</style>