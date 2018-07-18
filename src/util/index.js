/**
 * 通用的一些函数/接口等，也可以根据业务做一些服务
 */
import dayjs from 'dayjs';

const day_ZH_map = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/**
 * 对请求参数进行序列化处理，适配http://api.bagepanzi.com接口
 * @param data
 * @returns {string}
 */
export function serializeData(data) {
    // If this is not an object, defer to native stringification.
    if (typeof data !== 'object' ) {
        return((data == null) ? '' : data.toString());
    }
    let buffer = [];
    // Serialize each key in the object.
    for ( let name in data ) {
        if (!data.hasOwnProperty(name)) {
            continue;
        }
        let value = data[name];
        value = typeof value === 'undefined' ? '' : value;
        if(typeof value === 'object') {
            value = JSON.stringify(value);
        }
        buffer.push(
            encodeURIComponent( name ) + '=' + encodeURIComponent( ( value === null ) ? '' : value )
        );
    }
    // Serialize the buffer and clean it up for transportation.
    let source = buffer.join( '&' ).replace( /%20/g, '+' );
    return( source );
}

export function fillZero(number){
    return +number < 10 ? ('0' + +number) : ('' + number);
}

export function range(start, end, step = 1){
    let res = [];
    for(;start <= end; start += step) {
        res.push(start);
    }
    return res;
}

export function getMonthDays(year,month){
    let now = new Date(year,month, 0);
    return now.getDate();
}

export function formatTime(timestamp){
    let date = dayjs(timestamp);
    let index = date.format('d');
    let day = day_ZH_map[index];
    let dateStr = date.format('YYYY-MM-DD HH:mm');
    return dateStr.slice(0, 11) + ' ' + day + dateStr.slice(11);
}

export function parseQueryString(){
    let search = window.location.search.slice(1);
    if(search.length > 0) {
        let result = {};
        let searchArray = search.split('&');
        searchArray.map(item => {
            let keyValArray = item.split('=');
            result[keyValArray[0]] = keyValArray[1];
        });
        return result;
    }else {
        return {};
    }
}
