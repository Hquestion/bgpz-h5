<template>
    <mt-header fixed :title="title" class="bgpz-header">
        <div slot="left" @click="back()" v-if="type === 'back'">
            <img src="../assets/image/back.png">
        </div>
        <div class="default" v-else slot="left">
            <slot name="left"></slot>
        </div>
        <div slot="right">
            <slot name="action"></slot>
        </div>
    </mt-header>
</template>

<script>
    import { Header, Button } from 'mint-ui';
    export default {
        name: "bg-header",
        components: {
            MtHeader: Header,
            MtButton: Button
        },
        props: {
            title: {},
            type: {
                type: String,
                default: 'back'
            },
            to: {}
        },
        methods: {
            back(){
                if(this.to) {
                    this.$router.push({
                        path: this.to
                    });
                }else {
                    this.$router.go(-1);
                }
            },
            hideShareTip(){
                window.EventBus.$emit('share-visible', false);
            }
        }
    }
</script>

<style lang="less">
    .main.share-visible .bgpz-header {
        top: 80/37.5rem;
    }
    .bgpz-header {
        background: #fff;
        border-bottom: 1px solid #dedede;
        color: #1b1b1b;
        height: 50px;
        font-size: 0.5rem;
        top: 0;
        transition: top ease-in .5s;
        z-index: 10 !important;
        .default {
            font-size: 0.48rem;
        }
    }
    .bgpz-header .mint-header-title {
        height: 100%;
        line-height: 50px;
        font-size: 0.6rem;
    }
</style>
