<template>
    <div class="bg-checkbox-item" @click="toggle" :class="{checked: checked}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BgCheckboxItem",
        props: {
            checked:{
                default: false
            }
        },
        model: {
            prop: 'checked',
            event: 'change'
        },
        methods: {
            toggle(){
                if(this.$parent.single) {
                    // 如果是单选，必有一个要被选中
                    if(!this.checked) {
                        this.$parent.$children.forEach(child => {
                            child.$emit('change', false);
                        });
                        this.$emit('change', true);
                        this.$emit('toggle-change', true);
                    }
                }else {
                    this.$emit('toggle-change', !this.checked);
                    this.$emit('change', !this.checked);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .bg-checkbox-item {
        display: block;
        border: 1px solid #dedede;
        padding: 8/37.5rem;
        background: #fff;
        color: #1b1b1b;
        border-radius: 5/37.5rem;
        &.checked {
            background: #fc9;
            border: 1px solid #fb8;
            color: #f40;
        }
    }
</style>
