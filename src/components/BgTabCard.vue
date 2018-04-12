<template>
    <div class="bg-tab-card" :class="{active: isActive}">
        <v-touch @tap="onTap">
            <slot></slot>
        </v-touch>
    </div>
</template>

<script>
    import event from '../mixins/event';
    export default {
        name: "bg-tab-card",
        mixins: [event],
        props: {
            id: {}
        },
        computed: {
            isActive() {
                return this.$parent.selected === this.id;
            }
        },
        methods: {
            onTap(){
                this.emit('BgTab', 'bg-tab-switch', this.id);
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .bg-tab-card {
        width: 100%;
        height: auto;
        padding: 0.5rem;
        background: @light;
        color: @dark;
        border-bottom: 1px solid #e2e2e2;
        &.active {
            background: @white;
        }
    }
</style>
