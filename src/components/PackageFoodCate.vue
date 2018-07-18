<template>
    <div class="package-food-cate">
        <div class="cate-name">
            <img src="../assets/image/shangzi.png">{{foodCate.typeName}}<span>{{foodCate.typeNumber}}道</span>
            <div class="add-btn" @click="addFood(foodCate)">添加{{foodCate.typeName}}</div>
        </div>
        <ul>
            <li v-for="(food, index2) in foodCate.typeList" :key="index2" :class="{active: activeIndex === index2}">
                <div>
                    {{index2 + 1}}、{{food.name}}
                </div>
                <div class="change-btn">
                    <div @click="changeFood(food, index2)">更换<img src="../assets/image/change.png"></div>
                    <div style="margin-left: 0.2667rem" @click="deleteFood(food, index2)"><img src="../assets/image/close.png"></div>
                </div>
            </li>
        </ul>
        <swiper :options="swiperOpt" class="food-swiper" ref="swiper">
            <swiper-slide v-for="(food, index2) in foodCate.typeList" :key="index2">
                <div class="food-poster-item">
                    <img :src="food.imageUrl">
                    <div>
                        <span>{{index2 + 1}}</span>
                        <span>{{food.name}}</span>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
    import {swiper, swiperSlide} from 'vue-awesome-swiper';

    export default {
        name: "PackageFoodCate",
        components: {
            swiper,
            swiperSlide
        },
        props: {
            foodCate: {}
        },
        data() {
            let self = this;
            return {
                activeIndex: 0,
                swiperOpt: {
                    autoplay: true,
                    on: {
                        slideChange(swiper) {
                            self.activeIndex = self.$refs.swiper.swiper.activeIndex;
                        }
                    }
                }
            };
        },
        methods: {
            deleteFood(food, index){
                msgBox.confirm(`确定删除菜品【${food.name}】吗？`).then(res => {
                    this.foodCate.typeList.splice(index, 1);
                    this.$emit('delete-food', food);
                });
            },
            changeFood(food, index){
                this.$emit('change-food', food, index, this.foodCate);
            },
            addFood(cate){
                this.$emit('add-food', cate);
            }
        },
        beforeDestroy(){
            this.$refs.swiper.swiper.destroy(true, true);
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .package-food-cate {
        .cate-name {
            padding: 10/37.5rem 10/37.5rem;
            border-top: 1px solid #efefef;
            border-bottom: 1px solid #efefef;
            position: relative;
            img {
                height: 27/37.5rem;
                vertical-align: middle;
                margin-right: 0.2rem;
            }
            span {
                font-size: 14/37.5rem;
                color: @golden;
                margin-left: 0.2rem;
            }
            .add-btn {
                position: absolute;
                top: 50%;
                right: 0.26667rem;
                transform: translateY(-50%);
                padding: 5px 10px;
                border: 1px solid @red;
                font-size: 0.4rem;
                border-radius: 4px;
                color: @red;
            }
        }
        ul li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10/37.5rem 5/37.5rem 10/37.5rem 20/37.5rem;
            border-bottom: 1px solid #efefef;
            &.active {
                color: @red;
            }
            .change-btn {
                color: @golden;
                font-size: 15/37.5rem;
                padding: 0 10/37.5rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                img {
                    vertical-align: middle;
                    margin-left: 5/37.5rem;
                }
            }
        }
        .food-swiper {
            .food-poster-item {
                position: relative;
                font-size: 0;
                img {
                    width: 100%;
                    height: 6rem;
                }
                div {
                    font-size: 14/37.5rem;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    background: rgba(0, 0, 0, .5);
                    color: #fff;
                    height: 30/37.5rem;
                    line-height: 30/37.5rem;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    span {
                        padding: 10/37.5rem;
                        display: block;
                        &:first-child {
                            background: @red;
                            padding: 0;
                            width: 30/37.5rem;
                            height: 30/37.5rem;
                            text-align: center;
                        }
                    }
                }
            }

        }
    }
</style>
