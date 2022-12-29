import Vue from 'vue';
import Vuex from 'vuex';

import Dashboard from './modules/dashboard';
import Collections from './modules/collections';
import Item from './modules/items';
import AllItemList from './modules/items/list';
import Brand from './modules/items/brand';

import Audit from './modules/items/audit';
import Users from './modules/users/index';
import Order from './modules/orders';
import Notification from './modules/notifications';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Dashboard,
    Collections,
    Item,
    AllItemList,
    Brand,
    Audit,
    Users,
    Order,
    Notification
  }
});

export default store;
