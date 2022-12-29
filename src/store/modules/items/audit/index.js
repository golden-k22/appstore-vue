import HttpHandler from '@/util/HttpHandler';
import { ITEMS } from '../../../api';

var httpHandler = new HttpHandler();
const Audit = {
  namespaced: true,
  state: {
    auditList: [],
    updateAudit: {
      auditTime: '',
      id: 0,
      itemId: 0,
      refuseReason: '',
      status: 0
    }
  },
  mutations: {
    setAuditList: (state, list) => {
      state.auditList = [];
      state.auditList = list;
    },
    setUpdateAudit: (state, data) => {
      state.updateAudit = {};
      state.updateAudit = data;
    }
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    getAuditList: async ({ commit }, info) => {
      let response = await httpHandler.sendRequest(
        `${ITEMS}?search=status%3d0`,
        'GET'
      );
      let list = [];

      if (response.status === 200) {
        list = response.data;
      }
      commit('setAuditList', list);
    },
    updateAuditResult: async ({ state }) => {
      let data = {
        status: state.updateAudit.status,
        comment: state.updateAudit.refuseReason
      };

      let resp = await httpHandler.sendRequest(
        `/audit/items/${state.updateAudit.id}`,
        'PUT',
        data
      );

      if (resp === undefined) {
        return 'Network Error!';
      }
      if (resp.status === 200) {
        return 'Success!';
      }

      if (resp.status === 404) {
        return 'Not found item!';
      }

      if (resp.status === 409) {
        return 'Conflict!';
      }
    }
  },
  getters: {
    auditList: state => {
      return state.auditList;
    }
  }
};

export default Audit;
