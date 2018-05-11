import dayjs from 'dayjs';

const day_ZH_map = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const formatTime = (timestamp)=> {
    let date = dayjs(timestamp);
    let index = date.format('d');
    let day = day_ZH_map[index];
    let dateStr = date.format('YYYY-MM-DD HH:mm');
    return dateStr.slice(0, 11) + ' ' + day + dateStr.slice(11);
};

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
        }
    }
};
