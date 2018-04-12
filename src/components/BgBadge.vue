<template>
    <div class="bg-badge">
        {{number}}
    </div>
</template>

<script>
    export default {
        name: "bg-badge",
        props: {
            number: {}
        },
        watch: {
            'number': function(val){
                this.$el.classList.add('scale');
                setTimeout(()=>{
                    this.$el.classList.remove('scale');
                }, 100);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .bg-badge {
        transform: scale(1);
        width: auto;
        height: auto;
        text-align: center;
        line-height: 1;
        border-radius: 20px;
        padding: 0.3rem 0.2rem;
        font-size: 0.6rem;
        min-width: 1.2rem;
        min-height: 1.2rem;
        background: @red;
        color: @white;
        transition: transform ease .1s;
        &.scale{
            transform: scale(0.5);
        }
    }
</style>
