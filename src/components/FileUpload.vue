<template>
    <div id="fileupload">
        <div id="face">
            <i class="fas fa-upload"></i>
            <div>支持的格式：.srt</div>
        </div>
        <input type="file" v-on:change="onUploadFile">
        <button v-on:click="loadDemo">载入 Demo</button>
    </div>
</template>

<script>
    import {loadFile, loadBlob} from '../FileLoader';

    /**
     * events emited:
     * `scriptLoaded`
     */
    export default {
        name: "FileUpload",
        methods: {
            onUploadFile(event) {
                const self = this;
                const files = event.target.files;

                if (files.length !== 1) {
                    throw "Wrong number of files";
                }

                loadFile(files[0]).then(function (data) {
                    self.$emit('scriptLoaded', data);
                }).catch(function (err) {
                    alert(err);
                });
            },
            loadDemo() {
                const self = this;
                const URL = "https://raw.githubusercontent.com/thissentenceiswrong/blog/master/assets/%E7%81%AB%E6%98%9F%E6%95%91%E6%8F%B4.srt";

                fetch(URL).then((data) => {
                    return data.blob();
                }).then((data) => {
                    return loadBlob(data);
                }).then((data) => {
                    self.$emit('scriptLoaded', data);
                }).catch(function (err) {
                    alert(err);
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    #face {
        i {
            margin: 10px;
            font-size: 3em;
        }
    }
</style>