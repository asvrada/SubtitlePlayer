<template>
    <div id="fileupload">
        <input type="file" v-on:change="onUploadFile">
    </div>
</template>

<script>
    import {FileLoader} from '../FileLoader';

    export default {
        name: "FileUpload",
        methods: {
            onUploadFile: function (event) {
                const files = event.target.files;

                if (files.length !== 1) {
                    throw "Wrong number of files";
                }

                const fileLoader = new FileLoader(files[0]);
                console.log("End");
            }
        }
    };
</script>

<style scoped>

</style>