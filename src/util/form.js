export default {
    validate(list) {
        let isPass = true;
        for(let index = 0; index < list.length; index ++) {
            let item = list[index];
            let result = this._doValidate(item.method, item.message, item.param);
            if(!result) {
                isPass = false;
                break;
            }
        }
        return isPass;
    },
    _doValidate(method, message, args){
        let isPass = this[method].call(this, ...args);
        if(isPass) {
            return true;
        }else {
            window.commonToast({
                message: message,
                position: 'bottom'
            });
            return false;
        }
    },
    isNotEmpty(value){
        if(typeof value === 'number') {
            return value !== 0;
        }else if(typeof value === 'string') {
            return value.trim() !== '';
        } else if(typeof value === 'object') {
            if(null === value) {
                return false;
            }
            if(value instanceof Array) {
                return value.length > 0;
            } else {
                return Object.keys(value).length > 0;
            }
        }
    },
    isAfterTime(value){
        if(!value) {
            return false;
        }else {
            let d, now = new Date();
            if(typeof value === 'number') {
                d = new Date(value * 1000);
            }else if(typeof value === 'string') {
                d = new Date(value);
            }
            return +now - d < 0;
        }
    },
    isMatchLength(value, min, max){
        if(typeof value === 'string') {
            return value.length >= min && value.length <= max;
        }else if(value instanceof Array) {
            return value.length >= min && value.length <= max;
        }
    }
};
