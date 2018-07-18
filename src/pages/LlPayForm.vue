<template>
    <div class="ll-pay-form">
        <bg-header title="支付"></bg-header>
        <form action="http://api.bagepanzi.com/llpay/llpayapi.php" method="post">
            <bg-cell>
                <div slot="left">银行卡号</div>
                <div class="input-box"  slot="middle">
                    <input name="card_no" v-model="cardNo" placeholder="请输入银行卡号" required>
                </div>
            </bg-cell>
            <bg-cell>
                <div slot="left">姓名</div>
                <div class="input-box" slot="middle">
                    <input name="acct_name" v-model="name" placeholder="请输入您的姓名" required>
                </div>
            </bg-cell>

            <bg-cell>
                <div slot="left">身份证号</div>
                <div class="input-box"  slot="middle">
                    <input name="id_no" v-model="sfzh" placeholder="请输入身份证号" required>
                </div>
            </bg-cell>
            <input type="hidden" name="user_id" v-model="userId"/>
            <input type="hidden" name="busi_partner" value="101001"/>
            <input type="hidden" name="no_order" v-model="orderNo"/>
            <input type="hidden" name="money_order" v-model="orderMoney"/>
            <input type="hidden" name="name_goods" v-model="goodsName"/>
            <input type="hidden" name="info_order" v-model="orderInfo"/>
            <input type="hidden" name="no_agree" value=""/>
            <input type="hidden" name="risk_item" v-model="riskItem"/>
            <input type="hidden" name="valid_order" value="10080"/>
            <button class="new-btn-confirm" type="submit" style="text-align:center;">确 认</button>
        </form>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import BgCell from "../components/BgCell";
    import BgInput from "../components/BgInput";
    export default {
        name: "LlPayForm",
        components: {BgInput, BgCell, BgHeader},
        data(){
            return {
                sfzh: '',
                cardNo: '',
                name: '',
                userId: this.$route.query.userId,
                orderNo: this.$route.query.orderNo,
                orderMoney: 0.01 || this.$route.query.orderMoney,
                goodsName: '八个盘子会员充值',
                orderInfo: this.$route.query.comevip === '1' ? '充值年费会员服务' : '充值账户余额',
                riskItem: JSON.stringify({
                    frms_ware_category: '1009',
                    user_info_mercht_userno: this.$route.query.userId,
                    user_info_dt_register: this.$route.query.createtime,
                    user_info_bind_phone: this.$route.query.phone,
                    user_info_identify_state: '1',
                    user_info_identify_type: '1',
                    user_info_full_name: this.name,
                    user_info_id_no:this.cardNo
                }).replace(/"/g, '\\"').replace(/'/g, '\\"')
            }
        },
        methods: {
            init(){

            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .ll-pay-form {
        padding-top: 50px;
        .input-box {
            width: 100%;
            input {
                width: 100%;
                height: 40/37.5rem;
                border: none;
                outline: none;
                text-align: right;
                font-size: 16/37.5rem;
            }
        }
        .new-btn-confirm {
            width: 90vw;
            height: 50/37.5rem;
            line-height: 50/37.5rem;
            text-align: center;
            background: @red;
            color: #fff;
            border: none;
            outline: none;
            border-radius: 5/37.5rem;
            font-size: 18/37.5rem;
            margin: 30/37.5rem auto;
            display: block;
        }
    }
</style>
