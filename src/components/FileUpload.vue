<template>
    <div id="fileupload">
        <input type="file" v-on:change="onUploadFile">
    </div>
</template>

<script>
    import {loadFile} from '../FileLoader';

    export default {
        name: "FileUpload",
        methods: {
            onUploadFile: function (event) {
                const files = event.target.files;

                if (files.length !== 1) {
                    throw "Wrong number of files";
                }

                loadFile(files[0]).then(function (data) {
                    // todo: assign data to Player
                    console.log(data);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }
    };
</script>

<style scoped>

</style>