<template>
    <div class="bg-input" :class="{bordered: border, reversed: reverse}">
        <input :type="type" v-model="input" :maxlength="maxlength" :min="min" :max="max" :placeholder="placeholder" :readonly="readOnly"
               @change="onChange" @focus="onFocus">
    </div>
</template>

<script>
    export default {
        name: "BgInput",
        props: {
            type: {
                default: 'text'
            },
            maxlength: {},
            min: {},
            max: {},
            placeholder: {},
            val: {},
            border: {
                default: false
            },
            reverse: {
                default: false
            },
            readOnly: {
                default: false
            }
        },
        model: {
            prop: 'val',
            event: 'val-change'
        },
        data(){
            return {
                input: ''
            };
        },
        methods: {
            onChange(e){
                this.$emit('val-change', this.input);
            },
            onFocus(e){
                if(this.readOnly) {
                    e.preventDefault();
                    e.target.blur();
                }
            }
        },
        watch: {
            val(val){
                if(val !== this.input) {
                    this.input = val;
                }
            }
        },
        mounted(){
            this.input = this.val;
        }
    }
</script>

<style lang="less" scoped>
    .bg-input {
        width: 100%;
        text-align: left;
        &.bordered {
            input {
                border: 1px solid #dedede;
                border-radius: 5/37.5rem;
            }
        }
        &.reversed {
            text-align: right;
            input {
                text-align: right;
            }
        }
        input {
            width: 100%;
            height: 40/37.5rem;
            text-indent: 0.2rem;
            border: none;
            outline: none;
            font-size: 0.45rem;
        }
    }
</style>
