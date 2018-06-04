<template>
    <vodal class-name="bg-op-success-modal" :custom-styles="{width:'90vw', height: '7.4rem'}" :show="visible" animation="zoom" @hide="onHide">
        <div class='title'>聚会提示</div>
        <div class="content">
            <img src="../assets/image/success-icon.png">
            <div class="tip-title">您已成功取消聚会！</div>
            <div class="tip-sub-title">已报名费用将在一个工作日内退还到相应会员账户！</div>
            <bg-button class="button" @click.native="onHide">确定</bg-button>
        </div>
    </vodal>
</template>

<script>
    import vodal from 'vodal';
    import BgButton from "./BgButton";
    export default {
        name: "BgOperationSuccessModal",
        components: {BgButton, vodal},
        props: {
            visible: {
                default: false
            }
        },
        methods: {
            onHide(){
                this.$emit('hide');
            }
        }
    }
</script>

<style lang="less">
    .bg-op-success-modal {
        font-size: 0.4rem;
        .vodal-dialog {
            padding: 0.133rem 0.4rem;
            border-radius: 10px;
            .title {
                font-size: 0.44rem;
                text-align: center;
                color: #aaa;
            }
            .content {
                margin-top: 0.267rem;
                text-align: center;
                img {
                    width: 100/37.5rem;
                }
                .tip-title {
                    font-size: 0.44rem;
                }
                .tip-sub-title {
                    font-size: 0.32rem;
                    color: #333;
                }
                .button {
                    margin-top: 20/37.5rem;
                }
            }
        }
    }
</style>
