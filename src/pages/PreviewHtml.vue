<template>
    <div class="preview-html">
        <bg-header :title="title"></bg-header>
        <iframe :src="href"></iframe>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    export default {
        name: "PreviewHtml",
        components: {BgHeader},
        data(){
            return {

            };
        },
        computed: {
            title(){
                return this.$route.query.title;
            },
            href(){
                return decodeURIComponent(this.$route.query.href);
            }
        }
    }
</script>

<style scoped>
    .preview-html {
        padding-top: 50px;
    }
    iframe {
        width: 100vw;
        min-height: calc(100vh - 50px);
        border: none;
        background: #fff;
    }
</style>
