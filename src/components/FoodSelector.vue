<template>
    <div class="food-selector">
        <div class="food-thumb">
            <img :src="food.imageUrl">
        </div>
        <div class="food-brief">
            <div class="food-name" v-text="food.name"></div>
            <div class="price-count-box">
                <div class="food-price">￥<span v-text="food.price"></span></div>
                <div class="food-count">
                    <number-input v-model="food.count" @plus.user="onAddToCart" @minus.user="onRemoveFromCart"/>
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
        height: 6rem;
        justify-content: flex-start;
        padding: 0.5rem 0.8rem;
        .food-thumb {
            width: 40%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
                border-radius: @radius;
            }
        }
        .food-brief {
            flex: 1;
            height: 100%;
            padding: 0 0 0 0.5rem;
            .food-name {
                width: 100%;
                height: 60%;
                font-size: 1.2rem;
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
