import HttpHandler from '@/util/HttpHandler';
import {
  STATISTICS_ITEM,
  STATISTICS_ORDER,
  STATISTICS_USER,
  USER_CITY,
  GET_USER_COUNT,
  GET_ORDER_COUNT,
  GET_ITEM_COUNT,
  GET_TOTAL_COUNT,
  USER
} from '../../api';

var httpHandler = new HttpHandler();
const Dashboard = {
  namespaced: true,
  state: {
    itemCount: 0,
    userCount: 0,
    orderCount: 0,
    amount: 0,
    audits: [],
    userStatistics: [],
    itemStatistics: [],
    paymentStatistics: [],
    userName: []
  },
  mutations: {
    /**
     * set item statistics
     */
    setItemStatistics: (state, data) => {
      state.itemStatistics.push(data);
    },
    /**
     * set payment statistics
     */
    setPaymentStatistics: (state, data) => {
      state.paymentStatistics.push(data);
    },
    /**
     * set user statistics
     */
    setUserStatistics: (state, data) => {
      state.userStatistics.push(data);
    },
    /**
     * set data to wait for audit
     */
    setWaitAudit: (state, data) => {
      state.audits = data;
    },
    /**
     * set total transaction amount
     */
    setTotalAmount: (state, amount) => {
      state.amount = amount;
    },
    /**
     * set total number of items
     */
    setItemCount: (state, count) => {
      state.itemCount = count;
    },
    /**
     * set total number of users
     */
    setUserCount: (state, count) => {
      state.userCount = count;
    },
    /**
     * set total number of orders
     */
    setOrderCount: (state, count) => {
      state.orderCount = count;
    },
    setUserName: (state, userName) => {
      state.userName = userName;
    }
  },
  actions: {
    /**
     * get city name from code
     */
    getCityName: async (context, id) => {
      let rep = await httpHandler.sendRequest(`${USER_CITY}/${id}`, 'GET');

      if (rep.status === 200) {
        return rep.data.data.city;
      }
      return '';
    },
    /**
     * get total number of items from database
     */
    getItemCount: async ({ commit }) => {
      let items = 0;
      let resp = await httpHandler.sendRequest(`${GET_ITEM_COUNT}`, 'GET');

      if (resp.status === 200) {
        items = resp.data;
      }

      commit('setItemCount', items);
    },
    /**
     * get total number of orders
     */
    getOrderCount: async ({ commit }) => {
      let orders = 0;

      let resp = await httpHandler.sendRequest(`${GET_ORDER_COUNT}`, 'GET');

      if (resp.status === 200) {
        orders = resp.data;
      }

      commit('setOrderCount', orders);
    },
    /**
     * get total number of orders
     */
    getUserCount: async ({ commit }) => {
      let users = 0;

      let resp = await httpHandler.sendRequest(`${GET_USER_COUNT}`, 'GET');

      if (resp.status === 200) {
        users = resp.data;
      }

      commit('setUserCount', users);
    },
    /**
     * get total amount of transaction
     */
    getAllTransaction: async ({ commit }) => {
      let transactions = 0;
      let resp = await httpHandler.sendRequest(`${GET_TOTAL_COUNT}`, 'GET');

      if (resp.status === 200) {
        transactions = resp.data;
      }

      commit('setTotalAmount', transactions);
    },

    /**
     * get statistic data
     */
    getStatistics: async ({ commit }, time) => {
      let user = 0;
      let item = 0;
      let payment = 0;

      user = (
        await httpHandler.sendRequest(
          `${STATISTICS_USER}start%3d${time.start},end%3d${time.end}`,
          'GET'
        )
      ).data;
      item = (
        await httpHandler.sendRequest(
          `${STATISTICS_ITEM}start%3d${time.start},end%3d${time.end}`,
          'GET'
        )
      ).data;
      payment = (
        await httpHandler.sendRequest(
          `${STATISTICS_ORDER}start%3d${time.start},end%3d${time.end}`,
          'GET'
        )
      ).data;

      commit('setItemStatistics', item);
      commit('setUserStatistics', user);
      commit('setPaymentStatistics', payment);
    },
    getUserName: async ({ commit }) => {
      let userName = [];

      let resp = await httpHandler.sendRequest(`${USER}`, 'GET');

      if (resp.status === 200) {
        let data = resp.data;

        for (let i in data) {
          userName.push(data[i].name);
        }
      }
      commit('setUserName', userName);
    }
  },
  getters: {
    /**
     * get total amount of transaction
     */
    audits: state => {
      return state.audits;
    },
    /**
     * get total amount of transaction
     */
    amount: state => {
      return state.amount;
    },
    /**
     * get total number of items
     */
    itemCount: state => {
      return state.itemCount;
    },
    /**
     * get total number of users
     */
    userCount: state => {
      return state.userCount;
    },
    /**
     * get total number of orders
     */
    orderCount: state => {
      return state.orderCount;
    },
    /**
     * get user statistics data
     */
    userStatistics: state => {
      return state.userStatistics;
    },
    /**
     * get item statistics data
     */
    itemStatistics: state => {
      return state.itemStatistics;
    },
    /**
     * get payment statistics data
     */
    paymentStatistics: state => {
      return state.paymentStatistics;
    },
    getUserName: state => {
      return state.userName;
    }
  }
};

export default Dashboard;
