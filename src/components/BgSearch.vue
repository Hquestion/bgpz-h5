<template>
    <form class="bg-search" @submit="onSearch">
        <div class="bg-search-box">
            <input type="search" v-model="key" :placeholder="placeholder" @input="onInput" ref="input"/>
            <v-touch class="search-icon" @tap="onSearch">
                <img src="../assets/image/search.png">
            </v-touch>
        </div>
    </form>
</template>

<script>
    export default {
        name: "BgSearch",
        data(){
            return {
                key: ''
            };
        },
        model: {
            props: 'value',
            event: 'key-change'
        },
        props: {
            placeholder: {
                default: '请输入关键字搜索'
            },
            value: {}
        },
        methods: {
            onInput(e){
                this.$emit('key-change', this.key);
            },
            onSearch(e){
                e.preventDefault && e.preventDefault();
                this.$emit('search', this.key);
                this.$refs.input.blur();
            }
        }
    }
</script>

<style lang="less" scoped>
    .bg-search {
        width: 100%;
        .bg-search-box {
            width: 100%;
            height: 40/37.5rem;
            line-height: 40/37.5rem;
            border: 1px solid #dedede;
            border-radius: 40/37.5rem;
            display: flex;
            align-items: center;
            input {
                margin-left: 20/37.5rem;
                width: calc(100% - 1.3333rem);
                height: 36/37.5rem;
                margin-top: 1/37.5rem;
                border: none;
                outline: none;
                flex: 1;
                font-size: 0.45rem;
            }
            input::-webkit-search-decoration,
            input::-webkit-search-cancel-button {
                display: none;
            }
            .search-icon {
                width: 0.8rem;
                display: flex;
                align-items: center;
                img {
                    width: 0.45rem;
                }
            }
        }
    }
</style>
