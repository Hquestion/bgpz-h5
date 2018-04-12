<template>
    <div class="bg-popup">
        <transition name="fade">
            <v-touch class="mask" v-show="visible" @tap="hide"></v-touch>
        </transition>
        <transition name="slide">
            <div class="bg-popup-content" v-show="visible">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "bg-popup",
        props: {
            visible: {
                default: false
            }
        },
        model: {
            prop: 'visible',
            event: 'change'
        },
        methods: {
            hide(){
                this.$emit('change', false);
            }
        },
        watch: {
            visible: function(val){
                if(val) {
                    this.$el.classList.add('visible');
                }else {
                    setTimeout(()=>{
                        this.$el.classList.remove('visible');
                    }, 250);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .bg-popup {
        position: relative;
        overflow: hidden;
        display: none;
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #000;
            z-index: 10;
            opacity: 0.5;
        }
        .bg-popup-content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: auto;
            min-height: 6rem;
            background: #fff;
            z-index: 11;
        }
        &.visible {
            display: block;
            .fade-enter-active, .fade-leave-active{
                transition: all linear .2s;
            }
            .fade-enter-to, .fade-leave {
                opacity: 0.5;
            }
            .fade-enter, .fade-leave-to {
                opacity: 0;
            }
            .slide-enter-active, .slide-leave-active{
                transition: all linear .2s;
            }
            .slide-enter-to, .slide-leave {
                transform: translate3d(0,0,0);
            }
            .slide-enter, .slide-leave-to {
                transform: translate3d(0,100%,0);
            }
        }
    }
</style>
