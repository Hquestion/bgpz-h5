export const SET_USER_ADDRESS = 'SET_USER_ADDRESS';
export const SET_PARTY_META = 'SET_PARTY_META';

// initial state
const state = {
    useAddress: {},
    partyMeta: {
        theme: '',
        time: '',
        timeDate: '',
        address: '',
        addressType: 1,
        feePer: 0,
        partyPoster: [],
        partyNumber: 10,
        partyTableNum: 1,
        selectedBgImg: '',
        selectedBgPageIndex: 1,
        description: ''
    }
};

// getters
const getters = {
    getPartyMeta: state => state.partyMeta
};

// actions
const actions = {
    [SET_USER_ADDRESS]({ commit }, data){
        commit(SET_USER_ADDRESS, data);
    },
    [SET_PARTY_META] ({commit}, data){
        commit(SET_PARTY_META, data);
    }
};

// mutations
const mutations = {
    [SET_USER_ADDRESS](state, data){
        state.useAddress = data;
        let stateName = data.stateInfo && data.stateInfo.name || '';
        let cityName = data.cityInfo && data.cityInfo.name || '';
        let regionName = data.regionInfo && data.regionInfo.name || '';
        state.partyMeta.address = `${stateName}${cityName}${regionName}${data.addr}`;
        if(data.pic_party) {
            state.partyMeta.partyPoster = JSON.parse(data.pic_party);
        }
    },
    [SET_PARTY_META](state, data){
        state.partyMeta = data;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

