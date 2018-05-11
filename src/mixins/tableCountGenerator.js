import {range} from '../util';

export default {
    methods: {
        generateTableCountSlots(tableCountCfg, defaultValue = [1, 10]) {
            let list = tableCountCfg.map(item => item.value);
            let tableList = [];
            this.tableCountRule = {};
            list.forEach(item => {
                let arr = item.split(':');
                tableList.push(arr[0]);
                this.tableCountRule[arr[0]] = arr[1];
            });
            let defaultTableIndex = tableList.findIndex(item => +item === +defaultValue[0]) || 0;
            let countRange = this.tableCountRule[tableList[defaultTableIndex]].split('-');
            let defaultCountList = range(+countRange[0], +countRange[1]);
            let defaultCountIndex = defaultCountList.findIndex(item => item === +defaultValue[1]) || 0;
            return [
                {values: tableList.map(item => `${item}桌`), defaultIndex: defaultTableIndex, flex: 1},
                {values: defaultCountList.map(item => `${item}人`), defaultIndex: defaultCountIndex, flex: 1}
            ];
        },
        adjustTableCount(picker, value){
            if(value[0]) {
                let countRange = this.tableCountRule[parseInt(value[0])].split('-');
                let countList = range(+countRange[0], +countRange[1]);
                picker.setSlotValues(1, countList.map(item => `${item}人`));
            }
        }
    }
};
