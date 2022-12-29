/* eslint-disable */
import HttpHandler from '@/util/HttpHandler';
import { GET_ORDERS, GET_RECEIVERS } from '../../api';

var httpHandler = new HttpHandler();
const Order = {
  namespaced: true,
  state: {
    orders: [],
    orderById: {},
    orderCount: [],
    submittedCount: [],
    paidCount: [],
    mailedCount: [],
    completeCount: [],
    closedCount: [],
    receivers: [],
    items: [],
    status: false
  },
  mutations: {
    /**
     * set orderById
     */
    setOrderById: (state, order) => {
      state.orderById = order;
    },
    /**
     * set orders
     */
    setOrders: (state, orders) => {
      state.orders = orders;
    },
    /**
     * set receivers
     */
    setReceivers: (state, receivers) => {
      state.receivers = receivers;
    },
    /**
     * set total number of orders
     */
    setOrderCount: (state, count) => {
      state.orderCount = count;
    },

    /**
     * set total number of waiting payment
     */
    setSubmittedCount: (state, count) => {
      state.submittedCount = count;
    },

    /**
     * set total number of waiting mail
     */
    setPaidCount: (state, count) => {
      state.paidCount = count;
    },

    /**
     * set total number of mailed
     */
    setMailedCount: (state, count) => {
      state.mailedCount = count;
    },

    /**
     * set total number of complete
     */
    setCompleteCount: (state, count) => {
      state.completeCount = count;
    },

    /**
     * set total number of closed
     */
    setClosedCount: (state, count) => {
      state.closedCount = count;
    },
    /**
     * set items
     */
    setItems: (state, items) => {
      state.items = items;
    },
    setStatus: (state, status) => {
      state.status = status;
    }
  },
  actions: {
    /**
     * get orders from database
     */
    getOrdersFromDB: async ({ commit }) => {
      let orders = [];
      let resp = await httpHandler.sendRequest(`${GET_ORDERS}`, 'GET');

      if (resp.status === 200) {
        orders = resp.data;
      }

      commit('setOrders', orders);

      /*      let mocOrders = [];

      for (let i = 0; i < 101; i++) {
        let order = new Orders({
          id: 0,
          orderNo: 1,
          submittedTime: '2019-04-18',
          userId: 'Gentlemen',
          totalAmount: 1,
          payMode: 1,
          status: 0
        });

        order.id = i;
        order.orderNo = i;
        order.payMode = i % 3;
        order.status = i % 6;
        if (i === 1) {
          order.userId = 'Kim';
        }

        if (i === 2) {
          order.submittedTime = '2020-04-13';
        }

        mocOrders.push(order);

      commit('setOrders', mocOrders);*/
    },

    getReceiversByIdFromDB: async ({ commit }, id) => {
      let receivers = [];
      let resp = await httpHandler.sendRequest(
        `${GET_ORDERS}/${id}${GET_RECEIVERS}`,
        'GET'
      );

      if (resp.status === 200) {
        receivers = resp.data;
      }
      commit('setReceivers', receivers);
    },

    /* get order by Id from DB */
    getOrderByIdFromDB: async ({ commit }, id) => {
      let order = {};
      let resp = await httpHandler.sendRequest(`${GET_ORDERS}/${id}`, 'GET');

      if (resp.status === 200) {
        order = resp.data;
      }
      commit('setOrderById', order);
      /* let orders = getters.getOrders;
      let order = {};
      let status = [
        '待付款',
        '待发货',
        '已发货',
        '已完成',
        '已关闭',
        '无效订单'
      ];

      let payMode = ['未支付', '支付宝', '微信'];

      for (let i = 0; i < orders.length; i++) {
        if (id === orders[i].id.toString()) {
          order = orders[i];
          /*  order.status = status[orders[i].status];
          order.payMode = payMode[orders[i].status];
        }
      }

      commit('setOrderById', order); */
    },

    /* get number of status */

    getStatusCount: async ({ commit, getters }) => {
      let orders = getters.getOrders;
      commit('setOrderCount', orders.length);

      let res = [];
      res = orders.filter(order => order.status === 0);
      commit('setSubmittedCount', res);

      res = [];
      res = orders.filter(order => order.status === 1);
      commit('setPaidCount', res);

      res = [];
      res = orders.filter(order => order.status === 2);
      commit('setMailedCount', res);

      res = [];
      res = orders.filter(order => order.status === 3);
      commit('setCompleteCount', res);

      res = [];
      res = orders.filter(order => order.status === 4);
      commit('setClosedCount', res);
    },

    /**
     * get items from database
     */
    getProducts: async ({ commit }, id) => {
      let items = [];
      let resp = await httpHandler.sendRequest(
        `${GET_ORDERS}/${id}/items`,
        'GET'
      );

      if (resp.status === 200) {
        let item = {
          productImage: '',
          productName: '',
          price: '',
          property: '',
          count: '',
          kind: '',
          subKind: ''
        };

        let items = resp.data;

        items.forEach(element => {
          item.productImage = element.attributes.headPhoto;
          item.productName = element.features.name;
          item.price = element.features.price;
          item.property =
            'Size:' +
            element.attributes.size +
            'Color:' +
            element.attributes.color;
          item.count = element.features.count;
          item.kind = element.features.kind;
          item.subKind = element.features.subkind;

          items.push(item);
        });
      }

      commit('setItems', items);
    },
    deleteOrder: async ({ commit }, id) => {
      let result = false;
      let resp = await httpHandler.sendRequest(`${GET_ORDERS}/${id}`, 'DELETE');

      if (resp.status === 204) {
        result = true;
      }

      commit('setStatus', result);
    }
  },
  getters: {
    /**
     * get orderById
     */
    getOrderById: state => {
      return state.orderById;
    },
    /**
     * get orders
     */
    getOrders: state => {
      return state.orders;
    },
    /**
     * get receivers
     */
    getReceivers: state => {
      return state.receivers;
    },
    /**
     * get total number of orders
     */
    orderCount: state => {
      return state.orderCount;
    },

    /**
     * get total number of payment
     */
    submittedCount: state => {
      return state.submittedCount;
    },

    /**
     * get total number of mail
     */
    paidCount: state => {
      return state.paidCount;
    },

    /**
     * get total number of mailed
     */
    mailedCount: state => {
      return state.mailedCount;
    },

    /**
     * get total number of complete
     */
    completeCount: state => {
      return state.completeCount;
    },

    /**
     * get total number of closed
     */
    closedCount: state => {
      return state.closedCount;
    },

    /**
     * get items
     */
    getItems: state => {
      return state.items;
    },
    getStatus: state => {
      return state.status;
    }
  }
};

export default Order;
