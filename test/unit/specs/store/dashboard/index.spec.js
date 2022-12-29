import moxios from 'moxios';
import { BASE_URL, GET_ITEMS } from '@/store/api';
import { HttpHander } from '@/util/HttpHandler';
import store from '@/store';

describe('VUEX module for dashboard', () => {
  beforeEach(() => {
    moxios.install(HttpHander);
  });

  afterEach(() => {
    moxios.uninstall(HttpHander);
  });

  it('Action: getItemCount, 200 OK', async () => {
    moxios.stubRequest(`${BASE_URL}${GET_ITEMS}`, {
      status: 200,
      responseText: [
        {
          id: 1,
          name: 'test item'
        }
      ]
    });
    await store.dispatch('Dashboard/getItemCount');

    expect(store.getters['Dashboard/itemCount']).to.equal(1);
  });

  it('Action: getItemCount, 500 Internal Server Error', async () => {
    moxios.stubRequest(`${BASE_URL}${GET_ITEMS}`, {
      status: 500
    });
    await store.dispatch('Dashboard/getItemCount');

    expect(store.getters['Dashboard/itemCount']).to.equal(0);
  });
});
