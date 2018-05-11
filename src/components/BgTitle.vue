<template>
    <div class="bg-title">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BgTitle"
    }
</script>

<style scoped>
    .bg-title {
        width: 100%;
        padding: 0.5rem 0;
        background: url(../assets/image/titlebg2.jpg);
        background-size: 100% 0.5778rem;
        background-position: left center;
        background-repeat: no-repeat;
        text-align: center;
        font-size: 0.4rem;
        color: #E8001F;
    }
</style>
