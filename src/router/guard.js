export default function(router) {
    router.beforeEach((to, from, next) => {
        console.log('路由跳转开始')
        next();
    });

    router.afterEach(() => {
        console.log('路由跳转结束');
    });
};