<template>
    <popup position="bottom" v-model="popupVisible" style="width: 100%;">
        <div class="picker-box">
            <div class="btn-group">
                <div class="cancel-btn" @click="cancel">取消</div>
                <div class="title">{{title}}</div>
                <div class="ok-btn" @click="onSelectCount">确定</div>
            </div>
            <picker :slots="pickerSlots" @change="onNumberChange" :value-key="valueKey" ref="picker"></picker>
        </div>
    </popup>
</template>

<script>
    import {Popup, Picker} from 'mint-ui';
    export default {
        name: "PopupPicker",
        data(){
            return {
                popupVisible: false,
                tempValue: null
            };
        },
        props: {
            visible: {
                default: false,
                type: Boolean
            },
            pickerSlots: {},
            title: {
                default: ''
            },
            valueKey: {
                default: 'label'
            }
        },
        model: {
            prop: 'visible',
            event: 'visible-change'
        },
        components: {
            Picker,
            Popup
        },
        methods: {
            onNumberChange(picker, value){
                this.tempValue = value;
                this.$emit('change', picker, value);
            },
            onSelectCount(){
                this.$emit('data-change', this.$refs.picker.getValues());
                this.$emit('visible-change', false);
            },
            cancel(){
                this.popupVisible = false;
            }
        },
        watch:{
            visible(val, oldval){
                if(val !== oldval) {
                    this.popupVisible = val;
                }
            },
            popupVisible(val, oldval){
                if(val !== oldval) {
                    this.$emit('visible-change', val);
                }
            }
        }
    }
</script>

<style lang="less">
    .picker-box{
        .btn-group {
            padding: 0.4rem 0.5rem;
            color: #007aff;
            background: #f4f4f4;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .cancel-btn {
                text-align: left;
                width: auto;
                padding: 0 0.4rem;
            }
            .title {
                flex: 1;
                text-align: center;
                color: #1b1b1b;
            }
            .ok-btn{
                text-align: right;
                width: auto;
                padding: 0 0.4rem;
            }
        }
        .picker-slot {
            flex: 1;
        }
    }
</style>
