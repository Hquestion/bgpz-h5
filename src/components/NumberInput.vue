<template>
    <div class="number-input-component">
        <transition name="slide">
            <div @click="minus($event)" class="icon icon-minus">
            </div>
        </transition>
        <transition name="slide">
            <div class="count" v-text="count"></div>
        </transition>
        <div @click="plus($event)">
            <div class="icon icon-plus"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "number-input",
        model: {
            prop: 'count',
            event: 'change'
        },
        props: {
            count: Number,
            max: {
                type: Number,
                default: 99999
            },
            min: Number
        },
        data() {
            return {
                numberVal: 0
            };
        },
        methods: {
            minus($event) {
                if(typeof this.min === 'undefined' || this.numberVal > this.min) {
                    this.numberVal--;
                    this.$emit('change', this.numberVal);
                    this.$emit('minus', $event);
                }
            },
            plus($event) {
                if(typeof this.min === 'undefined' || this.numberVal < this.max) {
                    this.numberVal++;
                    this.$emit('change', this.numberVal);
                    this.$emit('plus', $event);
                }
            }
        },
        updated(){
            this.$nextTick(()=>{
                this.numberVal = this.count;
            });
        },
        mounted(){
            this.numberVal = this.count;
        }
    }
</script>

<style scoped>
    .number-input-component {
        display: flex;
        align-items: center;
        justify-items: flex-end;
        width: 100%;
        text-align: center;
        font-size: 0.45rem;
    }
    .number-input-component .count {
        flex: 1;
        width: 1rem;
        font-size: 0.48rem;
    }
    .number-input-component .icon {
        width: 0.8rem;
        height: 0.8rem;
        background-size: 100% 100%;
    }
    .number-input-component .icon.icon-minus {
        background-image: url(../assets/image/jianhao.jpg);
    }
    .number-input-component .icon.icon-plus {
        background-image: url(../assets/image/jiahao.jpg);
    }
    .slide-enter-active, .slide-leave-active {
        transition: all ease 0.3s;
    }
    .slide-enter, .slide-leave-to {
        transform: translateX(3.6rem) rotate(60deg);
        opacity: 0.2;
    }
</style>
