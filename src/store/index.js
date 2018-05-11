import Vue from 'vue/dist/vue';
import Vuex from 'vuex';
import party from './modules/party';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        party
    }
});
