import md5 from 'js-md5';
const Base64 = require('js-base64').Base64;
export default {
    methods: {
        uploadImg(file){
            const config = {
                api:'http://v0.api.upyun.com/',
                bucket: 'eightplate',
                //expiration: parseInt((new Date().getTime() + 3600000) / 1000),
                // 尽量不要使用直接传表单 API 的方式，以防泄露造成安全隐患
                form_api_secret: 'so3xk7XDcdwfj6rq8T3PvTd6xcc='
            };
            let ext = '.'+file.name.split('.').pop();
            let options = {
                bucket: config.bucket,
                expiration: parseInt((new Date().getTime()+3600000)/1000),
                'save-key': '/html5/party/'+parseInt((new Date().getTime() + Math.random()*10000000)/1000) + ext
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
                request.onload = function() {
                    if (request.status === 200) {
                        let responseData = JSON.parse(request.response);
                        let picUrl = 'http://eightplate.b0.upaiyun.com' + responseData.url;
                        resolve({
                            img: picUrl,
                            width: responseData['image-width'],
                            height: responseData['image-height']
                        });
                    }else{
                        reject();
                    }
                };
                request.onerror = function(){
                    reject();
                };
            });
        }
    }
};
