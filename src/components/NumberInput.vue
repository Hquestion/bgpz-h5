<template>
    <div class="number-input-component">
        <transition name="slide">
            <v-touch @tap="minus($event)" v-show="count > 0" class="icon icon-minus">
            </v-touch>
        </transition>
        <transition name="slide">
            <div class="count" v-text="count" v-show="count > 0"></div>
        </transition>
        <v-touch @tap="plus($event)">
            <div class="icon icon-plus"></div>
        </v-touch>
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
            count: Number
        },
        data() {
            return {
                numberVal: 0
            }
        },
        methods: {
            minus($event) {
                this.numberVal--;
                this.$emit('change', this.numberVal);
                this.$emit('minus', $event);
            },
            plus($event) {
                this.numberVal++;
                this.$emit('change', this.numberVal);
                this.$emit('plus', $event);
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
        justify-items: flex-start;
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
