/**
 * 服务端api接口统一处理，
 */
import httpService from '../service/httpService';
import config from '../config';

export default {
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
    getCfg(tagList){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/config', {
                tagList: tagList
            }).then(res => {
                resolve(res);
            }, reject);
        });
    },
    getDiction(tagList){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/diction', {
                tagList: tagList
            }).then(res => {
                resolve(res);
            }, reject);
        });
    },
    checkActivityCoupon(couponCode){
        return new Promise((resolve, reject) => {
            httpService.get(config.activityServerUrl + 'api/OrderExtend/IsUseCoupon', {
                couponCode: couponCode
            }, false, true).then(res => {
                resolve(res);
            }, reject);
        });
    },
    postOrder(param){
        return new Promise((resolve, reject) => {
            httpService.post(config.activityServerUrl + 'api/OrderExtend/CreateOrder', param, false, true).then(res => {
                resolve(res);
            }, reject);
        });
    },
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
    getPartyDetail(id){
        return new Promise((resolve, reject) => {
            httpService.postForm('custom/party/detail', {
                id: id
            }, true).then(resolve, reject);
        });
    },
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
    getSDKData(url){
        return new Promise((resolve, reject) => {
            httpService.postForm('fund/jsSdk', {
                url: url
            }).then(res => {
                resolve(res.data);
            }, reject);
        });
    },
    joinParty(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('custom/party/partIn', param).then(resolve, reject);
        });
    },
    getAds(tagName){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/ads', {
                tagName: tagName
            }).then(resolve, reject);
        });
    },
    getAccountInfo(){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/Fund/curFund').then(resolve, reject);
        });
    },
    pay(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/fund/pay', param).then(resolve, reject);
        });
    },
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
    getPartyImages(pageIndex, pageSize){
        return httpService.postForm('custom/party/backgroundList', {
            page: pageIndex,
            rows: pageSize
        });
    },
    getPlatformAddress(pageIndex, pageSize){
        return httpService.postForm('custom/user/platformList', {
            page: pageIndex,
            rows: pageSize
        });
    },
    getUserAddress(pageIndex, pageSize){
        return httpService.postForm('custom/user/addrList', {
            page: pageIndex,
            rows: pageSize
        });
    },
    getRegionList(){
        return httpService.postForm('common/regionList', {
            fid: 1
        });
    },
    getAddressDetail(id){
        return httpService.postForm('custom/user/selAddr', {
            idList: [id]
        });
    },
    deleteAddress(id){
        return httpService.postForm('custom/user/delAddr', {
            idList: [id]
        });
    },
    setDefaultAddress(id){
        return httpService.postForm('custom/user/defaultAddress', {
            id: id
        });
    },
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
    getPackageFoodList(id) {
        return httpService.postForm('common/packageFoodList', {
            packageId: id
        });
    },
    updateOrderStatus(orderId, status){
        return httpService.postForm('custom/party/updateParty', {
            orderId: orderId,
            customStatus: status
        });
    },
    getPartyOrderDetail(orderId){
        return httpService.postForm('custom/party/selUserParty', {
            id: orderId
        });
    },
    getPartyCommentList(partyId, pageIndex, pageSize){
        return httpService.get(config.apartHttpServerUrl + 'api/Party/GetPartyCommentList', {
            partyid: partyId,
            page: pageIndex,
            rows: pageSize
        }, false, true);
    },
    sendComment(partyId, content = ''){
        return httpService.postForm('custom/party/applycomment', {
            party_id: partyId,
            cmt_content: content
        });
    },
    updateUserInfo(userInfo){
        return httpService.postForm('custom/user/update', {
            keyValueJson: {
                avatar: userInfo.avatar,
                nickname: userInfo.nickname,
                identity: userInfo.identity
            }
        });
    },
    getResource(url){
        return httpService.getResource(url);
    },
    getThirdpartAddress(){
        return httpService.postForm('custom/party/thirdSpaceList', {
            page: 1,
            rows: 100
        });
    },
    deleteComment(id){
        return httpService.postForm('custom/party/delPartyComment', {
            id: id
        });
    },
    getMyPassedParty(){
        return httpService.postForm('custom/party/selPartyMaster');
    },
    getPartyLackMoney(id){
        return httpService.postForm('custom/party/selPartyLackMoney', {
            id: id
        });
    },
    userSharePartyPay(orderId){
        return httpService.postForm('custom/party/shareParty', {
            id: orderId
        });
    },
    getUserUnshareParty(){
        return httpService.postForm('custom/party/selShareparty');
    },
    getFoodSeries(){
        return httpService.postForm('common/selFoodSeries');
    },
    getFoodSpecial(){
        return httpService.postForm('common/selFoodSpecial');
    },
    getShareQrcode(id, uid, url){
        return httpService.postForm('Fund/shareQrcode', {
            id: id,
            uid: uid,
            type: 2,
            url: url
        });
    },
    getFreePartyOrder(partyId){
        return httpService.postForm('custom/party/selPayparty', {
            id: partyId
        });
    },
    cancelParty(partyId){
        return httpService.postForm('custom/party/cleParty', {
            id: partyId
        });
    },
    getWxOpenid(uid){
        return httpService.postForm('common/grantOpenid', {
            uid: uid
        });
    },
    isUserSubscribeWx(openid){
        return httpService.postForm('common/wxSubscribe', {
            openid: openid
        });
    },
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
    getPackageList(){
        return httpService.postForm('/common/packageList', {
            page: 1,
            rows: 100,
            sence: 4,
            keywords: ""
        });
    },
    getPackageDetail(id) {
        return httpService.postForm('/common/packageDetail', {
            id: id
        });
    },
    getPackageFoods(id) {
        return httpService.postForm('/common/packageFoodList', {
            packageId: id
        });
    },
    getPackageActivity(){
        return httpService.get(config.apartHttpServerUrl + 'api/Food/GetListDiscountFoodView', {}, false, true);
    },
    verifyFoodMatchNumberOfPeople(param){
        return httpService.post(config.apartHttpServerUrl + 'api/Order/VerificationFoodCategoryPeople', param, false, true);
    },
    getH5(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('common/single', {
                tagList: param
            }).then(res => {
                resolve(res);
            }, reject);
        });
    },
    getOrderExtension(){
        let param = {
            orderType: 1
        };
        return httpService.get(config.apartHttpServerUrl + 'api/OrderExtension/GetOrderExtensionSelectByOrderType', param, false, true);
    },
    saveOrderExtension(orderId, modelList){
        return httpService.post(config.apartHttpServerUrl + 'api/OrderExtension/SaveOrderExtensionSelect', {
            order_id: orderId,
            modelList: modelList
        }, false, true);
    },
    submitBanquetOrder(param){
        return new Promise((resolve, reject) => {
            httpService.postForm('/custom/order/postOrder', param).then(res => {
                resolve(res);
            }, (res)=>{
                reject(res);
            });
        });
    },
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
    getFoodsByCate(cateId, companyId){
        return httpService.postForm('/common/cateFoodList', {
            cateId: cateId,
            companyId: companyId,
            page: 1,
            rows: 100,
        });
    },
    userIsVip(){
        return httpService.postForm('/custom/user/checkVipValid');
    },
    vipMonthAvaliableTimes(){
        return httpService.postForm('/custom/user/availableNum');
    },
    isUserFirstTimeRecharge(){
        return httpService.postForm('/custom/user/userFirstFund');
    },
    updateOrderInfo(param){
        return httpService.postForm('/custom/order/llpayOrderinfo', param);
    },
    getOrderDetail(orderId){
        return httpService.postForm('/custom/order/detail', {
            orderId: orderId
        });
    },
    updateOrderRemark(orderId, remark){
        return httpService.postForm('/custom/order/updateRemark', {
            orderId,
            remark
        });
    }
};
