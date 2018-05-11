export default {
    methods: {
        generateAddressSlots(regionList, defaultAddress = {stateInfo: {id: 814}}){
            this.allRegionList = regionList;
            let countryList = regionList.filter(item => item.type === 'country');
            let defaultCountry = countryList[0];
            let stateList = regionList.filter(item => item.fid === defaultCountry.id && item.type === 'state');
            let defaultStateId = defaultAddress && defaultAddress.stateInfo && defaultAddress.stateInfo.id || 814;                  //默认江苏省
            let defaultStateIndex = stateList.findIndex(item => item.id === defaultStateId);
            let defaultCityId = defaultAddress && defaultAddress.cityInfo && defaultAddress.cityInfo.id;
            let cityList = regionList.filter(item => item.fid === defaultStateId);
            let defaultCityIndex = 0;
            if(defaultCityId) {
                defaultCityIndex = cityList.findIndex(item => item.id === defaultCityId);
            }
            let defaultRegionId = defaultAddress && defaultAddress.regionInfo && defaultAddress.regionInfo.id;
            let cityRegionList = regionList.filter(item => item.fid === cityList[0].id);
            let defaultRegionIndex = 0;
            if(defaultRegionId) {
                defaultRegionIndex = cityRegionList.findIndex(item => item.id === defaultRegionId);
            }
            return [
                {values: stateList, defaultIndex: defaultStateIndex, flex: 1},
                {values: cityList, defaultIndex: defaultCityIndex, flex: 1},
                {values: cityRegionList, defaultIndex: defaultRegionIndex, flex: 1}
            ];
        },
        adjustAddress(picker, value) {
            // 根据stateId获取city列表，如果city列表为空，则获取region列表
            if(value[0]) {
                let stateId = value[0].id;
                let cityList = this.allRegionList.filter(item => item.fid === stateId && item.type === 'city');
                console.log(cityList);
                if(cityList.length > 0) {
                    picker.setSlotValues(1, cityList);
                } else {
                    let regionList = this.allRegionList.filter(item => item.fid === stateId && item.type === 'region');
                    picker.setSlotValues(1, regionList);
                }
                let cityId = picker.getSlotValue(1).id;
                let subRegionList = this.allRegionList.filter(item => item.fid === cityId && item.type === 'region');
                if(subRegionList.length > 0) {
                    picker.setSlotValues(2, subRegionList);
                }else {
                    picker.setSlotValues(2, []);
                }
            }
        }
    }
};
