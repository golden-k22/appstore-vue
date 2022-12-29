import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Dashboard from '../pages/dashboard';
import UserList from '../pages/users/AllUser';
import UserInfo from '../pages/users/alluser/UserInfo';
import EditUserInfo from '../pages/users/EditInfo';
import AddressList from '../pages/users/EditInfo/AddressList';
import OrderRecord from '../pages/users/EditInfo/OrderRecord';
import OrderDetail from '../pages/users/EditInfo/OrderInfo';
import TransactionRecord from '../pages/users/EditInfo/TransactionRecord';
import BrandList from '../pages/items/brand/BrandList';
import NewBrand from '../pages/items/brand/NewBrand';
import AllItemList from '../pages/items/list/AllItemListPage';
import AuditList from '../pages/items/audit/ItemAudit';
import EditItem from '../pages/items/itemEdit';
import OrderList from '../pages/orders/OrderList';
import OrdersDetail from '../pages/orders/OrderDetail';
import CollectionList from '../pages/collections/CollectionList';
import Collection from '../pages/collections/Collection';
//import NewCollection from '../pages/collections/NewCollection';
import LogIn from '../pages/users/alluser/LogIn.vue';
import FollowProduct from '../pages/users/EditInfo/FollowProduct';
import FollowUser from '../pages/users/EditInfo/FollowUser';
import SystemPushList from '../pages/notifications/SystemPushList';
//import NewPush from '../pages/notifications/NewPush';
import EditPush from '../pages/notifications/EditPush';
import ReportPage from '../pages/users/ReportPage';
import IOSPushList from '../pages/notifications/IOSPushList';
import Review from '../pages/items/list/ReviewPage.vue';

Vue.use(Router);
// default container
const Container = {
  template: `
  <router-view></router-view>
  `
};

export default new Router({
  routes: [
    /* dashboard */
    {
      path: '/',
      component: Dashboard,
      meta: {
        breadcrumb: '待处理事务'
      }
    },
    {
      path: '/login',
      component: LogIn,
      meta: {
        breadcrumb: '登陆'
      }
    },
    /* user management */
    {
      path: '/users',
      component: Container,
      meta: {
        breadcrumb: '收货管理'
      },
      children: [
        /* all user list */
        {
          path: 'userlist',
          component: UserList,
          meta: {
            breadcrumb: '收货列表'
          }
        },
        {
          path: 'reportpage',
          component: ReportPage,
          meta: {
            breadcrumb: '报告用户'
          }
        },
        {
          path: ':userId',
          component: Container,
          meta: {
            breadcrumb: '收货'
          },
          children: [
            /* user detail */
            {
              path: '',
              component: UserInfo,
              meta: {
                breadcrumb: '收货地址'
              }
            },
            {
              path: 'followuser',
              component: FollowUser,
              meta: {
                breadcrumb: '收藏用户'
              }
            },
            {
              path: 'followproduct',
              component: FollowProduct,
              meta: {
                breadcrumb: '收藏商品'
              }
            },
            /* address list */
            {
              path: 'address',
              component: AddressList,
              meta: {
                breadcrumb: '收货地址'
              }
            },
            /* order record of a user */
            {
              path: 'orders',
              component: Container,
              meta: {
                breadcrumb: '订单管理'
              },
              children: [
                /* order list */
                {
                  path: '',
                  component: OrderRecord,
                  meta: {
                    breadcrumb: '订单记录'
                  }
                },
                /* order info */
                {
                  path: ':orderId',
                  component: OrderDetail,
                  meta: {
                    breadcrumb: '订单详情'
                  }
                }
              ]
            },
            /* transaction record */
            {
              path: 'transaction',
              component: TransactionRecord,
              meta: {
                breadcrumb: '业务情报'
              }
            },
            /* edit user info */
            {
              path: 'edit',
              component: EditUserInfo,
              meta: {
                breadcrumb: '编辑情报'
              }
            }
          ]
        }
      ]
    },
    /* item management */
    {
      path: '/items',
      component: Container,
      meta: {
        breadcrumb: '商品管理'
      },
      children: [
        /* all items */
        {
          path: 'all',
          component: AllItemList,
          meta: {
            breadcrumb: '商品列表'
          }
        },
        {
          path: 'review',
          component: Review,
          meta: {
            breadcrumb: '述评'
          }
        },
        /* brands */
        {
          path: 'brands',
          component: Container,
          meta: {
            breadcrumb: '品牌管理'
          },
          children: [
            /* brand list */
            {
              path: '',
              component: BrandList,
              meta: {
                breadcrumb: '品牌管理页'
              }
            },
            /* new brand */
            {
              path: 'new',
              component: NewBrand,
              meta: {
                breadcrumb: '新品牌'
              }
            }
          ]
        },
        /* audit items */
        {
          path: 'audit',
          component: Container,
          meta: {
            breadcrumb: '审核管理'
          },
          children: [
            /* all audit list */
            {
              path: '',
              component: AuditList,
              meta: {
                breadcrumb: '商品审核页'
              }
            },
            {
              path: ':itemId',
              component: Container,
              children: [
                /* edit item */
                {
                  path: 'edit',
                  component: EditItem
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/HelloWorld',
      component: HelloWorld
    },
    /* order management */
    {
      path: '/orders',
      component: Container,
      meta: {
        breadcrumb: '订单管理'
      },
      children: [
        /* order list */
        {
          path: '',
          component: OrderList,
          meta: {
            breadcrumb: '订单列表'
          }
        },
        /* order detail */
        {
          path: ':orderId',
          component: OrdersDetail,
          meta: {
            breadcrumb: '订单详情'
          }
        }
      ]
    },
    /* notification management */
    {
      path: '/businesses',
      component: Container,
      meta: {
        breadcrumb: '推送管理'
      },
      children: [
        /* System Push list */
        {
          path: 'systempush',
          component: Container,
          meta: {
            breadcrumb: '后台创建列表'
          },
          children: [
            {
              path: '',
              component: SystemPushList
              /*  meta: {
                breadcrumb: '后台创建列表'
              } */
            },

            /* edit notification */
            {
              path: ':pushId',
              component: EditPush,
              meta: {
                breadcrumb: '修改推送'
              }
            }
          ]
        },
        /* IOS Push List */
        {
          path: 'iospush',
          component: IOSPushList,
          meta: {
            breadcrumb: '客户端创建列表'
          }
        },
        /* new notification */
        {
          path: 'newpush',
          component: EditPush,
          meta: {
            breadcrumb: '创建推送'
          }
        }
      ]
    },
    /* collection management */
    {
      path: '/collections',
      component: Container,
      meta: {
        breadcrumb: '合辑管理'
      },
      children: [
        /* collection list */
        {
          path: '',
          component: CollectionList,
          meta: {
            breadcrumb: '合辑列表'
          }
        },
        /* new Collection */
        {
          path: 'newcollection',
          component: Collection,
          meta: {
            breadcrumb: '发布专题'
          }
        },
        /* collection detail */
        {
          path: ':collectionId',
          component: Collection,
          meta: {
            breadcrumb: '发布专题'
          }
        }
      ]
    }
  ]
});
