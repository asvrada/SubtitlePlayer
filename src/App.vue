<template>
    <div id="app">
        <FileUpload></FileUpload>
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue';
    import FileUpload from "./components/FileUpload";

    export default {
        name: 'app',
        components: {
            FileUpload,
            HelloWorld
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
