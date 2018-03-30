/**
 * mint ui 补丁
 * 解决require文件不存在，导致编译报错的bug
 * 先运行npm install，再运行npm run patch命令
 */
const fs = require('fs');
const path = require('path');

const problemFiles = [
    'node_modules/mint-ui/packages/font/style.css',
    'node_modules/mint-ui/packages/picker/style.css',
    'node_modules/mint-ui/packages/popup/style.css',
    'node_modules/mint-ui/packages/cell/style.css',
    'node_modules/mint-ui/packages/spinner/style.css'
];

if(!fs.existsSync(path.join(__dirname, 'node_modules/mint-ui'))) {
    console.warn('必须先安装Mint-UI。运行npm i mint-ui -S');
    return;
}
problemFiles.forEach(item => {
    let splitPath = item.split('/');
    let patchPath = path.join(__dirname, splitPath.slice(0, -1).join('/') + '/');
    let patchFileName = path.join(__dirname, item);
    console.log(patchFileName);
    if(!fs.existsSync(patchPath)) {
        fs.mkdir(patchPath, function(err){
            if(err) {
                console.error(err);
                console.warn('创建路径失败！');
                return;
            }
            fs.createWriteStream(patchFileName);
            console.info('补丁添加成功');
        });
    }else {
        if(!fs.existsSync(patchFileName)) {
            fs.createWriteStream(patchFileName);
        }
        console.info('补丁添加成功');
    }
});
