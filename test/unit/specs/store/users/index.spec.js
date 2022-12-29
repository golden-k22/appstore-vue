import moxios from 'moxios';
import { BASE_URL, GET_USERS } from '@/store/api';
import { HttpHander } from '@/util/HttpHandler';
import store from '@/store';

describe('VUEX module for users', () => {
  beforeEach(() => {
    moxios.install(HttpHander);
  });

  afterEach(() => {
    moxios.uninstall(HttpHander);
  });

  it('Action: getUsersFromDB, 200 OK', async () => {
    moxios.stubRequest(`${BASE_URL}${GET_USERS}`, {
      status: 200,
      responseText: [
        {
          userName: 'a',
          nickName: 'aa',
          seller: 'aaa',
          monetory: 'A',
          accountState: 'normal',
          registerDate: '2020-02-01'
        },
        {
          userName: 'b',
          nickName: 'bb',
          seller: 'bbb',
          monetory: 'B',
          accountState: 'normal',
          registerDate: '2020-02-03'
        },
        {
          userName: 'c',
          nickName: 'cc',
          seller: 'ccc',
          monetory: 'C',
          accountState: 'normal',
          registerDate: '2020-02-04'
        },
        {
          userName: 'd',
          nickName: 'dd',
          seller: 'ddd',
          monetory: 'D',
          accountState: 'normal',
          registerDate: '2020-02-05'
        },
        {
          userName: 'e',
          nickName: 'ee',
          seller: 'eee',
          monetory: 'E',
          accountState: 'normal',
          registerDate: '2020-02-06'
        }
      ]
    });
    await store.dispatch('Users/getUsersFromDB');

    expect(store.getters['Users/getUsers']).to.equal([
      {
        userName: 'a',
        nickName: 'aa',
        seller: 'aaa',
        monetory: 'A',
        accountState: 'normal',
        registerDate: '2020-02-01'
      },
      {
        userName: 'b',
        nickName: 'bb',
        seller: 'bbb',
        monetory: 'B',
        accountState: 'normal',
        registerDate: '2020-02-03'
      },
      {
        userName: 'c',
        nickName: 'cc',
        seller: 'ccc',
        monetory: 'C',
        accountState: 'normal',
        registerDate: '2020-02-04'
      },
      {
        userName: 'd',
        nickName: 'dd',
        seller: 'ddd',
        monetory: 'D',
        accountState: 'normal',
        registerDate: '2020-02-05'
      },
      {
        userName: 'e',
        nickName: 'ee',
        seller: 'eee',
        monetory: 'E',
        accountState: 'normal',
        registerDate: '2020-02-06'
      }
    ]);
  });

  it('Action: getUsersFromDB, 500 Internal Server Error', async () => {
    moxios.stubRequest(`${BASE_URL}${GET_USERS}`, {
      status: 500
    });
    await store.dispatch('Users/getUsersFromDB');

    expect(store.getters['Users/getUsers']).to.equal([]);
  });
});
