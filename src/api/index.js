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
    }
};
