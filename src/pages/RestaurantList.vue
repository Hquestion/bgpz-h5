<template>
    <div class="restaurant-list-container">
        <bg-header fixed title="自助点餐"></bg-header>
        <div class="restaurant-swiper-container">
            <div class="swiper-tip">← 左右滑动切换酒店 →</div>
            <swiper :options="swiperOption" class="swiper-block" ref="restaurantSwiper">
                <swiper-slide v-for="(restaurant, index) in restaurantData" :key="index">
                    <restaurant-card :data="restaurant">
                        <div slot="content">
                            招牌才
                        </div>
                    </restaurant-card>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import BgHeader from '../components/BgHeader';
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import RestaurantCard from '../components/RestaurantCard';

    export default {
        name: "restaurant-list",
        components: {
            BgHeader: BgHeader,
            swiper,
            swiperSlide,
            RestaurantCard
        },
        data(){
            return {
                swiperOption: {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 0,
                    setWrapperSize: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    }
                },
                restaurantData: [{
                    name: '海云天 好记大酒店',
                    description: '　江苏好记大酒店有限公司是南京具有影响力的连锁酒店企业集团，公司创立于2003年， 目前公司旗下拥有两个核心品牌：好记大酒店、海云间;南京地区有好记龙蟠中路店、好记北京东路店、好记江东中路店、海云间、徐悲鸿画苑和金寿餐厅共计6家酒店。至今投资已达1.5亿元，员工近400人，餐位数达1800多个，营业面积10000多平方米。2014年，好记连锁酒店总营业额为6500多万，上交税收350多万元人民币，好记对南京餐饮业发展的贡献得到了南京市政府的充分肯定。\n' +
                    '\n' +
                    '　　随着企业不断发展，好记先后被国家、省、市级政府评为"中国餐饮名店"、南京市"三信三优单位"、南京餐饮商会授予会长单位等荣誉称号。',
                    likeCount: 10,
                    serviceCount: 100
                }, {
                    name: '海云天 好记大酒店',
                    description: '　江苏好记大酒店有限公司是南京具有影响力的连锁酒店企业集团，公司创立于2003年， 目前公司旗下拥有两个核心品牌：好记大酒店、海云间;南京地区有好记龙蟠中路店、好记北京东路店、好记江东中路店、海云间、徐悲鸿画苑和金寿餐厅共计6家酒店。至今投资已达1.5亿元，员工近400人，餐位数达1800多个，营业面积10000多平方米。2014年，好记连锁酒店总营业额为6500多万，上交税收350多万元人民币，好记对南京餐饮业发展的贡献得到了南京市政府的充分肯定。\n' +
                    '\n' +
                    '　　随着企业不断发展，好记先后被国家、省、市级政府评为"中国餐饮名店"、南京市"三信三优单位"、南京餐饮商会授予会长单位等荣誉称号。',
                    likeCount: 10,
                    serviceCount: 100
                }, {
                    name: '海云天 好记大酒店',
                    description: '　江苏好记大酒店有限公司是南京具有影响力的连锁酒店企业集团，公司创立于2003年， 目前公司旗下拥有两个核心品牌：好记大酒店、海云间;南京地区有好记龙蟠中路店、好记北京东路店、好记江东中路店、海云间、徐悲鸿画苑和金寿餐厅共计6家酒店。至今投资已达1.5亿元，员工近400人，餐位数达1800多个，营业面积10000多平方米。2014年，好记连锁酒店总营业额为6500多万，上交税收350多万元人民币，好记对南京餐饮业发展的贡献得到了南京市政府的充分肯定。\n' +
                    '\n' +
                    '　　随着企业不断发展，好记先后被国家、省、市级政府评为"中国餐饮名店"、南京市"三信三优单位"、南京餐饮商会授予会长单位等荣誉称号。',
                    likeCount: 10,
                    serviceCount: 100
                }, {
                    name: '海云天 好记大酒店',
                    description: '　江苏好记大酒店有限公司是南京具有影响力的连锁酒店企业集团，公司创立于2003年， 目前公司旗下拥有两个核心品牌：好记大酒店、海云间;南京地区有好记龙蟠中路店、好记北京东路店、好记江东中路店、海云间、徐悲鸿画苑和金寿餐厅共计6家酒店。至今投资已达1.5亿元，员工近400人，餐位数达1800多个，营业面积10000多平方米。2014年，好记连锁酒店总营业额为6500多万，上交税收350多万元人民币，好记对南京餐饮业发展的贡献得到了南京市政府的充分肯定。\n' +
                    '\n' +
                    '　　随着企业不断发展，好记先后被国家、省、市级政府评为"中国餐饮名店"、南京市"三信三优单位"、南京餐饮商会授予会长单位等荣誉称号。',
                    likeCount: 10,
                    serviceCount: 100
                }, {
                    name: '海云天 好记大酒店',
                    description: '　江苏好记大酒店有限公司是南京具有影响力的连锁酒店企业集团，公司创立于2003年， 目前公司旗下拥有两个核心品牌：好记大酒店、海云间;南京地区有好记龙蟠中路店、好记北京东路店、好记江东中路店、海云间、徐悲鸿画苑和金寿餐厅共计6家酒店。至今投资已达1.5亿元，员工近400人，餐位数达1800多个，营业面积10000多平方米。2014年，好记连锁酒店总营业额为6500多万，上交税收350多万元人民币，好记对南京餐饮业发展的贡献得到了南京市政府的充分肯定。\n' +
                    '\n' +
                    '　　随着企业不断发展，好记先后被国家、省、市级政府评为"中国餐饮名店"、南京市"三信三优单位"、南京餐饮商会授予会长单位等荣誉称号。',
                    likeCount: 10,
                    serviceCount: 100
                }]
            };
        }
        // ,
        // beforeRouteLeave (to, from, next){
        //     try{
        //         // this.$refs.restaurantSwiper.swiper.destroy(true);
        //         this.swiperOption.centeredSlides = false;
        //     }catch (e){}
        //     next();
        // },
        // beforeRouteEnter(to, from, next){
        //     next(vm => {
        //         vm.swiperOption.centeredSlides = false;
        //     });
        // }
    }
</script>

<style scoped>
    .restaurant-list-container {
        background: #f2f2f2;
        height: 100vh;
        padding-top: 60px;
    }
    .restaurant-swiper-container {
        width: 100%;
        height: calc(100vh - 60px);
        background: #fff;
    }
    .swiper-tip {
        height: 2.5rem;
        line-height: 3rem;
        text-align: center;
        font-size: 0.8rem;
        color: #aaa;
    }
    .swiper-block {
        height: calc(100% - 2.5rem);
    }
    .swiper-slide {
        width: 80vw;
        transition: transform ease-in 0.15s;
        opacity: 0.5;
    }
    .swiper-slide-prev, .swiper-slide-next {
        transform: scale(0.85);
    }
    .swiper-slide-active {
        transform: scale(1);
        opacity: 1;
    }
</style>
