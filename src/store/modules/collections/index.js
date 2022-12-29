/* eslint-disable */
import HttpHandler from '@/util/HttpHandler';
import { COLLECTION, ITEM_TYPE, ITEMS } from '../../api';
//import Collection from '../../../dto/Collection';
//import ItemCategory from '../../../dto/ItemCategory';
//import Item from '../../../dto/Item';

var httpHandler = new HttpHandler();
const Collections = {
  namespaced: true,
  state: {
    collections: [],
    collection: {},
    itemCategories: [],
    items: [],
    collectionCount: 0,
    standaloneCount: 0,
    otherCount: 0,
    exceptTableCount: 0,
    listCount: 0,
    flowCount: 0,
    firstCount: 0,
    collectionById: {}
  },
  mutations: {
    /**
     * set collections
     */
    setCollections: (state, collections) => {
      state.collections = collections;
    },
    /**
     * set collection
     */
    setCollection: (state, collection) => {
      state.collection = collection;
    },
    /**
     * set itemCategories
     */
    setItemCategories: (state, itemCategories) => {
      state.itemCategories = itemCategories;
    },
    /**
     * set items
     */
    setItems: (state, items) => {
      state.items = items;
    },
    /**
     * set number of collections
     */
    setCollectionCount: (state, count) => {
      state.collectionCount = count;
    },
    /**
     * set number of collections type of which is standalone
     */
    setStandaloneCount: (state, count) => {
      state.standaloneCount = count;
    },
    /**
     * set number of collections type of which is other
     */
    setOtherCount: (state, count) => {
      state.otherCount = count;
    },
    /**
     * set number of collections type of which is other
     */
    setExceptTableCount: (state, count) => {
      state.exceptTableCount = count;
    },
    setListCount: (state, count) => {
      state.listCount = count;
    },
    setFlowCount: (state, count) => {
      state.flowCount = count;
    },
    setFirstCount: (state, count) => {
      state.firstCount = count;
    }
  },
  actions: {
    /**
     * get collection from database
     */
    getCollectionsFromDB: async ({ commit }) => {
      let collections = [];
      let resp = await httpHandler.sendRequest(`${COLLECTION}`, 'GET');


      if (resp.status === 200) {
        let list = resp.data;

        for (let i in list) {
          if (list[i].active) {
            list[i].active = 1;
          } else {
            list[i].active = 0;
          }
          collections.push({
            id: list[i].id,
            colTitle: list[i].title,
            colType: list[i].type,
            category: list[i].kind,
            intro: list[i].intro,
            onUse: list[i].active,
            productId: list[i].items,
            pic: list[i].headImage,
            allPic: list[i].restImages
          });
        }
      }

      commit('setCollections', collections);
    },
    /**
     * get collection from database
     */
    getCollectionFromDB: async ({ commit, state }, id) => {
      let collection = {};
      let resp = await httpHandler.sendRequest(`${COLLECTION}/${id}`, 'GET');

      if (resp.status === 200) {
        let data = resp.data;

        state.collectionById = data;

        if (data.active) {
          data.active = 1;
        } else {
          data.active = 0;
        }

        collection = {
          id: data.id,
          colTitle: data.title,
          colType: data.type,
          intro: data.intro,
          onUse: data.active,
          productId: data.items,
          pic: data.headImage,
          allPic: data.restImages
        };
      }

      commit('setCollection', collection);
    },

    /**
     * get itemCategory from database
     */
    getItemCategoriesFromDB: async ({ commit }, id) => {
      let itemCategories = [];
      let resp = await httpHandler.sendRequest(
        `${ITEM_TYPE}/${id}/subs`,
        'GET'
      );

      if (resp.status === 200) {
        let list = resp.data;

        for (let i in list) {
          itemCategories.push({
            categId: list[i].id,
            categName: list[i].name
          });
        }
      }

      commit('setItemCategories', itemCategories);
    },

    /**
     * get items from database
     */
    getItemsFromDB: async ({ commit }) => {
      let items = [];
      let resp = await httpHandler.sendRequest(`${ITEMS}`, 'GET');

      if (resp.status === 200) {
        let list = resp.data;

        for (let i in list) {
          items.push({
            id: list[i].id,
            itemName: list[i].features.name
          });
        }
      }
      commit('setItems', items);
    },

    /**
     * send audit result
     */
    updateCollection: async ({ state }, data) => {
      let collections = data.value;
      let id = data.id;
      let list = state.collectionById;

      list.intro = collections.intro;
      list.id = id;
      list.items = collections.productId;
      list.headImage = collections.pic;
      list.restImages = collections.allPic;
      list.active = collections.onUse;
      list.title = collections.colTitle;
      list.type = collections.colType;

      let resp = await httpHandler.sendRequest(
        `${COLLECTION}/${id}`,
        'PUT',
        list
      );

      if (resp.status === 200) {
        return true;
      }

      return false;
    },

    addCollection: async ({ state }, data) => {
      let collections = data;
      let list = state.collectionById;

      list.title = collections.colTitle;
      list.type = collections.colType;
      list.intro = collections.intro;
      list.headImage = collections.pic;
      list.restImages = collections.allPic;
      list.items = collections.productId;
      list.active = collections.onUse;

      let resp = await httpHandler.sendRequest(`${COLLECTION}`, 'POST', list);

      if (resp.status === 201) {
        return true;
      }

      return false;
    },

    /* get number of status */

    getStatusCount: async ({ commit, getters }) => {
      let collections = getters.getCollections;
      commit('setCollectionCount', collections.length);

      let res = [];
      res = collections.filter(collection => collection.colType === 1);
      commit('setStandaloneCount', res.length);

      res = [];
      res = collections.filter(collection => collection.colType === 2);
      commit('setOtherCount', res.length);

      res = [];
      res = collections.filter(collection => collection.colType === 3);
      commit('setExceptTableCount', res.length);

      res = [];
      res = collections.filter(collection => collection.colType === 4);
      commit('setListCount', res.length);

      res = [];
      res = collections.filter(collection => collection.colType === 5);
      commit('setFlowCount', res.length);

      res = [];
      res = collections.filter(collection => collection.colType === 6);
      commit('setFirstCount', res.length);
    }
  },
  getters: {
    /**
     * get collections
     */
    getCollections: state => {
      return state.collections;
    },

    /**
     * get collection
     */
    getCollection: state => {
      return state.collection;
    },

    /**
     * get itemCategories
     */
    getItemCategories: state => {
      return state.itemCategories;
    },

    /**
     * get items
     */
    getItems: state => {
      return state.items;
    },

    /**
     * get number of collections
     */
    collectionCount: state => {
      return state.collectionCount;
    },
    /**
     * get number of collections type of which is standalone
     */
    standaloneCount: state => {
      return state.standaloneCount;
    },
    /**
     *gset number of collections type of which is other
     */
    otherCount: state => {
      return state.otherCount;
    },
    /**
     * get number of collections type of which is other
     */
    exceptTableCount: state => {
      return state.exceptTableCount;
    },
    getListCount: state => {
      return state.listCount;
    },
    getFlowCount: state => {
      return state.flowCount;
    },
    getFirstCount: state => {
      return state.firstCount;
    }
  }
};

export default Collections;
