<template>
    <div class="main" :class="{'share-visible': shareTipVisible}">
        <div class="share-tip">
            <div class="tip-text">点击右上角按钮，然后在弹出的菜单中，点击分享到朋友圈，即可分享。</div>
            <div class="share-indicator">
                <img src="./assets/image/share-arrow.jpg"/>
            </div>
        </div>
        <transition>
            <!--<navigation>-->
                <router-view class="view-container"></router-view>
            <!--</navigation>-->
        </transition>
    </div>
</template>

<script>
    export default {
        name: "app",
        data() {
            return {
                shareTipVisible: false
            }
        },
        created() {
            let self = this;
            let hideTimer = null;
            window.EventBus.$on('share-visible', function(val){
                self.shareTipVisible = val;
                if(val) {
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(()=>{
                        self.shareTipVisible = false;
                    }, 5000);
                }
            });
        }
    }
</script>

<style lang="less" scoped>
    .main {
        font-size: 0.45rem;
        background: #f2f2f2;
        min-height: 100vh;
        position: relative;
        .view-container {
            position: relative;
            top: 0;
            max-height: 100vh;
            overflow: auto;
            transition: top ease-in .5s;
        }
        .share-tip {
            position: absolute;
            left: 0;
            top: 0;
            background: #272727;
            font-size: 14/37.5rem;
            color: #dedede;
            text-align: center;
            width: 100%;
            height: 80/37.5rem;
            transition: transform ease-in .5s;
            transform: translateY(-100%);
            padding-top: 20/37.5rem;
            display: flex;
            justify-content: flex-start;
            .tip-text {
                text-align: left;
                flex: 1;
                padding: 0 30/37.5rem;
            }
            .share-indicator {
                width: 26/37.5rem;
                height: 36.5/37.5rem;
                position: absolute;
                top: 5/37.5rem;
                right: 5/37.5rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        &.share-visible {
            .share-tip {
                transform: translateY(0);
            }
            .view-container {
                top: 80/37.5rem;
            }
        }
    }
</style>
