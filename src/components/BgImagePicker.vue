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
    import md5 from 'js-md5';
    const Base64 = require('js-base64').Base64;
    export default {
        name: "BgImagePicker",
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
                if(this.userPicked.length < 6) {
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
                imgs.slice(0, 6).forEach(item => {
                    ((data) => {
                        this.uploadImg(data).then(res => {
                            this.userPicked.push(res);
                            this.$nextTick(()=>{
                                this.$emit('img-change', this.userPicked);
                            });
                        });
                    })(item);
                });
            },
            uploadImg(file){
                const config = {
                    api:"http://v0.api.upyun.com/",
                    bucket: 'eightplate',
                    //expiration: parseInt((new Date().getTime() + 3600000) / 1000),
                    // 尽量不要使用直接传表单 API 的方式，以防泄露造成安全隐患
                    form_api_secret: 'so3xk7XDcdwfj6rq8T3PvTd6xcc='
                };
                let ext = '.'+file.name.split('.').pop();
                let options = {
                    bucket: config.bucket,
                    expiration: parseInt((new Date().getTime()+3600000)/1000),
                    'save-key': "/html5/party/"+parseInt((new Date().getTime() + Math.random()*10000000)/1000) + ext
                };
                let policy = Base64.encode(JSON.stringify(options));
                let signature = md5(policy + '&' + config.form_api_secret);

                let data = new FormData();
                data.append('policy', policy);
                data.append('signature', signature);
                data.append('file', file);

                let request = new XMLHttpRequest();
                request.open('POST', config.api + options.bucket);
                request.send(data);
                return new Promise((resolve, reject) => {
                    request.onload = function(e) {
                        if (request.status === 200) {
                            let responseData = JSON.parse(request.response);
                            console.log(responseData)
                            let picUrl = "http://eightplate.b0.upaiyun.com" + responseData.url;
                            resolve({
                                img: picUrl,
                                width: responseData['image-width'],
                                height: responseData['image-height']
                            });
                        }else{
                            reject();
                        }
                    };
                    request.onerror = function(e){
                        reject();
                    };
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
