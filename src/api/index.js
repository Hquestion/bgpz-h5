/**
 * 服务端api接口统一处理，
 */
import httpService from '../service/httpService';
import config from '../config';

export default {
    /**
     * 获取平台酒店列表
     * @returns {Promise<any>}
     */
    getRestaurantList() {
        return new Promise((resolve, reject) => {
            httpService.postForm('common/companyList', {
                page: 1,
                rows: 50
            }).then(res => {
                resolve(res);
            }, res => {
                reject(res);
            });
        });
    },
    /**
     * 获取酒店菜品类别接口
     * @param companyId
     * @returns {Promise<any>}
     */
    getFoodCateList(companyId){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/foodCategoryList', {
                companyId: companyId
            }).then(res => {
                resolve(res);
            }, res => {
                reject(res);
            });
        });
    },
    /**
     * 根据酒店及分类获取菜品列表
     * @param cateId
     * @param companyId
     * @returns {Promise<any>}
     */
    getFoodListByCategory(cateId, companyId){
        return new Promise((resolve, reject) => {
            this.getFoodListByCategory.caches = this.getFoodListByCategory.caches || [];
            let caches = this.getFoodListByCategory.caches;
            if(caches[companyId + '@' + cateId]) {
                resolve(caches[companyId + '@' + cateId]);
            }else {
                httpService.postForm('common/cateFoodList', {
                    companyId: companyId,
                    cateId: cateId,
                    page: 1,
                    rows: 50
                }).then(res => {
                    caches[companyId + '@' + cateId] = res;
                    resolve(res);
                }, res => {
                    caches[companyId + '@' + cateId] = [];
                    reject(res);
                });
            }
        });
    },
    /**
     * 获取配置项
     * @param tagList
     * @returns {Promise<any>}
     */
    getCfg(tagList){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/config', {
                tagList: tagList
            }).then(res => {
                resolve(res);
            }, reject);
        });
    },
    /**
     * 获取字典表
     * @param tagList
     * @returns {Promise<any>}
     */
    getDiction(tagList){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/diction', {
                tagList: tagList
            }).then(res => {
                resolve(res);
            }, reject);
        });
    },
    /**
     * 校验美食节活动优惠券
     * @param couponCode
     * @returns {Promise<any>}
     */
    checkActivityCoupon(couponCode){
        return new Promise((resolve, reject) => {
            httpService.post(config.activityServerUrl + 'api/OrderExtend/IsUseCoupon', {
                FLnkID: couponCode
            }, false, true).then(res => {
                resolve(res);
            }, res=>{
                reject(res);
            });
        });
    },
    /**
     * 美食节活动下单
     * @param param
     * @returns {Promise<any>}
     */
    postOrder(param){
        return new Promise((resolve, reject) => {
            httpService.post(config.activityServerUrl + 'api/OrderExtend/CreateOrder', param, false, true).then(res => {
                resolve(res);
            }, reject);
        });
    },
    /**
     * 获取聚会列表
     * @param pageIndex
     * @param pageSize
     * @param status
     * @param type
     * @param content
     * @returns {Promise<any>}
     */
    getPartyList(pageIndex, pageSize, status, type, content){
        return new Promise((resolve, reject) => {
            httpService.postForm('custom/party/oList', {
                page: pageIndex,
                rows: pageSize,
                status: status,
                type: type,
                content: content || ''
            }, true).then(resolve, reject);
        });
    },
    /**
     * 获取聚会详情
     * @param id
     * @returns {Promise<any>}
     */
    getPartyDetail(id){
        return new Promise((resolve, reject) => {
            httpService.postForm('custom/party/detail', {
                id: id
            }, true).then(resolve, reject);
        });
    },
    /**
     * 获取聚会成员列表
     * @param id
     * @returns {Promise<any>}
     */
    getPartyMemberList(id){
        return new Promise((resolve, reject) => {
            httpService.postForm('custom/party/partInList', {
                partyId: id
            }, true).then(res => {
                if(res.data && res.data.list && res.data.list instanceof Array) {
                    resolve(res.data.list);
                }else {
                    reject(res);
                }
            }, reject);
        });
    },
    /**
     * 获取微信公众号参数
     * @param url
     * @returns {Promise<any>}
     */
    getSDKData(url){
        return new Promise((resolve, reject) => {
            httpService.postForm('fund/jsSdk', {
                url: url
            }).then(res => {
                resolve(res.data);
            }, reject);
        });
    },
    /**
     * 用户参加聚会
     * @param param
     * @returns {Promise<any>}
     */
    joinParty(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('custom/party/partIn', param).then(resolve, reject);
        });
    },
    /**
     * 获取广告位
     * @param tagName
     * @returns {Promise<any>}
     */
    getAds(tagName){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/ads', {
                tagName: tagName
            }).then(resolve, reject);
        });
    },
    /**
     * 获取用户账户信息
     * @returns {Promise<any>}
     */
    getAccountInfo(){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/Fund/curFund').then(resolve, reject);
        });
    },
    /**
     * 支付接口
     * @param param
     * @returns {Promise<any>}
     */
    pay(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/fund/pay', param).then(resolve, reject);
        });
    },
    /**
     * 获取用户信息
     * @returns {Promise<any>}
     */
    getUserInfo(){
        if(this.getUserInfo.caches) {
            return new Promise((resolve) => {
                resolve(this.getUserInfo.caches);
            });
        }else {
            return new Promise((resolve, reject) => {
                httpService.postForm('custom/user/getInfo').then(res => {
                    this.getUserInfo.caches = res;
                    resolve(res);
                }, reject);
            });
        }
    },
    /**
     * 获取聚会图片
     * @param pageIndex
     * @param pageSize
     * @returns {*}
     */
    getPartyImages(pageIndex, pageSize){
        return httpService.postForm('custom/party/backgroundList', {
            page: pageIndex,
            rows: pageSize
        });
    },
    /**
     * 获取平台地址列表
     * @param pageIndex
     * @param pageSize
     * @returns {*}
     */
    getPlatformAddress(pageIndex, pageSize){
        return httpService.postForm('custom/user/platformList', {
            page: pageIndex,
            rows: pageSize
        });
    },
    /**
     * 获取用户地址
     * @param pageIndex
     * @param pageSize
     * @returns {*}
     */
    getUserAddress(pageIndex, pageSize){
        return httpService.postForm('custom/user/addrList', {
            page: pageIndex,
            rows: pageSize
        });
    },
    /**
     * 获取省市区信息
     * @returns {*}
     */
    getRegionList(){
        return httpService.postForm('common/regionList', {
            fid: 1
        });
    },
    /**
     * 获取地址详情
     * @param id
     * @returns {*}
     */
    getAddressDetail(id){
        return httpService.postForm('custom/user/selAddr', {
            idList: [id]
        });
    },
    /**
     * 删除地址
     * @param id
     * @returns {*}
     */
    deleteAddress(id){
        return httpService.postForm('custom/user/delAddr', {
            idList: [id]
        });
    },
    /**
     * 设置默认地址
     * @param id
     * @returns {*}
     */
    setDefaultAddress(id){
        return httpService.postForm('custom/user/defaultAddress', {
            id: id
        });
    },
    /**
     * 保存地址修改
     * @param param
     * @returns {*}
     */
    saveAddress(param){
        return httpService.postForm('custom/user/addressMif', param);
    },
    // 发布聚会
    releaseParty(param){
        return httpService.postForm('custom/party/apply', param);
    },
    // 分享完成之后正式启动聚会
    openParty(partyId){
        return httpService.postForm('custom/party/open', {
            partyId: partyId
        });
    },
    /**
     * 获取套餐菜品列表
     * @param id
     * @returns {*}
     */
    getPackageFoodList(id) {
        return httpService.postForm('common/packageFoodList', {
            packageId: id
        });
    },
    /**
     * 更新聚会订单状态
     * @param orderId
     * @param status
     * @returns {*}
     */
    updateOrderStatus(orderId, status){
        return httpService.postForm('custom/party/updateParty', {
            orderId: orderId,
            customStatus: status
        });
    },
    /**
     * 获取聚会订单详情
     * @param orderId
     * @returns {*}
     */
    getPartyOrderDetail(orderId){
        return httpService.postForm('custom/party/selUserParty', {
            id: orderId
        });
    },
    /**
     * 获取聚会评论列表
     * @param partyId
     * @param pageIndex
     * @param pageSize
     * @returns {*}
     */
    getPartyCommentList(partyId, pageIndex, pageSize){
        return httpService.get(config.apartHttpServerUrl + 'api/Party/GetPartyCommentList', {
            partyid: partyId,
            page: pageIndex,
            rows: pageSize
        }, false, true);
    },
    /**
     * 发表评论
     * @param partyId
     * @param content
     * @returns {*}
     */
    sendComment(partyId, content = ''){
        return httpService.postForm('custom/party/applycomment', {
            party_id: partyId,
            cmt_content: content
        });
    },
    /**
     * 更新用户信息
     * @param userInfo
     * @returns {*}
     */
    updateUserInfo(userInfo){
        return httpService.postForm('custom/user/update', {
            keyValueJson: {
                avatar: userInfo.avatar,
                nickname: userInfo.nickname,
                identity: userInfo.identity
            }
        });
    },
    /**
     * 获取静态资源
     * @param url
     * @returns {*}
     */
    getResource(url){
        return httpService.getResource(url);
    },
    /**
     * 获取第三方地址
     * @returns {*}
     */
    getThirdpartAddress(){
        return httpService.postForm('custom/party/thirdSpaceList', {
            page: 1,
            rows: 100
        });
    },
    /**
     * 删除评论
     * @param id
     * @returns {*}
     */
    deleteComment(id){
        return httpService.postForm('custom/party/delPartyComment', {
            id: id
        });
    },
    /**
     * 获取用户创建的即将过期的聚会
     * @returns {*}
     */
    getMyPassedParty(){
        return httpService.postForm('custom/party/selPartyMaster');
    },
    /**
     * 聚会未成功启动时（报名人数未达标），获取当前打赏金额和餐标的差价
     * @param id
     * @returns {*}
     */
    getPartyLackMoney(id){
        return httpService.postForm('custom/party/selPartyLackMoney', {
            id: id
        });
    },
    /**
     * 用户支付完成后分享聚会
     * @param orderId
     * @returns {*}
     */
    userSharePartyPay(orderId){
        return httpService.postForm('custom/party/shareParty', {
            id: orderId
        });
    },
    /**
     * 获取用户未分享的聚会
     * @returns {*}
     */
    getUserUnshareParty(){
        return httpService.postForm('custom/party/selShareparty');
    },
    /**
     * 获取菜系列表
     * @returns {*}
     */
    getFoodSeries(){
        return httpService.postForm('common/selFoodSeries');
    },
    /**
     * 获取菜品特色列表
     * @returns {*}
     */
    getFoodSpecial(){
        return httpService.postForm('common/selFoodSpecial');
    },
    /**
     * 获取聚会分享二维码
     * @param id
     * @param uid
     * @param url
     * @returns {*}
     */
    getShareQrcode(id, uid, url){
        return httpService.postForm('Fund/shareQrcode', {
            id: id,
            uid: uid,
            type: 2,
            url: url
        });
    },
    /**
     * 获取免费聚会订单
     * @param partyId
     * @returns {*}
     */
    getFreePartyOrder(partyId){
        return httpService.postForm('custom/party/selPayparty', {
            id: partyId
        });
    },
    /**
     * 取消聚会
     * @param partyId
     * @returns {*}
     */
    cancelParty(partyId){
        return httpService.postForm('custom/party/cleParty', {
            id: partyId
        });
    },
    /**
     * 获取用户openid
     * @param uid
     * @returns {*}
     */
    getWxOpenid(uid){
        return httpService.postForm('common/grantOpenid', {
            uid: uid
        });
    },
    /**
     * 获取用户是否关注微信公众号
     * @param openid
     * @returns {*}
     */
    isUserSubscribeWx(openid){
        return httpService.postForm('common/wxSubscribe', {
            openid: openid
        });
    },
    /**
     * 根据条件获取套餐列表
     * @param price
     * @param foodSeries
     * @param foodSpecial
     * @returns {*}
     */
    filterBanquetPackageList(price, foodSeries, foodSpecial){
        return httpService.postForm('common/packageList', {
            page: 1,
            rows: 20,
            sence: 3,
            price: price,
            series: foodSeries,
            special: foodSpecial
        });
    },
    /**
     * 获取所有套餐列表
     * @returns {*}
     */
    getPackageList(){
        return httpService.postForm('/common/packageList', {
            page: 1,
            rows: 100,
            sence: 4,
            keywords: ""
        });
    },
    /**
     * 获取套餐详情
     * @param id
     * @returns {*}
     */
    getPackageDetail(id) {
        return httpService.postForm('/common/packageDetail', {
            id: id
        });
    },
    /**
     * 获取套餐菜品列表
     * @param id
     * @returns {*}
     */
    getPackageFoods(id) {
        return httpService.postForm('/common/packageFoodList', {
            packageId: id
        });
    },
    /**
     * 获取套餐特价活动
     * @returns {*}
     */
    getPackageActivity(){
        return httpService.get(config.apartHttpServerUrl + 'api/Food/GetListDiscountFoodView', {}, false, true);
    },
    /**
     * 校验菜品是否匹配人数桌数
     * @param param
     * @returns {*}
     */
    verifyFoodMatchNumberOfPeople(param){
        return httpService.post(config.apartHttpServerUrl + 'api/Order/VerificationFoodCategoryPeople', param, false, true);
    },
    /**
     * 获取部分功能网页
     * @param param
     * @returns {Promise<any>}
     */
    getH5(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/single', {
                tagList: param
            }).then(res => {
                resolve(res);
            }, reject);
        });
    },
    /**
     * 获取私宴订单扩展配置
     * @returns {*}
     */
    getOrderExtension(){
        let param = {
            orderType: 1
        };
        return httpService.get(config.apartHttpServerUrl + 'api/OrderExtension/GetOrderExtensionSelectByOrderType', param, false, true);
    },
    /**
     * 保存私宴订单扩展信息
     * @param orderId
     * @param modelList
     * @returns {*}
     */
    saveOrderExtension(orderId, modelList){
        return httpService.post(config.apartHttpServerUrl + 'api/OrderExtension/SaveOrderExtensionSelect', {
            order_id: orderId,
            modelList: modelList
        }, false, true);
    },
    /**
     * 提交私宴订单
     * @param param
     * @returns {Promise<any>}
     */
    submitBanquetOrder(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('/custom/order/postOrder', param).then(res => {
                resolve(res);
            }, (res)=>{
                reject(res);
            });
        });
    },
    /**
     * 根据菜品换菜，获取换菜菜品列表
     * @param foodId
     * @returns {Promise<any>}
     */
    getToChangeFoodList(foodId){
        return new Promise((resolve, reject) => {
            httpService.postForm('/common/changeFoodList', {
                rows: 100,
                page: 1,
                foodId: foodId
            }).then(res=> {
                resolve(res);
            }, reject);
        });
    },
    /**
     * 根据类别获取菜品列表
     * @param cateId
     * @param companyId
     * @returns {*}
     */
    getFoodsByCate(cateId, companyId){
        return httpService.postForm('/common/cateFoodList', {
            cateId: cateId,
            companyId: companyId,
            page: 1,
            rows: 100,
        });
    },
    /**
     * 判断用户是否时vip
     * @returns {*}
     */
    userIsVip(){
        return httpService.postForm('/custom/user/checkVipValid');
    },
    /**
     * 获取vip用户当月免单剩余次数
     * @returns {*}
     */
    vipMonthAvaliableTimes(){
        return httpService.postForm('/custom/user/availableNum');
    },
    /**
     * 获取用户是否首次充值
     * @returns {*}
     */
    isUserFirstTimeRecharge(){
        return httpService.postForm('/custom/user/userFirstFund');
    },
    /**
     * 更新订单信息
     * @param param
     * @returns {*}
     */
    updateOrderInfo(param){
        return httpService.postForm('/custom/order/llpayOrderinfo', param);
    },
    /**
     * 获取订单详情
     * @param orderId
     * @returns {*}
     */
    getOrderDetail(orderId){
        return httpService.postForm('/custom/order/detail', {
            orderId: orderId
        });
    },
    /**
     * 更新订单备注信息等
     * @param orderId
     * @param remark
     * @param ticketTitle
     * @returns {*}
     */
    updateOrderRemark(orderId, remark, ticketTitle){
        return httpService.postForm('/custom/order/updateRemark', {
            orderId,
            remark,
            invoicetitle: ticketTitle
        });
    }
};
