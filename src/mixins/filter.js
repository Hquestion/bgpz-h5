import dayjs from 'dayjs';
import {formatTime} from '../util';

export default {
    methods: {
        formatTime(timestamp){
            return formatTime(timestamp);
        }
    },
    filters: {
        dateFormat(timestamp, ratio){
            if(!timestamp) {
                return '';
            }
            if(ratio === 'sec') {
                timestamp = timestamp * 1000;
            }
            return formatTime(timestamp);
        },
        formatTimeShort(timestamp, ratio){
            if(!timestamp) {
                return '';
            }
            if(ratio === 'sec') {
                timestamp = timestamp * 1000;
            }
            let time = dayjs(timestamp);
            let now = dayjs();
            let reg = 'M月D日 HH:mm';
            if(time.$y !== now.$y) {
                reg = 'YYYY年M月D日 HH:mm';
            }
            return time.format(reg);
        }
    }
};
