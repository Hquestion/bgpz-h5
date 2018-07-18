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
        border-radius: 100px;
        padding: 3/37.5rem 3/37.5rem;
        font-size: 14/37.5rem;
        min-width: 20/37.5rem;
        min-height: 20/37.5rem;
        background: @red;
        color: @white;
        transition: transform ease .1s;
        &.scale{
            transform: scale(0.5);
        }
    }
</style>
