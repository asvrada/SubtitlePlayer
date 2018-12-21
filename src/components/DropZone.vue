<template>
    <!--emit fileUploaded event open file received-->
    <div id="app">
        <div id="cover" class="full-size"
             v-on:dragenter.prevent.stop="handleDragEnter"
             v-on:dragleave.prevent.stop="handleDragLeave"
             v-on:dragover.prevent.stop="handleDragOver"
             v-on:drop.prevent.stop="handleDrop"
             v-on:click="promptSelectFile"
        ></div>

        <div id="drop-zone" class="full-size"
             v-bind:style="styleObjectApp"
        >
            <!--icon-->
            <div id="div-prompt" class="full-size">
                <div id="border" class="full-size"
                     v-bind:class="{promptDropClass:promptDrop}"
                ></div>
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
        data: function () {
            return {
                fileLoaded: null,
                promptDrop: false,
                style: {
                    color: {
                        "init": "#303F9F",
                        "drop": "#FFA000",
                        "loaded": "#689F38"
                    },
                    borderThickness: 10
                }
            }
        },
        computed: {
            currentState: function () {
                if (this.promptDrop) {
                    return "drop";
                }

                if (this.fileLoaded !== null) {
                    return "loaded";
                }

                return "init";
            },
            styleObjectApp: function () {
                const style = this.style;

                let state = this.currentState;

                return {
                    "background-color": `${style.color[state]}`
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
            handleDragOver(e) {
                // we don't need this ...
            },
            handleDrop(e) {
                let files = null;

                try {
                    let dt = e.dataTransfer;
                    files = dt.files;
                } catch (e) {
                    alert("There was a problem processing your file, please try again");
                    console.log("Error drag & drop file", e)
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
                    console.log("Error input file", e)
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

    #app {
        position: relative;

        /*the coverup div*/
        #cover {
            position: absolute;
            top: 0;
            left: 0;

            z-index: 2;
            cursor: pointer;
        }


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

            position: absolute;
            top: 0;
            left: 0;

            z-index: 1;

            box-sizing: border-box;
            border-radius: 20px;
        }

        /* style after dragEnter */
        .promptDropClass {
            border: 5px dashed #707070;
        }
    }
</style>