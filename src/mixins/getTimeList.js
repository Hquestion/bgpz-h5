const minSec = 21600;
import {fillZero} from '../util';

export default {
    methods: {
        getTimeInfo(timeList) {
            timeList = timeList || ['12:00', '12:30', '13:00', '18:00', '18:30', '19:00'];
            let startTime = new Date();
            let nowDateStr = startTime.getFullYear() + '/' + (startTime.getMonth() + 1) + '/' + startTime.getDate();
            let minStartTime = new Date(+startTime + minSec * 1000);
            let maxEndTime = new Date('2018/07/28 00:00:00');
            let startValueIndex = -1;
            for(let i = 0; i < timeList.length; i++) {
                if(new Date(nowDateStr + ' ' + timeList[i]) > minStartTime) {
                    startValueIndex = i;
                    break;
                }
            }
            let realStartTime;
            if(startValueIndex >= 0) {
                realStartTime = new Date(nowDateStr + ' ' + timeList[startValueIndex]);
            }else {
                realStartTime = new Date(startTime.setDate(startTime.getDate() + 1));
            }
            let result = [];
            for(let date = +realStartTime; date < +maxEndTime;) {
                let c_date = new Date(date);
                let c_date_str = c_date.getFullYear() + '/' + (c_date.getMonth() + 1) + '/' + c_date.getDate();
                let renderTimeList;
                if(startValueIndex >= 0) {
                    renderTimeList = timeList.slice(startValueIndex);
                    startValueIndex = -1;
                } else {
                    renderTimeList = timeList;
                }
                for(let i = 0; i < renderTimeList.length ; i++) {
                    let orderTime = new Date(c_date_str + ' ' + renderTimeList[i]);
                    result.push(orderTime);
                }
                date += 24 * 60 * 60 * 1000;
            }
            let map = {};
            for(let index = 0; index < result.length; index++) {
                let d = result[index];
                let month = d.getMonth() + 1;
                let day = d.getDate();
                let hour = d.getHours();
                let minute = d.getMinutes();
                let monthCode = fillZero(month);
                let dayCode = monthCode + fillZero(day);
                let minuteCode = dayCode + hour + fillZero(minute);
                map[month] = map[month] || [];
                let existDayIndex = map[month].findIndex((item) => {
                    return item.code === dayCode;
                });
                if(existDayIndex >= 0) {
                    let dayMap = map[month][existDayIndex];
                    dayMap.sub.push({
                        code: minuteCode,
                        name: (hour === 12 ? '午餐': '晚餐') + '--' + hour + ':' + fillZero(minute)
                    });
                } else {
                    let dayMap = {
                        code: dayCode,
                        name: day + '日',
                        sub: [{
                            code: minuteCode,
                            name: (hour === 12 ? '午餐': '晚餐') + '--' + hour + ':' + fillZero(minute)
                        }]
                    };
                    map[month].push(dayMap);
                }
            }
            let list = [];
            for(let key in map) {
                list.push({
                    code: key < 0 ? ('0' + key) : (key + ''),
                    name: key + '月',
                    sub: map[key]
                });
            }
            return list;
        }
    }
};
