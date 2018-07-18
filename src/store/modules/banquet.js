const placeHolderText = '请选择';
const timePlaceholder = '请提前24小时下单';

import {formatTime} from '../../util';
import dayjs from 'dayjs';

const state = {
    banquetType: '1',
    foodSeries: '',
    foodSpecial: '',
    costPer: 300,
    banquetTime: 0,
    cookerCount: 1,
    waiterCount: 1,
    somerwaerCount: 0,
    banquetAddrType: '1',
    tableCount: 1,
    peopleCount: 10,
    selectPackage: '',
    banquetFoods: {},
    banquetAddressInfo: {},
    foodValidationResult: [],
    validationFoods: []
};

const getters = {
    banquetType(){
        return state.banquetType;
    },
    foodSeries: (state) => {
        return state.foodSeries && state.foodSeries.split('@')[1] || placeHolderText;
    },
    foodSpecial: (state) =>{
        return state.foodSpecial && state.foodSpecial.split('@')[1] || placeHolderText;
    },
    costPer(state){
        return state.costPer;
    },
    banquetTime(state){
        return state.banquetTime > 0 ? formatTime(state.banquetTime * 1000) : timePlaceholder;
    },
    cookerCount(state){
        return state.cookerCount > 0 && `${state.cookerCount}名` || placeHolderText;
    },
    waiterCount(state){
        return state.waiterCount > 0 && `${state.waiterCount}名` || placeHolderText;
    },
    somerwaerCount(state){
        return state.somerwaerCount > 0 && `${state.somerwaerCount}名` || placeHolderText;
    },
    banquetAddrType:(state) => {
        return state.banquetAddrType;
    },
    tablePeopleNum(state){
        return `${state.peopleCount}人、${state.tableCount}桌` || placeHolderText;
    },
    banquetFoods(state){
        return state.banquetFoods;
    }
};

const actions = {
    setFoodSeries({commit}, data){
        commit('updateFoodSeries', data);
    },
    setFoodSpecial({commit}, data){
        commit('updateFoodSpecial', data);
    },
    setBanquetType({commit}, data){
        commit('setBanquetType', data);
    },
    setCostPer({commit}, data) {
        commit('setCostPer', data);
    },
    setBanquetTime({commit}, data){
        commit('setBanquetTime', data);
    },
    setCookerCount({commit}, data){
        commit('setCookerCount', data);
    },
    setWaiterCount({commit}, data){
        commit('setWaiterCount', data);
    },
    setSomerwaerCount({commit}, data){
        commit('setSomerwaerCount', data);
    },
    setBanquetAddrType({commit}, data){
        commit('setBanquetAddrType', data);
    },
    setTablePeopleCount({commit}, data){
        commit('setTablePeopleCount', data);
    },
    selectBanquetPackage({commit}, data){
        commit('selectBanquetPackage', data);
    },
    setBanquetFoods({commit}, data){
        commit('setBanquetFoods', data);
    },
    setBanquetAddress({commit}, data){
        commit('setBanquetAddress', data);
    },
    setFoodValidationResult({commit}, data){
        commit('setFoodValidationResult', data);
    },
    addValidationFood({commit}, data){
        commit('addValidationFood', data);
    },
    deleteValidationFood({commit}, index){
        commit('deleteValidationFood', index);
    }
};

const mutations = {
    updateFoodSeries(state, data) {
        state.foodSeries = data;
    },
    updateFoodSpecial(state, data) {
        state.foodSpecial = data;
    },
    setBanquetType(state, type){
        state.banquetType = type;
    },
    setCostPer(state, data){
        state.costPer = data;
    },
    setBanquetTime(state, data){
        let timeStr = `${parseInt(data[0])}/${parseInt(data[1])}/${parseInt(data[2])}  ${data[3]}`;
        state.banquetTime = dayjs(timeStr).valueOf() / 1000;
    },
    setCookerCount(state, data){
        state.cookerCount = data[0].value;
    },
    setWaiterCount(state, data){
        state.waiterCount = data[0].value;
    },
    setSomerwaerCount(state, data){
        state.somerwaerCount = data[0].value;
    },
    setBanquetAddrType(state, data){
        state.banquetAddrType = data[0].value;
    },
    setTablePeopleCount(state, data) {
        state.peopleCount = data[0].value;
        state.tableCount = data[1].value;
    },
    selectBanquetPackage(state, data){
        state.selectPackage = data;
    },
    setBanquetFoods(state, data){
        state.banquetFoods = data;
    },
    setBanquetAddress(state, data){
        state.banquetAddressInfo = data;
    },
    setFoodValidationResult(state, data){
        state.foodValidationResult = data;
    },
    addValidationFood(state, data){
        state.validationFoods.push(data);
    },
    deleteValidationFood(index){
        state.validationFoods.splice(index, 1);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
