/**
 * 通用的一些函数/接口等，也可以根据业务做一些服务
 */
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
        value = value || '';
        if(typeof value === 'object') {
            value = JSON.stringify(value);
        }
        buffer.push(
            encodeURIComponent( name ) + '=' + encodeURIComponent( ( value == null ) ? '' : value )
        );
    }
    // Serialize the buffer and clean it up for transportation.
    let source = buffer.join( '&' ).replace( /%20/g, '+' );
    return( source );
}

export function fillZero(number){
    return +number < 10 ? ('0' + +number) : ('' + number);
}
