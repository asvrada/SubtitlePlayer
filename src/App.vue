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

        <div class="row">
            <div id="padding"></div>
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

<style lang="scss" scoped="true">
    @import "./sass/color-pattern-night";

    #app {
        margin: 0;
        padding: 2em;
        width: 100%;

        background-color: $night-color-background;
        color: $night-color-text;

        h1 {
            margin: 0;
            user-select: none;
        }
    }

    #padding {
        height: 200px;
    }
</style>
