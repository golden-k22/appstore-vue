import HttpHandler from '@/util/HttpHandler';
import { NOTIFICATION } from '../../api';
var httpHandler = new HttpHandler();

const Notification = {
  namespaced: true,
  state: {
    systemPushList: [],
    iosPushList: [],
    result: false,
    id: 0
  },
  mutations: {
    setSystemList: (state, data) => {
      state.systemPushList = data;
    },
    setIOSList: (state, data) => {
      state.iosPushList = data;
    },
    setStatus: (state, result) => {
      state.result = result;
    },
    setId: (state, id) => {
      state.id = id;
    }
  },
  actions: {
    getPushList: async ({ commit }, type) => {
      let list = [];

      let response = await httpHandler.sendRequest(
        `${NOTIFICATION}?search=publishtype%3d${type}`,
        'GET'
      );

      if (response.status === 200) {
        list = response.data;
      }
      if (type === 1) {
        commit('setSystemList', list);
      } else {
        commit('setIOSList', list);
      }
    },
    deleteList: async ({ commit, state }) => {
      let result = false;
      let resp = await httpHandler.sendRequest(
        `${NOTIFICATION}/${state.id}`,
        'DELETE'
      );

      if (resp.status === 204) {
        result = true;
      }

      commit('setStatus', result);
    },
    updateList: async ({ commit, state }, data) => {
      let result = false;
      let resp = await httpHandler.sendRequest(
        `${NOTIFICATION}/${state.id}`,
        'PUT',
        data
      );

      if (resp.status === 200) {
        result = true;
      }

      commit('setStatus', result);
    },
    addList: async ({ commit }, data) => {
      let result = false;
      let resp = await httpHandler.sendRequest(`${NOTIFICATION}`, 'POST', data);

      if (resp.status === 201) {
        result = true;
      }

      commit('setStatus', result);
    }
  },
  getters: {
    getSytemList: state => {
      return state.systemPushList;
    },
    getIOSList: state => {
      return state.iosPushList;
    },
    getStatus: state => {
      return state.result;
    }
  }
};

export default Notification;
