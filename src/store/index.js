import Vue from 'vue/dist/vue';
import Vuex from 'vuex';
import party from './modules/party';
import banquet from './modules/banquet';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        party,
        banquet
    }
});
