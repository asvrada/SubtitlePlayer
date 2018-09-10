<template>
    <div id="fileupload">
        <div id="face">
            <i class="fas fa-upload"></i>
            <div>支持的格式：.srt</div>
        </div>
        <input type="file" v-on:change="onUploadFile">
    </div>
</template>

<script>
    import {loadFile} from '../FileLoader';

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
                    console.log(err);
                });
            },
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