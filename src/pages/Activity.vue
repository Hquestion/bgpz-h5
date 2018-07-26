<template>
    <div class="activity">
        <div class="header-img">
            <img src="../../static/img/header-bg.jpg">
        </div>
        <div class="main">
            <div class="activity-main block">
                <div class="activity-desc">
                    <div class="activity-header">
                        <img src="../../static/img/title-bg-1.jpg">
                    </div>
                    <div class="text-desc">
                        <p>
                            到家的美食节是现代快报旗下酒店与美食行业融媒体平台“酒食客”联合南京互联网私宴定制平台“八个盘子”共同推出的酒食客上线一周年美食活动。邀请120位尊贵客户体验私宴上门定制服务。
                        </p>
                        <p>
                            八个盘子，高端私宴，上门定制，适合生日宴会、商务宴请、朋友聚餐、年夜饭等不同场景需求。明星酒店提供新鲜食材，星级大厨上门烹饪定制，餐后清洁我们全包，让用户在家也能享受到高品质的菜肴和星级服务。
                        </p>
                    </div>
                </div>
                <img src="../assets/image/pic.jpg" style="width: 100%;margin-top: 0.8rem;">
                <div class="sub-header" style="margin-top: 0.5rem;">
                    <bg-title>活动套餐</bg-title>
                </div>
                <div class="package-content">
                    <div class="packageBox" v-for="(foodPackage, index) in packages" :key="index">
                        <div class="package-name" v-text="foodPackage.packageName"></div>
                        <div class="scence">适合（{{foodPackage.scence}}）</div>
                        <div class="food-container">
                            <div class="food-cate" v-for="(cate, j) in foodPackage.foodList" :key="j">
                                <div class="cate-name" v-text="cate.categoryName"></div>
                                <ul>
                                    <li v-for="(food, k) in cate.foods" :key="k">
                                        {{food.foodName}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="remark">
                    注：家乡老鹅是六合竹镇名菜：老董烧老鹅
                </div>
            </div>
            <div class="block">
                <bg-title>预定须知</bg-title>
                <div class="activity-pre-know">
                    <p>
                        1、本页面仅限获得指定优惠券用户在线预约使用；
                    </p>
                    <p>
                        2、中央厨房需要提前准备食材，至少需要提前一天预约；
                    </p>
                    <p>
                        3、提交预约后，客服会通过400电话和您确认就餐信息；
                    </p>
                    <p>
                        4、本代金券面值1000元，也可预约八个盘子平台其余套餐服务（需补足差价）；
                    </p>
                    <p>
                        5、优惠券有效期：2018年4月26日至2018年7月27日，请在有效期内使用；
                    </p>
                    <p>
                        6、就餐时请出示此代金券（电子券除外）；
                    </p>
                    <p>
                        7、八个盘子客服热线：<a href="tel:4008-718-181">4008-718-181</a><i>（周一到周日9：00-18：00）</i>
                    </p>
                </div>
            </div>
            <div class="block order-block">
                <bg-title>在线预约</bg-title>
                <div class="tip"><span>小提示：</span><span>因为活动参与人数较多，建议您时间尽量往后预约！如出现无法排班情况，客服会联系您协调。</span></div>
                <div class="form-container">
                    <field label="兑换码：" placeholder="请输入兑换码(代金券右下角)" type="number" v-model="coupon"></field>
                    <field class="select" label="就餐时间：" placeholder="请选择用餐时间" readonly type="text" v-model="time" @click.native.stop.prevent="onShowPicker"></field>
                    <field label="联系人：" type="text" v-model="username"></field>
                    <field label="联系电话：" type="tel" v-model="phone"></field>
                    <field label="地址：" type="textarea" rows="2" v-model="address"></field>
                    <field class="select" label="套餐选择：" placeholder="请选择套餐" readonly type="text" v-model="selectPackage.label" @click.native.stop.prevent="choosePackage"></field>
                    <field class="select" label="就餐人数：" placeholder="请选择就餐人数" readonly type="text" v-model="number.label" @click.native.stop.prevent="choosePersonNumber"></field>
                    <field class="select" label="来源渠道：" placeholder="请选择来源渠道" readonly type="text" v-model="origin.label" @click.native.stop.prevent="chooseOrigin"></field>
                    <div class="remark-container">
                        <div class="remark-label">备注：</div>
                        <div class="remark-data">
                            <div class="remark-item" v-for="(remark, index) in remarkList" :key="index" :class="{active: remark.isActive}" @click.prevent.stop="toggleRemark(remark)">
                                {{remark.label}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="submit-btn" @click="onOrder">
                    提交预约
                </div>
            </div>
            <div class="rights">本活动解释权归八个盘子所有</div>
        </div>

        <datetime-picker :start-date="startDate" :end-date="endDate" :start-hour="startHour" :end-hour="endHour"
                         month-format="{value}月" date-format="{value}日" hour-format="{value}时" minute-format="{value}分"
                         type="datetime" ref="timePicker" @confirm="onSelectDate"></datetime-picker>
        <popup-picker v-model="numberPickerVisible" :picker-slots="numberSlots" @data-change="onSelectCount"></popup-picker>
        <popup-picker v-model="packagePickerVisible" :picker-slots="packageSlots" @data-change="onSelectPackage"></popup-picker>
        <popup-picker v-model="originPickerVisible" :picker-slots="originSlots" @data-change="onSelectOrigin"></popup-picker>
    </div>
</template>

<script>
    import {Field, DatetimePicker, Popup, Picker, Button, Toast, MessageBox} from 'mint-ui';
    import PopupPicker from '../components/PopupPicker';
    import getTimeList from '../mixins/getTimeList';
    import BgTitle from "../components/BgTitle";
    import foodPackages from '../../static/js/activity-package';
    import {fillZero} from "../util";
    import api from '../api';

    const myToast = Toast;
    const MsgBox = MessageBox;
    export default {
        name: "Activity",
        mixins: [getTimeList],
        data(){
            return {
                packages: foodPackages,
                endDate: new Date('2018/08/27 20:00:00'),
                startHour: 11,
                endHour: 19,
                username: '',
                time: '',
                phone: '',
                address: '',
                number: {
                    value: 5,
                    label: '5人'
                },
                numberPickerVisible: false,
                numberSlots: [{
                    flex: 1,
                    values: [{
                        value: 1,
                        label: '1人'
                    },{
                        value: 2,
                        label: '2人'
                    },{
                        value: 3,
                        label: '3人'
                    },{
                        value: 4,
                        label: '4人'
                    },{
                        value: 5,
                        label: '5人'
                    },{
                        value: 6,
                        label: '6人'
                    },{
                        value: 7,
                        label: '7人'
                    },{
                        value: 8,
                        label: '8人'
                    },{
                        value: 9,
                        label: '9人'
                    },{
                        value: 10,
                        label: '10人'
                    }],
                    className: 'slot1',
                    textAlign: 'center',
                    defaultIndex: 0
                }],
                coupon: '',
                origin: '',
                selectPackage: '',
                packagePickerVisible: false,
                packageSlots: [{
                    flex: 1,
                    values: [{
                        value: 1,
                        label: '1000元套餐一'
                    },{
                        value: 2,
                        label: '1000元套餐二'
                    }],
                    textAlign: 'center',
                    defaultIndex: 0
                }],
                originPickerVisible: false,
                originSlots: [{
                    flex: 1,
                    values: [{
                        value: '现代快报-酒食客',
                        label: '现代快报-酒食客'
                    },{
                        value: '中国银行',
                        label: '中国银行'
                    }],
                    textAlign: 'center',
                    defaultIndex: 0
                }],
                remarkList: [{
                    isActive: false,
                    label: '有小孩'
                }, {
                    isActive: false,
                    label: '不吃辣'
                }, {
                    isActive: false,
                    label: '有孕妇'
                }, {
                    isActive: false,
                    label: '有老人'
                }, {
                    isActive: false,
                    label: '不吃海鲜'
                }, {
                    isActive: false,
                    label: '穆斯林'
                }]
            };
        },
        components: {
            BgTitle,
            Field,
            DatetimePicker,
            Popup,
            Picker,
            MtButton: Button,
            PopupPicker
        },
        computed: {
            timeList(){
                return this.getTimeInfo();
            },
            timeSlots(){
                let timeData = this.getTimeInfo();
                let dateSlot = {flex:1,textAlign: 'center',defaultIndex: 0};
                let dateList = timeData.map(item => {
                    return {
                        label: item.name,
                        value: item.code
                    }
                });
            },
            monthSlots(){
                let monthSlot = {flex:1,textAlign: 'center',defaultIndex: 0};
                monthSlot.values = timeData.map(item => {
                    return {
                        label: item.name,
                        value: item.code
                    }
                });
                return monthSlot;
            },
            startDate(){
                let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
                let tomorrowZero = new Date(tomorrow.getFullYear() + '/' + (tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + ' 00:00:00');
                return tomorrowZero;
            }
        },
        methods: {
            onShowPicker(e){
                this.$refs.timePicker.open();
            },
            onSelectDate(e){
                let year = e.getFullYear(),
                    month = e.getMonth() + 1,
                    date = e.getDate(),
                    hour = fillZero(e.getHours()),
                    minute = fillZero(e.getMinutes());
                this.time = `${year}年${month}月${date}日 ${hour}:${minute}`;
            },
            choosePersonNumber(e){
                this.numberPickerVisible = true;
            },
            onSelectCount(val){
                this.number = val[0];
            },
            choosePackage(){
                this.packagePickerVisible = true;
            },
            onSelectPackage(val){
                this.selectPackage = val[0];
            },
            chooseOrigin(){
                this.originPickerVisible = true;
            },
            onSelectOrigin(val){
                this.origin = val[0];
            },
            toggleRemark(remark){
                remark.isActive = !remark.isActive;
            },
            onOrder(){
                // myToast({
                //     message: '系统维护',
                //     position: 'bottom'
                // });
                // return;
                let now = new Date();
                let orderEndDate = new Date('2018/7/28 00:00:00');
                if(now > orderEndDate) {
                    myToast({
                        message: '活动已结束，如有疑问请联系客服',
                        position: 'bottom'
                    });
                    return;
                }
                if(!this.coupon) {
                    myToast({
                        message: '请输入兑换码编号',
                        position: 'bottom'
                    });
                } else if(!this.time) {
                    myToast({
                        message: '请选择用餐时间',
                        position: 'bottom'
                    });
                } else if(!this.username) {
                    myToast({
                        message: '请输入姓名',
                        position: 'bottom'
                    });
                }else if(!this.phone) {
                    myToast({
                        message: '请输入联系电话',
                        position: 'bottom'
                    });
                } else if(!this.address) {
                    myToast({
                        message: '请输入用餐地址',
                        position: 'bottom'
                    });
                }else if(!this.selectPackage || !this.selectPackage.label) {
                    myToast({
                        message: '请选择套餐',
                        position: 'bottom'
                    });
                }else if(!this.number || !this.number.label) {
                    myToast({
                        message: '请选择用餐人数',
                        position: 'bottom'
                    });
                }else if(!this.origin || !this.origin.label) {
                    myToast({
                        message: '请选择来源渠道',
                        position: 'bottom'
                    });
                } else {
                    api.checkActivityCoupon(this.coupon).then(res => {
                        api.postOrder({
                            "user_name": this.username,
                            "user_phone": this.phone,
                            "user_address": this.address,
                            "dinner_num": this.number.value,
                            "coupon_code": this.coupon,
                            "source_channel": this.origin.label,
                            "kitchen_device": "",
                            "condiment": "",
                            "dishware": "",
                            "remarks": this.remarkList.filter(item => item.isActive).map(item => item.label).join(','),
                            "cityname": "南京",
                            "dinner_date": this.time,
                            "dinner_name": this.selectPackage.label
                        }).then(res => {
                            MsgBox.alert('我们已经收到您的预约，很快会有客服联系您！', '预定成功');
                        }, ()=> {
                            myToast({
                                message: '套餐预定失败，请重试！',
                                position: 'bottom'
                            });
                        });
                    }, (res)=>{
                        myToast({
                            message: '兑换码不存在或者已失效！',
                            position: 'bottom'
                        });
                    });
                }

            }
        },
        mounted(){
        }
    }
</script>

<style lang="less">
    .activity {
        background: #E83115;
        color: #111111;
        font-size: 0.42rem;
        min-height: 100vh;
        .header-img {
            width: 100%;
            height: 577 / 3 / 37.5 + 'rem';
            img {
                width: 100%;
                height: 100%;
            }
        }
        .main {
            width: 96%;
            margin: 0 auto;
            position: relative;
            top: -0.55rem;
            .block {
                padding: 0 0.3rem 0.5rem;
                background: #fff;
                border-radius: 0.1rem;
                margin-top: 0.6rem;
                &.order-block {
                    padding-bottom: 3.5rem;
                    background-image: ~"url(../assets/image/people.jpg)";
                    background-position: right bottom;
                    background-size: 1035/3/37.5rem 476/3/37.5rem;
                    background-repeat: no-repeat;
                }
                &:nth-child(1) {
                    margin-top: 0;
                }
            }
            .activity-desc {
                .activity-header {
                    width: 100%;
                    text-align: center;
                    padding: 0.6rem 0;
                    img {
                        width: 679/3/37.5rem;
                        height: 103/3/37.5rem;
                    }
                }
                .text-desc {
                    padding: 0;
                    line-height: 1.7;
                    p {
                        text-indent: 0.8rem;
                    }
                }
            }
            .package-content {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                margin: 0 -0.2rem;
                .packageBox {
                    width: 50%;
                    flex: 1;
                    text-align: center;
                    &:nth-child(2n + 1) {
                        border-right: 1px dashed #dedede;
                    }
                    .package-name {
                        color: #E8001F;
                        font-size: 0.4rem;
                        text-align: center;
                    }
                    .scence {
                        color: #666;
                        font-size: 0.3rem;
                    }
                    .food-container {
                        .food-cate {
                            font-size: 0.3rem;
                            text-align: center;
                            .cate-name {
                                color: #999;
                                font-size: 0.3rem;
                                padding: 0.3rem 0 0.1rem;
                            }
                            ul {
                                display: flex;
                                justify-content: flex-start;
                                align-items: flex-start;
                                flex-wrap: wrap;
                                li {
                                    width: 50%;
                                    text-align: center;
                                    padding: 0.1rem 0;
                                }
                            }
                        }

                    }
                }
            }
            .remark {
                color: #ccc;
                font-size: 0.3rem;
                text-align: center;
                padding: 0.15rem 0;
            }
            .activity-pre-know {
                font-size: 0.35rem;
                p {
                    line-height: 1.9;
                    a {
                        color: #E8001F;
                        text-decoration: underline;
                    }
                    i {
                        font-size: 0.2rem;
                        color: #999;
                        font-style: normal;
                    }
                }
            }
            .submit-btn {
                width: 70%;
                height: 1.2rem;
                line-height: 1.2rem;
                background: #E81003;
                color: #fff;
                text-align: center;
                font-size: 0.5rem;
                margin: 1rem auto 0;
                border-radius: 0.15rem;
            }
            input, textarea {
                border: 1px solid #f4f4f4;
                border-radius: 0.1rem;
                font-size: 0.39rem;
                padding: 0.1rem 0.1rem 0.08rem;
            }
            .form-container {
                .mint-cell-wrapper {
                    background-image: none !important;
                }
                .mint-cell-title {
                    width: 2.2rem;
                    .mint-cell-text {
                        font-size: 0.38rem;
                    }
                }
                .select .mint-cell-value {
                    position: relative;
                    &:after {
                        position: absolute;
                        content: '\20';
                        right: 0.3rem;
                        top: calc(50% - 0.1rem);
                        background: ~"url(../assets/image/sanjiaoxing.jpg)";
                        width: 0.3rem;
                        background-size: 100% 100%;
                        height: 0.2rem;
                    }
                }
                .remark-container {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 0 10px 0.2rem;
                    font-size: 0.38rem;
                    .remark-label {
                        width: 2.2rem;
                        text-align: left;
                    }
                    .remark-data {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        align-items: center;
                        flex: 1;
                        .remark-item {
                            width: 32%;
                            height: 0.9rem;
                            background: #f1f1f1;
                            border: 1px solid #efefef;
                            line-height: 0.9rem;
                            text-align: center;
                            margin-top: 0.2rem;
                            font-size: 0.38rem;
                            border-radius: 0.15rem;
                            color: #666;
                            &.active {
                                background: #fff;
                                border: 1px solid #E8001F;
                                color: #E8001F;
                            }
                        }
                    }
                }
            }
        }
        .rights {
            padding-top: 0.7rem;
            font-size: 0.1rem;
            text-align: center;
            color: #ffbfbf;
        }
        .tip {
            padding: 0.2rem 0;
            font-size: 0.32rem;
            text-align: left;
            color: #f60;
            line-height: 1.7;
            display: flex;
            span:nth-child(2) {
                flex: 1;
            }
        }
    }
</style>
