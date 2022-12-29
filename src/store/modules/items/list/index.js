import HttpHandler from '@/util/HttpHandler';
import { ITEMS, ITEM_BRAND, ITEM_TYPE, ITEM_AUDIT } from '../../../api';

var httpHandler = new HttpHandler();
const AllItemList = {
  namespaced: true,
  state: {
    auditDetail: [],
    selectedId: 1,
    itemTypeById: '',
    itemById: {},
    smartSearchKey: {
      primaryKey: '',
      itemType: '',
      itemBrand: '',
      auditStatus: ''
    },
    /** item type */
    itemType: [],
    /** item data */
    itemList: [],
    /** item brand */
    itemBrand: [],
    allItemCount: '',
    waitingCount: '',
    notPassCount: ''
  },
  mutations: {
    setAuditDetail: (state, detail) => {
      state.auditDetail = detail;
    },
    setItemTypeById: (state, type) => {
      state.itemTypeById = type;
    },
    setItemById: (state, data) => {
      state.itemById = data;
    },
    setSelectedId: (state, id) => {
      state.selectedId = id;
    },
    /** Setting the smart search key */
    setSmartSearchKey: (state, key) => {
      state.smartSearchKey = key;
    },
    /**
     * set total count of items
     */
    setAllItemCount: (state, count) => {
      state.allItemCount = count;
    },
    /**
     * set waiting audit count of items
     */
    setWaitingCount: (state, count) => {
      state.waitingCount = count;
    },
    /* set not pass count */
    setNotPassCount: (state, count) => {
      state.notPassCount = count;
    },
    /** Setting the item type */
    setItemType: (state, itemType) => {
      state.itemType = [];
      state.itemType = itemType;
    },
    /***
     * Set item list
     */
    setItemList: (state, list) => {
      state.itemList = list;
    },
    /** Setting the item brand */
    setItemBrand: (state, brand) => {
      state.itemBrand = [];
      state.itemBrand = brand;
    }
  },
  actions: {
    /**
     * Getting the waiting audit count.
     */
    getWaitingCount: async ({ commit }) => {
      let count = '';

      let response = await httpHandler.sendRequest(
        `${ITEMS}?search=status%3d0&counting=true`,
        'GET'
      );

      if (response.status === 200) {
        count = response.data;
      }

      commit('setWaitingCount', count);
    },
    /**
     * Getting the not pass count.
     */
    getNotPassCount: async ({ commit }) => {
      let count = '';

      let response = await httpHandler.sendRequest(
        `${ITEMS}?search=status%3d2&counting=true`,
        'GET'
      );

      if (response.status === 200) {
        count = response.data;
      }

      commit('setNotPassCount', count);
    },
    /**
     * get total number of items from database
     */
    getAllItemCount: async ({ commit }) => {
      let count = '';

      let response = await httpHandler.sendRequest(
        `${ITEMS}?counting=true`,
        'GET'
      );

      if (response.status === 200) {
        count = response.data;
      }

      commit('setAllItemCount', count);
    },
    getItemTypeById: async ({ commit }, id) => {
      let type = '';
      let resp = await httpHandler.sendRequest(`${ITEM_TYPE}/${id}`, 'GET');

      if (resp.status === 200) {
        type = resp.data.name;
      }

      commit('setItemTypeById', type);
    },
    /** Get the item brand array. */
    getItemType: async ({ commit }) => {
      let list = [];

      let response = await httpHandler.sendRequest(`${ITEM_TYPE}`, 'GET');

      if (response.status === 200) {
        let val = response.data;

        for (let i in val) {
          list.push({
            id: val[i].id,
            name: val[i].name
          });
        }
      }

      commit('setItemType', list);
    },
    /** Get the item type array. */
    getItemBrand: async ({ commit }) => {
      let list = [];

      let response = await httpHandler.sendRequest(
        `${ITEM_BRAND}?nameonly=true`,
        'GET'
      );

      if (response.status === 200) {
        let val = response.data;

        for (let i in val) {
          list.push(val[i].name);
        }
      }

      commit('setItemBrand', list);
    },
    getFilterList: async ({ commit }, info) => {
      let items = [];
      let count = 0;
      let str = '';

      if (
        info[2] !== { primaryKey: '', itemType: '', itemBrand: '', status: '' }
      ) {
        str = '?search=';
        if (info[2].primaryKey !== '') {
          str += 'name%3d' + info[2].primaryKey;
        }
        if (info[2].itemBrand !== '') {
          if (str === '?search=') {
            str += 'brand%3d' + encodeURI(info[2].itemBrand);
          } else {
            str += ',brand%3d' + info[2].itemBrand;
          }
        }
        if (info[2].itemType !== '') {
          if (str === '?search=') {
            str += 'kind%3d' + info[2].itemType;
          } else {
            str += ',kind%3d' + info[2].itemType;
          }
        }
        if (info[2].auditStatus !== '') {
          if (str === '?search=') {
            str += 'status%3d' + info[2].auditStatus;
          } else {
            str += ',status%3d' + info[2].auditStatus;
          }
        }
      }
      let response = await httpHandler.sendRequest(
        `${ITEMS}${str}&page=${info[0] - 1}&size=${info[1]}`,
        'GET'
      );

      let resp = await httpHandler.sendRequest(
        `${ITEMS}${str}&counting=true`,
        'GET'
      );

      if (resp.status === 200) {
        count = resp.data;
      }

      if (response.status === 200) {
        items = response.data;
      }

      commit('setItemList', items);

      return count;
    },
    getItemById: async ({ commit }, id) => {
      let data = {};
      let res = await httpHandler.sendRequest(`${ITEMS}/${id}`, 'GET');

      if (res.status === 200) {
        data = res.data;
      }
      commit('setItemById', data);
    },
    /***
     * Get item list
     */
    getItemList: async ({ commit }, info) => {
      let items = [];

      let response = await httpHandler.sendRequest(
        `${ITEMS}?page=${info[0] - 1}&size=${info[1]}`,
        'GET'
      );

      if (response.status === 200) {
        items = response.data;
      }

      commit('setItemList', items);
    },
    getAuditDetail: async ({ commit, state }) => {
      let list = [];

      let response = await httpHandler.sendRequest(
        `/audit/${ITEMS}/${state.selectedId}/${ITEM_AUDIT}`,
        'GET'
      );

      if (response.status === 200) {
        list = response.data;
      }

      commit('setAuditDetail', list);
    },
    delete: async (context, id) => {
      let response = await httpHandler.sendRequest(`${ITEMS}/${id}`, 'DELETE');

      if (response === undefined) {
        return 0;
      }
      if (response.status === 204) {
        return 1;
      }
      if (response.status === 404) {
        return 2;
      }
    }
  },
  getters: {
    itemTypeById: state => {
      return state.itemTypeById;
    },
    itemById: state => {
      return state.itemById;
    },
    selectedId: state => {
      return state.selectedId;
    },
    auditDetail: state => {
      return state.auditDetail;
    },
    /** Get the smart search key */
    smartSearchKey: state => {
      return state.smartSearchKey;
    },
    /**
     * get total count of items
     */
    allItemCount: state => {
      return state.allItemCount;
    },
    /**
     * get waitind audit count
     */
    waitingCount: state => {
      return state.waitingCount;
    },
    /**
     * get the not pass count
     */
    notPassCount: state => {
      return state.notPassCount;
    },
    /** Get the item type array. */
    itemType: state => {
      return state.itemType;
    },
    /***
     * get item list
     */
    itemList: state => {
      return state.itemList;
    },
    /** Get the item brand array. */
    itemBrand: state => {
      return state.itemBrand;
    }
  }
};

export default AllItemList;
