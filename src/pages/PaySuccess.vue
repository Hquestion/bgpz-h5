<template>
    <div class="pay-success">
        <bg-header title="报名成功" to="/party"></bg-header>
        <div class="success-tip">
            <div class="success-indicator">
                <img src="../assets/image/chosed-w.png">
                <span>您已报名成功！</span>
            </div>
            <div class="project-theme">
                【{{payTypeName}}：{{projectData.theme}}】
            </div>
        </div>
        <bg-cell>
            <div slot="left">时间</div>
            <div slot="middle">{{projectData.partyTime | dateFormat('sec')}}</div>
        </bg-cell>
        <bg-cell>
            <div slot="left">地址</div>
            <div slot="middle">{{projectData.partyAddress}}</div>
        </bg-cell>
        <bg-cell>
            <div slot="left">人数</div>
            <div slot="middle">{{projectData.partyNumber}}人</div>
        </bg-cell>
        <bg-cell>
            <div slot="left">电话</div>
            <div slot="middle">{{projectData.ownerPhone}}</div>
        </bg-cell>
    </div>
</template>

<script>
    import BgHeader from "../components/BgHeader";
    import BgCell from "../components/BgCell";
    import filter from '../mixins/filter';
    import api from '../api';

    const typeNameMap = {
        'party': '聚会'
    };
    export default {
        name: "PaySuccess",
        mixins: [filter],
        components: {BgCell, BgHeader},
        data(){
            return {
                payType: '',
                payTypeId: '',
                projectData: {}
            }
        },
        computed: {
            payTypeName(){
                return typeNameMap[this.payType];
            }
        },
        methods: {
            init(){
                if(this.payType === 'party') {
                    this.initPartyData();
                }
            },
            initPartyData(){
                api.getPartyDetail(this.payTypeId).then(res => {
                    this.projectData = res.data;
                });
            }
        },
        mounted(){
            let typeName = this.$route.params.type.split('@')[0];
            let typeId = this.$route.params.type.split('@')[1];
            this.payType = typeName;
            this.payTypeId = typeId;
            this.init();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .pay-success{
        padding-top: 50px;
        .success-tip {
            background: @red;
            color: #fff;
            text-align: center;
            padding: 25/ 37.5rem;
            .success-indicator {
                font-size: 0;
                padding: 10/37.5rem;
                img {
                    vertical-align: middle;
                }
                span {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 0.56rem;
                    margin-left: 0.3rem;
                }
            }
        }
    }
</style>
