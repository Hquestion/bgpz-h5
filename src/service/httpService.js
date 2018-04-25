/**
 * 封装AJAX接口调用，通用错误处理，以及http请求拦截处理
 */
import Vue from 'vue';
import VueResource from 'vue-resource';
import config from '../config';
import {httpInterceptor} from './httpInterceptor';
import {serializeData} from '../util';
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;
Vue.http.options.crossOrigin = true;
Vue.http.options.emulateHTTP = true;
Vue.http.interceptors.push(httpInterceptor);

export default {
    post: function(url, data, ignoreLoading, isAbsPath = false){
        !isAbsPath && (url = config.httpServerUrl + url);
        if(typeof data === 'boolean') {
            ignoreLoading = data;
            data = {};
        }
        let that = this;
        return new Promise(function(resolve, reject){
            Vue.http({
                url: url,
                method: 'POST',
                body: data,
                ignore: !!ignoreLoading
            }).then(function(res){
                that.handleResponse(res, resolve, reject);
            }, function(res){
                reject(res.data);
            });
        });
    },
    get: function(url, data, ignoreLoading = false, isAbsPath = false){
        !isAbsPath && (url = config.httpServerUrl + url);
        if(typeof data === 'boolean') {
            ignoreLoading = data;
            data = {};
        }
        let that = this;
        return new Promise(function(resolve, reject){
            Vue.http({
                url: url,
                method: 'GET',
                params: data,
                ignore: !!ignoreLoading
            }).then(function(res){
                that.handleResponse(res, resolve, reject);
            }, function(res){
                reject(res.data);
            });
        });
    },
    postForm(url, data, ignoreLoading){
        url = config.httpServerUrl + url;
        if(typeof data === 'boolean') {
            ignoreLoading = data;
            data = {};
        }
        data.headers = {'client':1,'cityid':1,'latitude':0,'longitude':0};
        data.requestType = 'eightHtml5';
        let that = this;
        let param = serializeData(data);
        return new Promise(function(resolve, reject){
            Vue.http({
                url: url,
                method: 'POST',
                body: param,
                ignore: !!ignoreLoading
            }).then(function(res){
                that.handleResponse(res, resolve, reject);
            }, function(res){
                reject(res.data);
            });
        });
    },
    jsonp: function(url, data){
        return Vue.http.jsonp(url);
    },
    handleResponse: function(res, resolve, reject){
        if(res.ok && !res.data) {
            resolve();
        }else if(res.ok){
            try{
                if(typeof res.data === 'string') {
                    res.data = JSON.parse(res.data);
                }
                if(typeof res.data.respcode !== 'undefined') {
                    if(res.data.respcode === 'S000') {
                        resolve(res.data);
                    }else {
                        reject(res.data);
                    }
                }else {
                    resolve(res.data);
                }
            }catch(e) {
                reject(res.data);
            }
        }else {
            reject(res.data);
        }
    }
};
