import HttpHandler from '@/util/HttpHandler';
import {
  CITY,
  PROVINCE,
  USER_LIST,
  ADRESS,
  USER_ORDER,
  FOLLOW_USER,
  FOLLOW_PRODUCT
} from '../../api';

var httpHandler = new HttpHandler();
const Users = {
  namespaced: true,

  state: {
    userCount: 0,
    followUserCount: 0,
    followProductCount: 0,
    provinceByCode: {},
    userById: {},
    provinces: [],
    cities: [],
    userList: [],
    cityByCode: {},
    users: [],
    EditInfoList: '',
    AddressListData: [],
    TransactionRecordData: [],
    OrderInformation: [],
    ItemInformation: [],
    CityCode: '',
    provinceName: '',
    oldEditInfo: {},
    userName: [],
    followList: [],
    follow: [],
    followProList: [],
    productList: [],
    followItem: []
  },
  mutations: {
    setUserCount: (state, count) => {
      state.userCount = count;
    },
    setFollowUserCount: (state, count) => {
      state.followUserCount = count;
    },
    setFollowProductCount: (state, count) => {
      state.followProductCount = count;
    },
    setProvinceByCode: (state, data) => {
      state.provinceByCode = data;
    },
    setCities: (state, list) => {
      state.cities = list;
    },
    setProvinces: (state, list) => {
      state.provinces = list;
    },
    setProductList: (state, list) => {
      state.productList = list;
    },
    setCityByCode: (state, data) => {
      state.cityByCode = data;
    },
    setFollowProList: (state, data) => {
      state.followProList = data;
    },
    setFollow: (state, data) => {
      state.follow = data;
    },
    setUserById: (state, data) => {
      state.userById = data;
    },
    /**
     * Setting user list.
     */
    setUsers: (state, users) => {
      state.users = users;
    },
    setUserList: (state, list) => {
      state.userList = list;
    },
    /**
     * set data list of edit information
     */
    setEditInfoList: (state, info) => {
      state.EditInfoList = info;
    },
    /**
     * set data list of address
     */
    setAddressListData: (state, info) => {
      state.AddressListData = info;
    },
    /**
     * set data list of transaction record
     */
    setTransactionRecordData: (state, info) => {
      state.TransactionRecordData = info;
    },
    /**
     * set data list of Order information
     */
    setOrderInformation: (state, info) => {
      state.OrderInformation = info;
    },
    /**
     * set data list of province code
     */
    setCityCode: (state, info) => {
      state.provinceName = info;
    },

    setFollowItem: (state, followItem) => {
      state.followItem = followItem;
    },
    /**
     * set data list of province code
     */
    setItemInformation: (state, info) => {
      state.ItemInformation = info;
    },
    setUserName: (state, userName) => {
      state.userName = userName;
    },
    setFollowList: (state, followList) => {
      state.followList = followList;
    }
  },
  actions: {
    getFollowUserCount: async ({ commit }, id) => {
      let count = 0;
      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${id}${FOLLOW_USER}`,
        'get'
      );

      if (resp.status === 200) {
        count = resp.data.length;
      }
      commit('setFollowUserCount', count);
    },
    getFollowProductCount: async ({ commit }, id) => {
      let count = 0;
      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${id}${FOLLOW_PRODUCT}`,
        'get'
      );

      if (resp.status === 200) {
        count = resp.data.length;
      }

      commit('setFollowProductCount', count);
    },
    putUserInfoById: async (context, info) => {
      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${info[1]}`,
        'Patch',
        info[0]
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

      return 4;
    },
    getCities: async ({ commit }, provinceCode) => {
      let list = [];
      let resp = await httpHandler.sendRequest(
        `${PROVINCE}/${provinceCode}${CITY}`,
        'GET'
      );

      if (resp.status === 200) {
        list = resp.data;
      }

      commit('setCities', list);
    },
    getProvinceByCode: async ({ commit }, code) => {
      let data = {
        id: '',
        code: '',
        name: ''
      };
      let resp = await httpHandler.sendRequest(`${PROVINCE}/${code}`, 'GET');

      if (resp.status === 200) {
        data = resp.data;
      }

      commit('setProvinceByCode', data);
    },
    getProvinces: async ({ commit }) => {
      let list = [];
      let resp = await httpHandler.sendRequest(`${PROVINCE}`, 'GET');

      if (resp.status === 200) {
        list = resp.data;
      }

      commit('setProvinces', list);
    },
    getUserById: async ({ commit }, id) => {
      let data = {};
      let resp = await httpHandler.sendRequest(`${USER_LIST}/${id}`, 'GET');

      if (resp.status === 200) {
        data = resp.data;
      }

      commit('setUserById', data);
    },
    getUserCount: async ({ commit }) => {
      let count = 0;
      let resp = await httpHandler.sendRequest(
        `${USER_LIST}?counting=true`,
        'GET'
      );

      if (resp.status === 200) {
        count = resp.data;
      }

      commit('setUserCount', count);
    },
    /***
     * Getting user list from backend.
     */
    getUserList: async ({ commit }, info) => {
      let list = [];

      let resp = await httpHandler.sendRequest(
        `${USER_LIST}?page=${info[0] - 1}&size=${info[1]}`,
        'GET'
      );

      if (resp.status === 200) {
        list = resp.data;
      }

      commit('setUserList', list);
    },
    async getCityByCode({ commit }, info) {
      let data = {
        id: '',
        code: '',
        name: ''
      };
      let res = await httpHandler.sendRequest(
        `${PROVINCE}/${info[0]}${CITY}/${info[1]}`,
        'GET'
      );

      if (res.status === 200) {
        data = res.data;
      }
      commit('setCityByCode', data);
    },
    getFollowList: async ({ commit }, id) => {
      let followList = [];

      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${id}${FOLLOW_USER}`,
        'GET'
      );

      if (resp.status === 200) {
        followList = resp.data;
      }
      commit('setFollowList', followList);
    },
    getSelectedList: async ({ commit }, id) => {
      let followItem = [];

      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${id}${FOLLOW_PRODUCT}`,
        'GET'
      );

      if (resp.status === 200) {
        followItem = resp.data;
      }
      commit('setFollowItem', followItem);
    },
    getAddressListData: async ({ commit }, id) => {
      let items = [];
      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${id}${ADRESS}`,
        'GET'
      );

      if (resp.status === 200) {
        items = resp.data;
      }

      commit('setAddressListData', items);
    },
    getOrderInformation: async ({ commit }, id) => {
      let result = [];

      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${id}${USER_ORDER}`,
        'GET'
      );

      if (resp.status === 200) {
        result = resp.data;
      }

      commit('setOrderInformation', result);
    },
    /**
     * get data list of Item Information
     */
    getItemInformation: async ({ commit }, userId) => {
      let items = [];

      let resp = await httpHandler.sendRequest(
        `${USER_LIST}/${userId}/items`,
        'GET'
      );

      if (resp.status === 200) {
        items = resp.data;
      }

      commit('setItemInformation', items);
    },
    /**
     * get data list of OrderInformation
     */
    getTransactionRecordData: async ({ commit }, id) => {
      let result = {};
      let resp = await httpHandler.sendRequest(`/orders/${id}/receiver`, 'GET');

      if (resp.status === 200) {
        result = resp.data;
      }
      commit('setTransactionRecordData', result);
    },

    /**
     * get data of province name
     *
     */
    getProvinceName: async (context, id) => {
      let item = '';
      let resp = await httpHandler.sendRequest(`${PROVINCE}/${id}`, 'GET');

      if (resp.status === 200) {
        item = resp.data.data.province;
      }

      return item;
    }
  },
  getters: {
    userCount: state => {
      return state.userCount;
    },
    followUserCount: state => {
      return state.followUserCount;
    },
    followProductCount: state => {
      return state.followProductCount;
    },
    provinceByCode: state => {
      return state.provinceByCode;
    },
    cities: state => {
      return state.cities;
    },
    provinces: state => {
      return state.provinces;
    },
    /**
     * Getting the user information by id.
     */
    userById: state => {
      return state.userById;
    },
    /***
     * Getting the user list.
     */
    userList: state => {
      return state.userList;
    },
    cityByCode: state => {
      return state.cityByCode;
    },

    /**
     * get users' list
     */
    getUsers: state => {
      return state.users;
    },

    /**
     * get data list of edit information
     */
    EditInfoList: state => {
      return state.EditInfoList;
    },
    /**
     * get data list of address
     */
    AddressListData: state => {
      return state.AddressListData;
    },
    /**
     * get data list of transaction record
     */
    TransactionRecordData: state => {
      return state.TransactionRecordData;
    },
    /**
     * get data list of Order information
     */
    OrderInformation: state => {
      return state.OrderInformation;
    },
    /**
     * get data list of Item Information
     */
    ItemInformation: state => {
      return state.ItemInformation;
    },
    getUserName: state => {
      return state.userName;
    },
    getFollowList: state => {
      return state.followList;
    },
    getFollow: state => {
      return state.follow;
    },
    followProList: state => {
      return state.followProList;
    },
    productList: state => {
      return state.productList;
    },
    getFollowItem: state => {
      return state.followItem;
    }
  }
};

export default Users;
