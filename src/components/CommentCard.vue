<template>
    <div class="comment-card">
        <div class="card-header">
            <bg-avatar :src="data.avatar" width="0.53rem"></bg-avatar>
            <div class="card-user-name" v-text="showNickName"></div>
            <div class="card-comment-date">
                {{data.cmt_time | formatTimeShort('sec')}}
                <span style="margin-left: 10px" v-show="isCurrentUser" @click="deleteComment">删除</span>
            </div>
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
            data: {},
            index: {}
        },
        computed: {
            showNickName(){
                return this.data.nickname.slice(0, 1) + this.data.nickname.slice(1).replace(/./g, '*');
            },
            isCurrentUser(){
                return this.data.uid + '' === '' + window.localStorage.getItem('openid');
            }
        },
        methods: {
            deleteComment(){
                this.$emit('delete', this.data.id, this.index);
            }
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
            font-size: 0.4rem;
            text-align: left;
            padding: 10/37.5rem 10/37.5rem 0 10/37.5rem;
        }
    }
</style>
