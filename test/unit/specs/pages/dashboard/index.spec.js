import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/pages/dashboard';

describe('Dashboard Page', () => {
  it('Computed property itemCount', () => {
    let mocks = {
      $store: {
        dispatch: function() {
          return true;
        },
        getters: {
          'Dashboard/itemCount': 200
        }
      }
    };
    let wrapper = shallowMount(Dashboard, {
      mocks: mocks
    });
    let vm = wrapper.vm;

    expect(vm.itemCount).to.equal(200);
  });
});
