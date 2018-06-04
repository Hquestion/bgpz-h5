import dayjs from 'dayjs';
import {range, getMonthDays} from '../util';

export default {
    methods: {
        generateTimeSlots(defaultVal){
            let startDate = dayjs().add(+this.config.minOrderTimeToStartTime, 'second');
            let lastEndTime = dayjs();
            let timeList = this.config.timeList;
            let time = timeList[timeList.length -1].value.split(':');
            lastEndTime = lastEndTime.set('hour', +(time[0])).set('minute', +(time[1]));
            if(lastEndTime < startDate) {
                startDate = startDate.add(1, 'day');
            }
            let endDate = dayjs().add(+this.config.maxOrderTimeToStartTime, 'second');
            let yearList = range(startDate.$y, endDate.$y);
            let monthList = range(startDate.$M + 1, endDate.$M + 1);
            let dayList = range(1, Math.max(getMonthDays(startDate.$y, startDate.$M + 1, 0), getMonthDays(endDate.$y, endDate.$M + 1, 0)));
            if(monthList.length === 1) {
                dayList = range(startDate.$D, endDate.$D);
            }
            let defaultYearIndex = 0, defaultMonthIndex = 0, defaultDayIndex = 0, defaultTimeIndex = 0;
            defaultDayIndex = dayList.findIndex(item => item === startDate.$D);
            for(let i = 0; i < timeList.length; i++) {
                let value = timeList[i].value.split(':');
                let startDay = startDate.set('hour', 0).set('minute', 0).set('second', 0);
                let realStartTime = startDay.set('hour', +value[0]).set('minute', +value[1]);
                if(realStartTime >= startDate) {
                    defaultTimeIndex = i;
                    break;
                }
            }
            return [
                {values: yearList.map(item => `${item}年`), flex: 1, defaultIndex: defaultYearIndex},
                {values: monthList.map(item => `${item}月`), flex:1, defaultIndex: defaultMonthIndex},
                {values: dayList.map(item => `${item}日`), flex: 1, defaultIndex: defaultDayIndex},
                {values: this.config.timeList.map(item => item.value), flex: 1, defaultIndex: defaultTimeIndex}
            ];
        },
        adjustDate(picker, value){
            // 时间选择器改变时，需要调整日期使得只能在开始-结束时间范围内
            let startDate = dayjs().add(+this.config.minOrderTimeToStartTime, 'second');
            let startDay = startDate.set('hour', 0).set('minute', 0).set('second', 0);
            let timeList = this.config.timeList;
            if(timeList) {
                let time = timeList[timeList.length -1].value.split(':');
                let realStartTime = startDay.set('hour', +(time[0])).set('minute', +(time[1]));
                if(realStartTime < startDate) {
                    startDate = startDate.add(1, 'day');
                }
            }
            let endDate = dayjs().add(+this.config.maxOrderTimeToStartTime, 'second');
            if(parseInt(value[1]) === (startDate.$M + 1)) {
                // 如果时起始月份，日期的值必须大于最小日期
                if(parseInt(value[2]) < startDate.$D) {
                    picker.setSlotValue(2, `${startDate.$D}日`);
                }
            }else if(parseInt(value[1]) === (endDate.$M + 1)) {
                //如果是结束月份，日期值必须小于最大日期
                if(parseInt(value[2]) > endDate.$D) {
                    picker.setSlotValue(2, `${endDate.$D}日`);
                }
            }
        }
    }
};
