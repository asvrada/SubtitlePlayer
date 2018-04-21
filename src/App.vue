<template>
    <div id="app">
        <FileUpload v-on:scriptLoaded="scriptLoaded"></FileUpload>
        <Player :scripts="scripts"></Player>
    </div>
</template>

<script>
    import FileUpload from "./components/FileUpload";
    import Player from "./components/Player";

    export default {
        name: 'app',
        components: {
            Player,
            FileUpload,
        },
        data: function () {
            return {
                scripts: null
            };
        },
        methods: {
            scriptLoaded({data}) {
                this.scripts = data;
            }
        }
    };
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
