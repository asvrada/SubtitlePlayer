<template>
    <div id="app" class="nightmode container center">
        <div class="row">
            <h1>Subtitle Player</h1>
        </div>

        <div class="row">
            <FileUpload v-on:scriptLoaded="scriptLoaded"></FileUpload>
        </div>

        <div class="row">
            <Player :scripts="scripts"></Player>
        </div>
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
    }

    #app {
        margin: 0;
        padding: 2em;
        max-width: 100%;
        width: 100%;

        h1 {
            margin: 0;
            user-select: none;
        }
    }
</style>
