<template>
    <div class="ball-container">
        <transition-group tag="div" @before-enter='beforeEnter' @enter='enter' @after-enter='afterEnter'>
            <div class="ball" v-for="(item, index) in balls" :key="index" v-show="item.show">
                <div class="inner inner-hook">
                </div>
            </div>
        </transition-group>
        <transition @after-enter="removeAfterEnter" name="remove">
            <div class="remove-ball" v-show="removeShow"></div>
        </transition>
    </div>
</template>

<script>
    import {clearNode} from "../util/dom";

    export default {
        name: "cart-balls",
        data () {
            return {
                balls: [
                    {show: false},
                    {show: false},
                    {show: false}
                ],
                dropBalls: [],
                removeShow: false
            }
        },
        methods: {
            drop (target, e) {
                let animateIndex = 0;
                let self = this;
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = target;
                        ball.event = e;
                        this.dropBalls.push(ball);
                        animateIndex = i;
                        break;
                    }
                }
                return new Promise((resolve, reject) => {
                    function doResolve(){
                        resolve();
                        self.$el.querySelectorAll('.ball')[animateIndex].removeEventListener('transitionend', doResolve);
                    }
                    self.$el.querySelectorAll('.ball')[animateIndex].addEventListener('transitionend', doResolve);
                });
            },
            remove(el, e){
                this.removeShow = true;
                let $img = el.querySelector('img');
                let $cloneImg = $img.cloneNode();
                let $removeBox = this.$el.querySelector('.remove-ball');
                clearNode($removeBox);
                $removeBox.appendChild($cloneImg);
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, 500);
                });
            },
            beforeEnter (el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect();// 获取小球的相对于视口的位移(小球高度)
                        let $img = ball.el.querySelector('img');
                        let $cloneImg = $img.cloneNode();
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        clearNode(inner);
                        inner.appendChild($cloneImg);
                        let x = ball.event.center.x - 7 * window.rootFontSize;
                        let y = ball.event.center.y - window.innerHeight + 2.3 * window.rootFontSize;// 负数是从左上角往下的的方向, 正数是往上
                        el.style.display = ''; // 清空display
                        el.style.opacity = '0.9';
                        el.style.webkitTransform = `translate3d(0, ${y}px, 0) scale(1.2)`;
                        el.style.transform = `translate3d(0, ${y}px, 0) scale(1.2)`;
                        // 处理内层动画
                         // 使用inner-hook类来单纯被js操作
                        inner.style.webkitTransform = `translate3d(${x}px, 0, 0) scale(1.2)`;
                        inner.style.transform = `translate3d(${x}px, 0, 0) scale(1.2)`;
                    }
                }
            },
            enter (el, done) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight // 触发重绘html
                this.$nextTick(() => {
                    // 让动画效果异步执行,提高性能
                    el.style.opacity = '0.5';
                    el.style.webkitTransform = 'translate3d(0, 0, 0) scale(0.8)'
                    el.style.transform = 'translate3d(0, 0, 0) scale(0.8)'
                    // 处理内层动画
                    let inner = el.getElementsByClassName('inner-hook')[0] // 使用inner-hook类来单纯被js操作
                    inner.style.webkitTransform = 'translate3d(0, 0, 0) scale(0.8)'
                    inner.style.transform = 'translate3d(0, 0, 0) scale(0.8)'
                    el.addEventListener('transitionend', done) // Vue为了知道过渡的完成，必须设置相应的事件监听器。
                })
            },
            afterEnter (el) {
                let ball = this.dropBalls.shift();// 完成一次动画就删除一个dropBalls的小球
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none'; // 隐藏小球
                }
            },
            removeBeforeEnter(el){

            },
            removeAfterEnter(el) {
                this.removeShow = false;
            }
        }
    }
</script>

<style lang="less">
    @import '../assets/less/variable';
    .ball-container {
        .ball {
            &.v-enter-active {
                 /* 可以在上面的工具里跳出自己想要的曲线，调整参数 */
                 transition: all .4s cubic-bezier(0.52,0.10,0.90,0.27);
             }
            .inner {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: @red;
                transition: all .4s linear;
                text-align: center;
                line-height: 30px;
                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                }
            }
        }
        .remove-ball {
            background: @white;
            width: 30px;
            height: 30px;
            border-radius: 30px;
            &.remove-enter-active {
                transition: all ease .5s;
            }
            &.remove-enter {
                transform: translate3d(-15px,-15px,0);
                opacity: 0.8;
            }
            &.remove-enter-to {
                transform: translate3d(-15px,-120px,0);
                opacity: 0;
            }
            &.remove-leave, &.remove-leave-to {
                transform: translate3d(-15px,-15px,0);
                opacity: 0;
            }
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
</style>
