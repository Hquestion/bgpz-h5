import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
import App from './App';
import 'mint-ui/lib/style.min.css';
import MintUI from 'mint-ui';
/**
 * vue-navigation  导航默认行为类似手机APP的页面导航
 * https://github.com/zack24q/vue-navigation/blob/master/README_CN.md
 */
import VueNavigation from 'vue-navigation';
require('babel-polyfill');

import routerCfg from './router';
import routerGuard from './router/guard';

Vue.use(MintUI);
Vue.use(VueRouter);

let router = new VueRouter({
    routes: routerCfg
});
routerGuard(router);

Vue.use(VueNavigation, {router});

window.myApp = new Vue({
    el: '#app',
    router,
    components: {
        App
    }
});

module.hot && module.hot.accept();
