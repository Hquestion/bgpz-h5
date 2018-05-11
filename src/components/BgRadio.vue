<template>
    <v-touch class="bg-radio" :class="{checked: ischecked}" @tap="onCheck">
        <div class="radio"></div>
        <div class="label">{{label}}</div>
    </v-touch>
</template>

<script>
    import event from '../mixins/event';
    export default {
        name: "BgRadio",
        mixins: [event],
        props: {
            label: {},
            value: {}
        },
        computed: {
            ischecked(){
                return this.$parent.value === this.value;
            }
        },
        methods: {
            onCheck(){
                if(!this.ischecked) {
                    this.emit('BgRadioGroup', 'check-change', this.value);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .bg-radio {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 0.2rem;
        font-size: 0.4rem;
        .radio {
            width: 26/37.5rem;
            height: 26/37.5rem;
            background-image: ~"url(../assets/image/unchose.png)";
            background-size: 100% 100%;
        }
        .label {
            margin-left: 0.1rem;
            flex: 1;
        }
        &.checked {
            .radio {
                background-image: ~"url(../assets/image/chose.png)";
            }
        }
    }
</style>
