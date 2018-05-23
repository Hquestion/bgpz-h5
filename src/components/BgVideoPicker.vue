<template>
    <div class="bg-video-picker">
        <div class="bg-video-picked" v-for="(img, index) in pickedImgs" :key="index">
            <video :src="img.img"></video>
            <div class="del-btn" @click="delImg(index)">
                <img src="../assets/image/delete-icon.png">
            </div>
        </div>
        <div class="bg-video-picker-holder">
            <img src="../assets/image/upload.png">
            <input type="file" accept="video/mp4" @change="onPickImg" @click="beforePickImg">
        </div>
    </div>
</template>

<script>
    import {Indicator, Toast} from 'mint-ui';
    import uploadImg from '../mixins/uploadImg';
    export default {
        name: "BgVideoPicker",
        mixins: [uploadImg],
        props: {
            pickedImgs: {
                default() {
                    return [];
                }
            }
        },
        model: {
            prop: 'pickedImgs',
            event: 'img-change'
        },
        data() {
            return {
                userPicked: []
            }
        },
        methods: {
            beforePickImg(e) {
                if (this.userPicked.length < 1) {
                    // 低于6张时允许上传

                } else {
                    e.preventDefault();
                }
            },
            delImg(index) {
                if (index >= 0) {
                    this.userPicked.splice(index, 1);
                    this.$nextTick(() => {
                        this.$emit('img-change', this.userPicked);
                    });
                }
            },
            onPickImg(e) {
                let imgs = Array.from(e.target.files);
                if(e.target.files[0].size > 5 * 1024 * 1024) {
                    Toast({
                        message: '视频文件过大',
                        position: 'bottom'
                    });
                    return;
                }
                let loaded = 0;
                if(imgs.length > 0) {
                    Indicator.open({
                        text: '正在上传视频...',
                        spinnerType: 'fading-circle'
                    });
                }
                imgs.slice(0).forEach(item => {
                    ((data) => {
                        this.uploadImg(data).then(res => {
                            loaded++;
                            this.userPicked.push(res);
                            this.$nextTick(() => {
                                this.$emit('img-change', this.userPicked);
                            });
                            if (loaded === imgs.slice(0).length) {
                                Indicator.close();
                            }
                        }, () => {
                            loaded++;
                            if (loaded === imgs.slice(0).length) {
                                Indicator.close();
                            }
                        });
                    })(item);
                });
            }
        },
        wacth: {
            pickedImgs(val) {
                this.userPicked = val;
            }
        },
        mounted() {
            this.userPicked = this.pickedImgs;
        }
    }
</script>

<style lang="less" scoped>
    .bg-video-picker {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        & > div {
            width: 100%;
            height: auto;
            margin-top: 0.2rem;
            &.bg-video-picked {
                position: relative;
                margin-right: 0.2rem;
                &:nth-child(4n + 4) {
                    margin-right: 0;
                }
                video {
                    width: 100%;
                    height: auto;
                }
                .del-btn {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 20/37.5rem;
                    height: 20/37.5rem;
                    background: #fff;
                    border-radius: 20/37.5rem;
                    img {
                        width: 20/37.5rem;
                        height: 20/37.5rem;
                    }
                }
            }
            &.bg-video-picker-holder {
                position: relative;
                input {
                    position: absolute;
                    left: 0;
                    top: 0;
                    opacity: 0;
                    width: 80/37.5rem;
                    height: 80/37.5rem;
                }
            }
        }
    }
</style>
