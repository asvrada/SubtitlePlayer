<template>
    <div id="app" class="nightmode">
        <h1>Player</h1>
        <FileUpload v-on:scriptLoaded="scriptLoaded"></FileUpload>
        <Player :scripts="scripts"></Player>
        <div id="padding"></div>
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
            scriptLoaded(data) {
                this.scripts = data;
            }
        }
    };
</script>

<style lang="scss">
    @import "./sass/color-pattern-night";

    body {
        padding: 0;
        margin: 0;
    }

    .nightmode {
        background-color: $night-color-background;

        color: $night-color-text;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;

        padding: 20px;
        box-sizing: border-box;
    }

    #padding {
        height: 200px;
    }
</style>
