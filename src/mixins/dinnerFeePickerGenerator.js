export default {
    methods: {
        generateDinnerFeeSlots(list) {
            let feeList = list.map(item => item.value);
            return [
                {values: feeList.map(item => {
                    return {
                        label: `￥${item}/桌`,
                        value: +item
                    };
                }), defaultIndex: 0, flex: 1}
            ];
        }
    }
};
