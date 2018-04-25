<template>
    <popup position="bottom" v-model="popupVisible" style="width: 100%;">
        <div class="picker-box">
            <div class="ok-btn" @click="onSelectCount">确定</div>
            <picker :slots="pickerSlots" @change="onNumberChange" value-key="label"></picker>
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
            pickerSlots: {}
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
            },
            onSelectCount(){
                this.$emit('data-change', this.tempValue);
                this.$emit('visible-change', false);
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

<style scoped>
    .picker-box .ok-btn{
        text-align: right;
        color: #007aff;
        background: #f4f4f4;
        padding: 0.4rem 0.5rem;
    }
</style>
