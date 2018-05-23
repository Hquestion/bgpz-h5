<template>
    <div class="comment-card">
        <div class="card-header">
            <bg-avatar :src="data.avatar" width="0.53rem"></bg-avatar>
            <div class="card-user-name" v-text="data.nickname"></div>
            <div class="card-comment-date">{{data.cmt_time | formatTimeShort('sec')}}</div>
        </div>
        <div class="card-body">
            {{data.cmt_content}}
        </div>
    </div>
</template>

<script>
    import filter from '../mixins/filter';
    import BgAvatar from "./BgAvatar";
    export default {
        name: "CommentCard",
        mixins: [filter],
        components: {BgAvatar},
        props: {
            data: {}
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/less/variable";
    .comment-card {
        padding: 10/37.5rem;
        border-bottom: 1px solid #dedede;
        .card-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 12/37.5rem;
            .card-user-name {
                flex: 1;
                font-size: 16/37.5rem;
                font-weight: bold;
            }
            .card-comment-date {
                color: @text-grey;
            }
        }
        .card-body {
            font-size: 14/37.5rem;
            text-align: left;
            padding: 10/37.5rem 10/37.5rem 0 10/37.5rem;
        }
    }
</style>
