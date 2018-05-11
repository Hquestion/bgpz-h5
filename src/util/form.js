import {Toast} from 'mint-ui';
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
            Toast({
                message: message,
                position: 'bottom'
            });
            return false;
        }
    },
    isNotEmpty(value){
        if(typeof value === 'string') {
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
    isMatchLength(value, min, max){
        if(typeof value === 'string') {
            return value.length >= min && value.length <= max;
        }else if(value instanceof Array) {
            return value.length >= min && value.length <= max;
        }
    }
};
