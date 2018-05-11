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
        return httpService.postForm('custom/user/getInfo');
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
    }
};
