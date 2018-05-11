<template>
    <div class="address-card">
        <div class="name-phone">
            <div class="name">{{data.name}}</div>
            <div class="phone">{{data.phone}}</div>
        </div>
        <div class="address-detail">{{fullAddress}}</div>
        <div class="actions">
            <div class="edit-actions" v-show="type === 'user'">
                <bg-radio-group v-model="defaultId" @change="onChangeDefaultAddr">
                    <bg-radio label="设为默认" :value="data.id"></bg-radio>
                </bg-radio-group>
                <div class="btns-box">
                    <bg-text-button @tap="onEdit">
                        <img slot="icon" src="../assets/image/edit.png">编辑
                    </bg-text-button>
                    <bg-text-button @click.native="onDel">
                        <img slot="icon" src="../assets/image/delete.png">删除
                    </bg-text-button>
                </div>
            </div>
            <div class="use-button" v-show="showUse">
                <bg-button @tap="useAddress">使用此地址</bg-button>
            </div>
        </div>
    </div>
</template>

<script>
    import BgRadioGroup from "./BgRadioGroup";
    import BgRadio from "./BgRadio";
    import BgTextButton from "./BgTextButton";
    import BgButton from "./BgButton";
    export default {
        name: "AddressCard",
        components: {BgButton, BgTextButton, BgRadio, BgRadioGroup},
        props: {
            data: {
                twoWay: true
            },
            showUse: {
                default: false
            },
            type: {
                default: 'user'    //  'user'   'platform'
            }
        },
        data(){
            return {
                defaultId: ''
            };
        },
        computed: {
            fullAddress(){
                if(this.type === 'user') {
                    return `${this.data.stateInfo.name}${this.data.cityInfo.name}${this.data.regionInfo.name}${this.data.addr}`;
                }else {
                    return this.data.addr;
                }
            }
        },
        methods: {
            onEdit(){
                this.$emit('edit', this.data);
            },
            onDel(){
                this.$emit('delete', this.data);
            },
            useAddress(){
                this.$emit('use', this.data);
            },
            onChangeDefaultAddr(){
                this.$emit('change-default-address', this.data);
            }
        },
        mounted(){
            if(this.data['default'] === 1) {
                this.defaultId = this.data.id;
            }else {
                this.defaultId = '';
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .address-card {
        padding: 8/37.5rem 20/37.5rem;
        background: @white;
        font-size: 16/37.5rem;
        border-top: 1px solid #dedede;
        border-bottom: 1px solid #dedede;
        .name-phone {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5/37.5rem 0;
        }
        .address-detail {
            padding: 10/37.5rem 0;
        }
        .actions {
            border-top: 1px solid #f2f2f2;
            .edit-actions {
                padding: 10/37.5rem 0;
                display: flex;
                justify-content: space-between;
            }
            .use-button {
                padding: 10/37.5rem 0;
            }
        }
    }
</style>
