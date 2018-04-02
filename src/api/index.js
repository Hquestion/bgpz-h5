/**
 * 服务端api接口统一处理，
 */
import httpService from '../service/httpService';

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
    }
};
