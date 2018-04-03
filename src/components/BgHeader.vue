<template>
    <mt-header fixed :title="title" class="bgpz-header">
        <v-touch slot="left" @tap="back()">
            <mt-button icon="back"/>
        </v-touch>
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
            title: {}
        },
        methods: {
            back(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style>
    .bgpz-header {
        background: #fff;
        border-bottom: 1px solid #dedede;
        color: #666;
        height: 50px;
        font-size: 1.1rem;
    }
    .bgpz-header .mint-header-title {
        height: 100%;
        line-height: 50px;
    }
</style>
