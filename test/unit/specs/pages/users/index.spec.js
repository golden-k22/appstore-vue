import { shallowMount } from '@vue/test-utils';
import AllUser from '@/pages/users/AllUser';

describe('AllUser Page', () => {
  it('Computed property getUsers', () => {
    let mocks = {
      $store: {
        dispatch: function() {
          return true;
        },
        getters: {
          'Users/getUsers': [
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
        }
      }
    };
    let wrapper = shallowMount(AllUser, {
      mocks: mocks
    });
    let vm = wrapper.vm;

    expect(vm.tableData).to.equal([
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
});
