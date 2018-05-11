<template>
    <div class="bg-radio-group" :class="{inline: inline, reversed: reverse}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BgRadioGroup",
        componentName: 'BgRadioGroup',
        props: {
            value: {},
            inline: {
                default: true
            },
            // 使radio子项目靠右对齐
            reverse: {
                default: false
            }
        },
        model: {
            prop: 'value',
            event: 'value-change'
        },
        mounted(){
            this.$on('check-change', (value) => {
                this.$emit('change', value);
                this.$emit('value-change', value);
            });
        }
    }
</script>

<style lang="less" scoped>
    .bg-radio-group {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: flex-start;
        &.inline {
            flex-direction: row;
            align-items: center;
        }
        &.reversed {
            justify-content: flex-end;
        }
    }
</style>
