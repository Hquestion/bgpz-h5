<template>
    <div class="food-selector">
        <div class="food-thumb">
            <img v-lazy="food.imageUrl">
        </div>
        <div class="food-brief">
            <div class="food-name" v-text="food.name"></div>
            <div class="price-count-box">
                <div class="food-price">￥<span v-text="food.price"></span></div>
                <div class="food-count">
                    <number-input v-model="food.count" @plus.user="onAddToCart" @minus.user="onRemoveFromCart" :min="0"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import NumberInput from './NumberInput';
    export default {
        name: "food-selector",
        components: {
            NumberInput
        },
        props: {
            food: {}
        },
        methods: {
            onAddToCart(e) {
                this.$emit('add-to-cart', this.$el, e, this.food);
            },
            onRemoveFromCart(e) {
                this.$emit('remove-from-cart', this.$el, e, this.food);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .food-selector {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        padding: 10/37.5rem 15/37.5rem;
        .food-thumb {
            width: 100%;
            height: 3.7rem;
            text-align: center;
            img {
                border-radius: @radius;
                max-width: 100%;
                max-height: 100%;
                vertical-align: middle;
            }
        }
        .food-brief {
            flex: 1;
            height: 100%;
            padding: 10/37.5rem 0;
            .food-name {
                width: 100%;
                height: 60%;
                font-size: 16/37.5rem;
            }
            .price-count-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .food-price {
                    color: @red;
                    flex: 1;
                }
            }
        }
    }
</style>
