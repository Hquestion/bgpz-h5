import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
import App from './App';
import store from './store/index';
import 'mint-ui/lib/style.min.css';
const VueTouch = require('vue-touch');
import VueLazyload from 'vue-lazyload';
const loadingImg = require('../static/img/loading1.gif');
import 'vodal/common.css';
import 'vodal/zoom.css';
// import MintUI from 'mint-ui';
/**
 * vue-navigation  导航默认行为类似手机APP的页面导航
 * https://github.com/zack24q/vue-navigation/blob/master/README_CN.md
 */
// import VueNavigation from 'vue-navigation';
require('babel-polyfill');

import routerCfg from './router';
import routerGuard from './router/guard';

// Vue.use(MintUI);
Vue.use(VueRouter);
Vue.use(VueTouch, {name: 'v-touch'});
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '',
    loading: loadingImg,
    attempt: 1
});

let router = new VueRouter({
    routes: routerCfg
});
routerGuard(router);

// Vue.use(VueNavigation, {router});

window.EventBus = new Vue();

window.myApp = new Vue({
    el: '#app',
    store,
    router,
    components: {
        App
    }
});

module.hot && module.hot.accept();
