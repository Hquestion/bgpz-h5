<template>
    <div class="bg-tab">
        <div class="slider"></div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        componentName: 'BgTab',
        name: "bg-tab",
        props: {
            direction: {},
            selected: {}
        },
        model: {
            prop: 'selected',
            event: 'tab-change'
        },
        methods: {
            initSlider(){
                let tabItems = this.$children;
                let tabIds = tabItems.map(item => item.id);
                if(typeof this.selected !== 'undefined') {
                    let index = tabIds.findIndex(item => item === this.selected);
                    let offsetTop = 0;
                    if(index >= 0) {
                        let tabHeight = tabItems[index].$el.getBoundingClientRect().height;
                        for(let j = 0; j < index; j++) {
                            offsetTop += tabItems[j].$el.getBoundingClientRect().height;
                        }
                        setTimeout(() => {
                            let $slider = this.$el.querySelector('.slider');
                            $slider.style.height = `${tabHeight}px`;
                            $slider.style.transform = `translate3d(0, ${offsetTop}px, 0)`;
                        }, 50);
                    }
                }
            }
        },
        watch: {
            'selected': function() {
                this.$nextTick(()=>{
                    this.initSlider();
                });
            }
        },
        mounted(){
            this.$on('bg-tab-switch', function(e){
                this.$emit('tab-change', e);
            });

            this.initSlider();
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .bg-tab {
        width: 100%;
        height: 100%;
        position: relative;
        .slider {
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            background: @red;
            transition: all ease .2s;
        }
    }
</style>
