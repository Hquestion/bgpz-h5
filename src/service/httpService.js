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

import {Toast} from 'mint-ui';

let isLock = false;

export default {
    post: function(url, data, ignoreLoading, isAbsPath = false){
        let reqUrl = url;
        !isAbsPath && (reqUrl = config.httpServerUrl + url);
        if(typeof data === 'boolean') {
            ignoreLoading = data;
            data = {};
        }
        let that = this;
        return new Promise(function(resolve, reject){
            let opt = {
                url: reqUrl,
                method: 'POST',
                body: data,
            };
            if(reqUrl.indexOf('998') < 0) {
                opt.ignore = !!ignoreLoading;
                opt.headers = {
                    client: '1',
                    cityid: '1',
                    latitude: 0,
                    longitude: 0,
                    token: localStorage.getItem('token')
                };
            }
            Vue.http(opt).then(function(res){
                that.handleResponse(res).then(handleRes => {
                    resolve(handleRes);
                }, handleRes => {
                    if(handleRes === 'RE_AUTHORATION') {
                        that.post(url, data, ignoreLoading, isAbsPath).then(resp => {
                            resolve(resp);
                        }, resp => {
                            reject(resp);
                        });
                    }else {
                        reject(handleRes);
                    }
                });
            }, function(res){
                reject(res.data);
            });
        });
    },
    get: function(url, data, ignoreLoading = false, isAbsPath = false){
        let reqUrl = url;
        !isAbsPath && (reqUrl = config.httpServerUrl + url);
        if(typeof data === 'boolean') {
            ignoreLoading = data;
            data = {};
        }
        let that = this;
        return new Promise(function(resolve, reject){
            let opt = {
                url: reqUrl,
                method: 'GET',
                params: data,
            };
            if(reqUrl.indexOf('998') < 0) {
                opt.ignore = !!ignoreLoading;
                opt.headers = {
                    client: '1',
                    cityid: '1',
                    latitude: 0,
                    longitude: 0,
                    token: localStorage.getItem('token')
                };
            }
            Vue.http(opt).then(function(res){
                that.handleResponse(res).then(handleRes => {
                    resolve(handleRes);
                }, handleRes => {
                    if(handleRes === 'RE_AUTHORATION') {
                        that.get(url, data, ignoreLoading, isAbsPath).then(resp => {
                            resolve(resp);
                        }, resp => {
                            reject(resp);
                        });
                    }else {
                        reject(handleRes);
                    }
                });
            }, function(res){
                reject(res.data);
            });
        });
    },
    postForm(url, data, ignoreLoading){
        let requrl = config.httpServerUrl + url;
        if(typeof data === 'boolean') {
            ignoreLoading = data;
            data = {};
        }
        data = data || {};
        data.headers = {'client':1,'cityid':1,'latitude':0,'longitude':0, token: localStorage.getItem('token') || ''};
        data.requestType = 'eightHtml5';
        let that = this;
        let param = serializeData(data);
        return new Promise(function(resolve, reject){
            Vue.http({
                url: requrl,
                method: 'POST',
                body: param,
                ignore: !!ignoreLoading
            }).then(function(res){
                that.handleResponse(res).then(handleRes => {
                    resolve(handleRes);
                }, handleRes => {
                    if(handleRes === 'RE_AUTHORATION') {
                        that.postForm(url, data, ignoreLoading).then(resp => {
                            resolve(resp);
                        }, resp => {
                            reject(resp);
                        });
                    }else {
                        reject(handleRes);
                    }
                });
            }, function(res){
                reject(res.data);
            });
        });
    },
    jsonp: function(url, data){
        return Vue.http.jsonp(url);
    },
    getResource: function(url, ignoreLoading = true){
        return new Promise((resolve, reject) => {
            Vue.http({
                url: url,
                method: 'GET',
                ignore: !!ignoreLoading
            }).then(resolve, reject);
        });
    },
    handleResponse: function(res){
        return new Promise((resolve, reject) => {
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
                            if(res.data.respcode === 'E904') {
                                if(isLock) {
                                    reject('RE_AUTHORATION');
                                    return;
                                }
                                // localStorage.setItem('openid', '8');
                                if(localStorage.getItem('openid')) {
                                    isLock = true;
                                    this.get(config.apartHttpServerUrl + 'api/Identity/GrantWxToken', {
                                        openid: localStorage.getItem('openid')
                                    }, false, true).then(token => {
                                        setTimeout(function(){
                                            isLock = false;
                                        }, 60 * 1000);
                                        localStorage.setItem('token', token.data);
                                        reject('RE_AUTHORATION');
                                    }, () => {
                                        isLock = false;
                                        Toast({
                                            message: '请先登录',
                                            position: 'bottom'
                                        });
                                        localStorage.setItem('token','');
                                        localStorage.setItem('returnUrl',window.location.href);
                                        setTimeout(function(){
                                            window.location.replace('http://app.bagepanzi.com/common/regLogin.html');
                                        }, 800);
                                        reject(res);
                                    });
                                }else {
                                    Toast({
                                        message: '请先登录',
                                        position: 'bottom'
                                    });
                                    localStorage.setItem('token','');
                                    localStorage.setItem('returnUrl',window.location.href);
                                    setTimeout(function(){
                                        window.location.replace('http://app.bagepanzi.com/common/regLogin.html');
                                    }, 800);
                                    reject(res);
                                }
                            }else {
                                reject(res.data);
                            }
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
        });
    }
};
