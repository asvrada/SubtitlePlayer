<template>
    <!--emit fileUploaded event open file received-->
    <div id="app">
        <div id="cover-fullscreen"
             v-on:drop.stop.prevent="handleDrop"
             v-on:dragover.stop.prevent
             v-show="promptDrop">
            release to drop your file
        </div>

        <div id="drop-zone" class="full-size"
             v-on:click="promptSelectFile"
             v-bind:style="styleObjectApp"
        >
            <!--icon-->
            <div id="div-prompt" class="full-size">
                <component id="area-icon" v-bind:is="currentComponent"></component>
            </div>

            <!--fallback file uploader-->
            <form v-show="false" class="form-file-upload">
                <input type="file" id="elem-file" v-on:change="handleForm">
                <label ref="btn_form" class="button" for="elem-file">Select subtitle file</label>
            </form>
        </div>
    </div>
</template>

<script>
    import IconInit from "./icon/IconInit";
    import IconSelected from "./icon/IconSelect";

    export default {
        name: "drop-zone",
        components: {
            IconInit,
            IconSelected
        },
        mounted() {
            const self = this;
            let lastTarget = null;
            window.addEventListener("dragenter", function (e) {
                e.preventDefault();
                e.stopPropagation();

                lastTarget = e.target; // cache the last target here

                self.handleDragEnter();
            });

            window.addEventListener("dragleave", function (e) {
                e.stopPropagation();
                e.preventDefault();

                // this is the magic part. when leaving the window,
                // e.target happens to be exactly what we want: what we cached
                // at the start, the dropzone we dragged into.
                // so..if dragleave target matches our cache, we hide the dropzone.
                if (e.target === lastTarget || e.target === document) {
                    self.handleDragLeave();
                }
            });
        },
        data: function () {
            return {
                fileLoaded: null,
                promptDrop: false,
                color: {
                    "init": "#303F9F",
                    "drop": "#FFA000",
                    "loaded": "#689F38"
                }
            }
        },
        computed: {
            currentState: function () {
                if (this.fileLoaded !== null) {
                    return "loaded";
                }

                return "init";
            },
            styleObjectApp: function () {
                let state = this.currentState;

                return {
                    "background-color": `${this.color[state]}`
                }
            },
            currentComponent: function () {
                return {
                    "init": "IconInit",
                    "loaded": "IconSelected",
                    "drop": "IconSelected"
                }[this.currentState];
            }
        },
        methods: {
            handleDragEnter() {
                this.promptDrop = true;
            },
            handleDragLeave() {
                this.promptDrop = false;
            },
            handleDrop(e) {
                let files = null;

                try {
                    let dt = e.dataTransfer;
                    files = dt.files;
                } catch (e) {
                    alert("There was a problem processing your file, please try again");
                    // console.log("Error drag & drop file", e)
                }

                this.handleFiles(files);
            },
            handleForm(e) {
                let files = null;

                try {
                    let dt = e.target;
                    files = dt.files;
                } catch (e) {
                    alert("There was a problem processing your file, please try again");
                    // console.log("Error input file", e)
                }

                this.handleFiles(files);
            },
            /**
             * Calls the file handler passed in from outside
             * @param files
             */
            handleFiles(files) {
                this.fileLoaded = files;
                this.promptDrop = false;

                this.$emit('fileUploaded', files);
            },
            /**
             * User clicks the upload area, prompt user to select files from system
             */
            promptSelectFile() {
                this.$refs.btn_form.click();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .full-size {
        width: 100%;
        height: 100%;
    }

    #cover-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        line-height: 100vh;
        font-size: 3.5em;

        background-color: rgba(78, 78, 78, 0.9);
        border: 15px dashed #707070;
    }

    #app {
        position: relative;

        /*the actual div that displays all the stuff*/
        #drop-zone {
            #div-prompt {

                #border {
                    box-sizing: border-box;
                    border-radius: 20px;
                }

                #area-icon {
                    position: absolute;
                    margin: 0 auto;
                    top: 50%;
                    left: 50%;
                    width: 35%;
                    transform: translate(-50%, -50%);
                }
            }

            transition: background-color 400ms linear;

            cursor: pointer;

            position: absolute;
            top: 0;
            left: 0;

            box-sizing: border-box;
            border-radius: 20px;
        }
    }
</style>