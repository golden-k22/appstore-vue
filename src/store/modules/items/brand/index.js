import HttpHandler from '@/util/HttpHandler';
import { BRAND_LIST } from '../../../api';

var httpHandler = new HttpHandler();
const Brand = {
  namespaced: true,
  state: {
    brandList: [],
    id: '',
    status: false,
    nameOnly: false,
    search: ''
  },
  mutations: {
    /**
     * set total brandlist
     */
    setBrandList: (state, count) => {
      state.brandList = count;
    },
    /**
     * set id of selected brand
     */
    setId: (state, count) => {
      state.id = count;
    },
    /**
     * set total number of orders
     */
    setStatus: (state, count) => {
      state.status = count;
    },
    setSearch: (state, name) => {
      state.search = name;
    }
  },
  actions: {
    /**
     * get total brandlist from database
     */
    getBrandList: async ({ commit }) => {
      let items = [];

      let resp = await httpHandler.sendRequest(`${BRAND_LIST}`, 'GET');

      if (resp.status === 200) {
        items = resp.data;
      }

      commit('setBrandList', items);
    },
    /**
     * delete selected brandlist from database
     */
    deleteBrand: async ({ commit, state }) => {
      let result = false;
      let resp = await httpHandler.sendRequest(
        `${BRAND_LIST}/${state.id}`,
        'DELETE'
      );

      if (resp.status === 204) {
        result = true;
      }

      commit('setStatus', result);
    }
  },
  getters: {
    /**
     * get total brandlist
     */
    getBrandList: state => {
      return state.brandList;
    },
    /**
     * get id of selected brand
     */
    getId: state => {
      return state.id;
    },
    /**
     * get status of deleted item
     */
    getStatus: state => {
      return state.status;
    }
  }
};

export default Brand;
