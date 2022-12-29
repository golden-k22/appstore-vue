import HttpHandler from '@/util/HttpHandler';
import { ITEMS, ITEM_TYPE } from '../../api';

var httpHandler = new HttpHandler();

export const Item = {
  namespaced: true,
  state: {
    updateItem: {
      id: '',
      no: '',
      user: '',
      status: '',
      features: {
        name: '',
        brand: '',
        count: '',
        price: '',
        keyword: '',
        kind: '',
        subKind: ''
      },
      attributes: {
        size: '',
        color: '',
        headPhoto: '',
        restPhotos: []
      }
    },
    chooseType: '',
    id: 0,
    subTypeList: [],
    subTypeById: {},
    sizeList: '',
    tagList: []
  },

  actions: {
    getTagList: async ({ commit }) => {
      let list = [];
      let resp = await httpHandler.sendRequest(`/item-tags`, 'GET');

      if (resp.status === 200) {
        list = resp.data;
      }
      commit('setTagList', list);
    },
    updateSize: async (context, info) => {
      let resp = await httpHandler.sendRequest(
        `/item-kinds/${info[0]}/sizes`,
        'post',
        info[1]
      );

      if (resp === undefined) {
        return 0;
      }
      if (resp.status === 201) {
        return 1;
      }
      if (resp.status === 400) {
        return 2;
      }
      if (resp.status === 409) {
        return 3;
      }
    },
    getSizeList: async ({ commit }, kind) => {
      let list = [];
      let resp = await httpHandler.sendRequest(
        `/item-kinds/${kind}/sizes`,
        'GET'
      );

      if (resp.status === 200) {
        list = resp.data;
      }
      commit('setSizeList', list);
    },
    getSubTypeById: async ({ commit }, idList) => {
      let data = {};
      let resp = await httpHandler.sendRequest(
        `${ITEM_TYPE}/${idList[0]}/subs/${idList[1]}`,
        'GET'
      );

      if (resp.status === 200) {
        data = resp.data;
      }

      commit('setSubTypeById', data);
    },
    getSubTypeList: async ({ commit }, id) => {
      let list = [];
      let resp = await httpHandler.sendRequest(
        `${ITEM_TYPE}/${id}/subs`,
        'GET'
      );

      if (resp.status === 200) {
        list = resp.data;
      }
      commit('setSubTypeList', list);
    },
    update: async (context, payload) => {
      let resp = await httpHandler.sendRequest(
        `${ITEMS}/${payload.id}`,
        'patch',
        payload
      );

      if (resp === undefined) {
        return 0;
      }

      if (resp.status === 200) {
        return 1;
      }

      if (resp.status === 400) {
        return 2;
      }

      if (resp.status === 404) {
        return 3;
      }
    }
  },

  /***
   * setters for member variable
   */
  mutations: {
    setSizeList: (state, list) => {
      state.sizeList = list;
    },
    setUpdateItem: (state, item) => {
      state.updateItem = item;
    },
    setChooseType: (state, type) => {
      state.chooseType = type;
    },
    setSubTypeById: (state, data) => {
      state.subTypeById = data;
    },
    setSubTypeList: (state, list) => {
      state.subTypeList = list;
    },
    setId: (state, id) => {
      state.id = id;
    },
    setTagList: (state, list) => {
      state.tagList = list;
    }
  },
  getters: {
    tagList: state => {
      return state.tagList;
    },
    updateItem: state => {
      return state.updateItem;
    },
    chooseType: state => {
      return state.chooseType;
    },
    subTypeById: state => {
      return state.subTypeById;
    },
    subTypeList: state => {
      return state.subTypeList;
    },
    id: state => {
      return state.id;
    },
    sizeList: state => {
      return state.sizeList;
    }
  }
};
export default Item;
