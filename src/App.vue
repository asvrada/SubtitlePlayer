<template>
    <div id="app">
        <h1>Subtitle Player</h1>

        <FileUpload v-on:scriptLoaded="scriptLoaded"></FileUpload>

        <Player id="player" :scripts="scripts"></Player>

        <a href="https://github.com/asvrada/vue-subtitle-player"><img
                style="position: absolute; top: 0; right: 0; border: 0;"
                src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png"
                alt="Fork me on GitHub"></a>

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
        background-color: $night-color-background;
        color: $night-color-text;

        text-align: center;

        font-family: unquote("Arial, Helvetica, sans-serif");
    }

    #app {
        width: 100%;

        h1 {
            font-size: 3em;
        }

        #player {
            margin: 0 auto;
            width: 80%;
        }

        #padding {
            height: 300px;
        }
    }

</style>
