<template>
    <div class="cart">
        <header>
            <div>已选菜品</div>
            <div class="icon">清空</div>
        </header>
        <div class="cart-body">
            <transition-group>
                <div class="food-item" v-for="(food, index) in data" :key="index">
                    <div class="food-name" v-text="food.name"></div>
                    <number-input v-model="food.count" class="food-count" @plus="onPlus(food)" @minus="onMinus(food)"></number-input>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
    import NumberInput from "./NumberInput";

    export default {
        components: {NumberInput},
        name: "cart",
        props: {
            data: {}
        },
        methods: {
            onPlus(food){
                this.$emit('add-food', food);
            },
            onMinus(food){
                this.$emit('remove-food', food);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .cart {
        height: auto;
        background: @white;
        padding-bottom: 1.5rem;
        header {
            display: flex;
            justify-content: space-between;
            padding: 0.6rem 0.5rem;
            background: @red;
            color: @white;
            font-size: 0.8rem;
        }
        .cart-body {
            background: @white;
            max-height: 60vw;
            overflow: auto;
            .food-item {
                color: #333;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 0.5rem;
                .food-name {
                    flex: 1;
                    width: calc(100% - 5rem);
                }
                .food-count {
                    width: 5rem;
                }
            }
        }

    }
</style>
