<template>
    <mt-header fixed :title="title" class="bgpz-header">
        <v-touch slot="left" @tap="back()" v-if="type === 'back'">
            <mt-button icon="back"/>
        </v-touch>
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
            }
        }
    }
</script>

<style lang="less">
    .bgpz-header {
        background: #fff;
        border-bottom: 1px solid #dedede;
        color: #1b1b1b;
        height: 50px;
        font-size: 0.5rem;
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
