<template>
    <div id="fileUploader" class="container">
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

    </div>
</template>

<script>
    import {loadFile} from '../classes/FileLoader';

    import VueUpload from 'vue-upload-component';

    /**
     * events emited:
     * `scriptLoaded`
     */
    export default {
        name: "FileUpload",
        components: {VueUpload},
        methods: {
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
            },
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
        }
    }
</style>