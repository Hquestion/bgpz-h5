import vodal from 'vodal';
import Vue from 'vue/dist/vue';
import api from '../api';
import filter from '../mixins/filter';
import {Toast as t} from 'mint-ui';

let isHandled = false;
let dialog;

export default function(router) {
    router.beforeEach((to, from, next) => {
        //获取即将开始的未满员聚会，提醒用户是否继续处理
        if(isHandled) {
            next();
        }else {
            api.getMyPassedParty().then(res => {
                api.getPartyLackMoney(res.data.id).then(money => {
                    if(!dialog) {
                        dialog = new Vue({
                            data(){
                                return {
                                    visible: false,
                                    data: res.data,
                                    lackMoney: money.data.lackMoney
                                };
                            },
                            mixins: [filter],
                            components: {
                                vodal: vodal
                            },
                            computed: {
                                costByTable(){
                                    return `${+this.data.cost / this.data.tableNumber}元/桌&nbsp;&nbsp;共${this.data.tableNumber}桌`;
                                }
                            },
                            template: `<vodal class-name="party-uptodate-dialog" :custom-styles="{width:'90vw', height: '7.8rem'}" :show="visible" animation="zoom" @hide="visible = false">
                            <div class='title'>聚会提示</div>
                            <div class="content">
                                <div class="theme">您发起的聚会截止报名结束仍未凑齐足够人数，您是否需要取消聚会？</div>
                                <div class="party-info-container">
                                    <div class="flex-block">
                                        <div class="label">聚会名称:</div>
                                        <div class="label-content">{{data.theme}}</div>
                                    </div>
                                    <div class="flex-block">
                                        <div class="label">聚会时间:</div>
                                        <div class="label-content">{{data.partyTime | dateFormat('sec')}}</div>
                                    </div>
                                    <div class="flex-block">
                                        <div class="flex-block">
                                            <div class="label">聚会人数:</div>
                                            <div class="label-content"><span class="red">{{data.hasNumber}}</span>/{{data.partyNumber}}</div>
                                        </div>
                                        <div class="flex-block">
                                            <div class="label">人均消费:</div>
                                            <div class="label-content">{{data.costPer}}元/人</div>
                                        </div>
                                    </div>
                                    <div class="flex-block">
                                        <div class="label">餐费标准:</div>
                                        <div class="label-content" v-html="costByTable"></div>
                                    </div>
                                    <div class="flex-block">
                                        <div class="label">费用差额:</div>
                                        <div class="label-content"><span class="red">{{lackMoney}}元</span><span>（最低开团费用{{data.cost}}）</span></div>
                                    </div>
                                </div>
                                <div class="buttons">
                                    <div class="btn btn-default" @click="cancel">取消</div>
                                    <div class="btn btn-success" v-if="lackMoney > 0" @click="goPay">不取消，我补差价</div>
                                    <div class="btn btn-success" v-else="lackMoney <= 0" @click="startParty">不取消</div>
                                </div>
                            </div>
                        </vodal>`,
                            methods: {
                                cancel(){
                                    dialog.$el.remove();
                                    dialog.$destroy();
                                    const OperationSuccess = require('../components/BgOperationSuccessModal').default;
                                    this.visible = false;
                                    const successTip = new Vue({
                                        data(){
                                            return {
                                                visible: true
                                            };
                                        },
                                        template: `<operation-success :visible="visible" @hide="onHide"></operation-success>`,
                                        components: {OperationSuccess},
                                        methods: {
                                            onHide(){
                                                this.visible = false;
                                                setTimeout(()=>{
                                                    this.$el.remove();
                                                }, 500);
                                            }
                                        }
                                    });
                                    successTip.$mount();
                                    document.body.appendChild(successTip.$el);
                                },
                                goPay(){
                                    api.joinParty({
                                        anonymous: 1,
                                        cost: this.lackMoney,
                                        number: +this.data.partyNumber - +this.data.hasNumber,
                                        partyId: this.data.id,
                                        remark: ''
                                    }).then(res => {
                                        location.hash = `#/pay/party@${this.data.id}/${res.data.applyId}/${res.data.money}?isNiming=1`;
                                        dialog.$el.remove();
                                        dialog.$destroy();
                                    }, () => {
                                        t({
                                            message: '补差额失败，请重试',
                                            position: 'bottom'
                                        });
                                    });
                                },
                                startParty(){
                                    api.joinParty({
                                        anonymous: 1,
                                        cost: this.lackMoney,
                                        number: +this.data.partyNumber - +this.data.hasNumber,
                                        partyId: this.data.id,
                                        remark: ''
                                    }).then(res => {
                                        api.pay({
                                            orderId: res.data.applyId,
                                            payType: 3,
                                            paySence: 6,
                                            payPwd: '111111'
                                        }).then(() => {
                                            location.hash = `#/party-detail/${this.data.id}`;
                                            dialog.$el.remove();
                                            dialog.$destroy();
                                        }, ()=>{
                                            t({
                                                message: '补差额失败，请重试',
                                                position: 'bottom'
                                            });
                                        });
                                    }, ()=>{
                                        t({
                                            message: '补差额失败，请重试',
                                            position: 'bottom'
                                        });
                                    });
                                }
                            }
                        });
                    }
                    dialog.$mount();
                    document.body.appendChild(dialog.$el);
                    dialog.visible = true;
                    isHandled = true;
                });
            }, ()=>{
                isHandled = true;
            });
            next();
        }
    });

    router.afterEach(() => {
    });
}
