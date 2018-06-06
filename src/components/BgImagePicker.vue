<template>
    <div class="bg-image-picker">
        <div class="bg-image-picked" v-for="(img, index) in pickedImgs" :key="index">
            <img :src="img.img">
            <div class="del-btn" @click="delImg(index)">
                <img src="../assets/image/delete-icon.png">
            </div>
        </div>
        <div class="bg-image-picker-holder">
            <img src="../assets/image/upload.png">
            <input type="file" accept="image/*" multiple @change="onPickImg" @click="beforePickImg">
        </div>
    </div>
</template>

<script>
    import { Indicator, Toast } from 'mint-ui';
    import uploadImg from '../mixins/uploadImg';
    const indicate = Indicator;
    const t = Toast;
    export default {
        name: "BgImagePicker",
        mixins: [uploadImg],
        props: {
            pickedImgs: {
                default(){
                    return [];
                }
            }
        },
        model: {
            prop: 'pickedImgs',
            event: 'img-change'
        },
        data(){
            return {
                userPicked: []
            }
        },
        methods: {
            beforePickImg(e){
                if(this.userPicked.length < 100) {
                    // 低于6张时允许上传

                }else {
                    e.preventDefault();
                }
            },
            delImg(index){
                if(index >= 0) {
                    this.userPicked.splice(index, 1);
                    this.$nextTick(()=>{
                        this.$emit('img-change', this.userPicked);
                    });
                }
            },
            onPickImg(e){
                let imgs = Array.from(e.target.files);
                if(imgs.length === 0) {
                    return;
                }
                let loaded = 0;
                indicate.open({
                    text: '正在上传图片...',
                    spinnerType: 'fading-circle'
                });
                let uploadedImgs = [];
                imgs.slice(0).forEach((item, index) => {
                    ((data, i) => {
                        this.uploadImg(data).then(res => {
                            loaded++;
                            uploadedImgs.push({
                                data: res,
                                index: i
                            });
                            if(loaded === imgs.slice(0).length) {
                                indicate.close();
                                let sortImgs = uploadedImgs.sort((a, b) => a.index - b.index).map(item => item.data);
                                this.userPicked = [...this.userPicked, ...sortImgs];
                                this.$nextTick(()=>{
                                    this.$emit('img-change', this.userPicked);
                                });
                            }
                        }, ()=>{
                            loaded++;
                            if(loaded === imgs.slice(0).length) {
                                indicate.close();
                                let sortImgs = uploadedImgs.sort((a, b) => a.index - b.index).map(item => item.data);
                                this.userPicked = [...this.userPicked, ...sortImgs];
                                this.$nextTick(()=>{
                                    this.$emit('img-change', this.userPicked);
                                });
                            }
                        });
                    })(item, index);
                });
            }
        },
        wacth: {
            pickedImgs(val){
                this.userPicked = val;
            }
        },
        mounted(){
            this.userPicked = this.pickedImgs;
        }
    }
</script>

<style lang="less" scoped>
    .bg-image-picker {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        & > div {
            width: 80/37.5rem;
            height: 80/37.5rem;
            margin-top: 0.2rem;
            &.bg-image-picked {
                position: relative;
                margin-right: 0.2rem;
                &:nth-child(4n + 4){
                    margin-right: 0;
                }
                img {
                    width: 80/37.5rem;
                    height: 80/37.5rem;
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
            &.bg-image-picker-holder {
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
