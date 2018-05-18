import api from '../api';
import {Toast} from 'mint-ui';

const wx = window.wx || {};

export default {
    methods: {
        initShareCfg(data){
            api.getSDKData(location.href).then(res => {
                let wxSdkData = res;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wxSdkData.appId, // 必填，公众号的唯一标识
                    timestamp: wxSdkData.timestamp, // 必填，生成签名的时间戳
                    nonceStr: wxSdkData.nonceStr, // 必填，生成签名的随机串
                    signature: wxSdkData.signature,// 必填，签名
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareQZone'
                    ] // 必填，需要使用的JS接口列表
                });
            });
            this._initShareContent(data);
        },
        _initShareContent(data){
            let self = this;
            let shareParam = {
                type: 'link',
                desc: data.description, // 分享描述
                title: data.theme, // 分享标题
                link: data.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: data.shareImg, // 分享图标
                success() {
                    // 用户确认分享后执行的回调函数
                    self.shareSuccessCb(data);
                },
                cancel(){
                    self.shareCancelCb(data);
                }
            };
            wx.ready(() => {
                wx.onMenuShareTimeline(shareParam);
                wx.onMenuShareAppMessage(shareParam);
                wx.onMenuShareQQ(shareParam);
                wx.onMenuShareQZone(shareParam);
            });
        },
        shareSuccessCb(data){
            if(data.successCb) {
                data.successCb.call(this);
            }
        },
        shareCancelCb(){
            Toast({
                message: '您取消了分享',
                position: 'bottom'
            });
        }
    }
};
