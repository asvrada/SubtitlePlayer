<template>
    <div id="fileUploader">
        <div id="face">
            <i class="fas fa-upload"></i>
            <div>Support format: .srt</div>
        </div>
        <input type="file" v-on:change="onUploadFile">
    </div>
</template>

<script>
    import {loadFile} from '../classes/FileLoader';

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