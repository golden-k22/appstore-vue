class UserManager {
  /***
   * Getting the gender.
   */
  getGender(num) {
    if (num === 0) {
      return '保密';
    }
    if (num === 1) {
      return '男';
    }
    if (num === 2) {
      return '女';
    }
    return '';
  }
  getHobbies(numList) {
    let list = [];

    for (let i in numList) {
      let hobby = '';

      if (Number(numList[i]) === 0) {
        hobby = 'sports';
      }
      if (Number(numList[i]) === 1) {
        hobby = 'art';
      }
      if (Number(numList[i]) === 2) {
        hobby = 'fashion';
      }
      if (Number(numList[i]) === 3) {
        hobby = 'dance';
      }
      if (Number(numList[i]) === 4) {
        hobby = 'sing';
      }
      if (Number(numList[i]) === 5) {
        hobby = 'draw';
      }

      list.push(hobby);
    }

    return list;
  }
  getDisplayHobbies(numList) {
    let list = this.getHobbies(numList);
    let str = '';

    for (let i in list) {
      let hobby = list[i];

      str += hobby + ', ';
    }
    let tmp = str.slice(0, str.length - 2);

    str = tmp;

    return str;
  }
  getDate(time) {
    let date = new Date(time);

    return (
      Number(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '-' +
      date.getFullYear()
    );
  }
  getPayMode(mode) {
    if (mode === 0) {
      return '未支付';
    }
    if (mode === 1) {
      return '支付宝';
    }
    if (mode === 2) {
      return '微信';
    }
  }
  getOrderStatus(status) {
    if (status === 0) {
      return '待付款';
    }
    if (status === 1) {
      return '待发货';
    }
    if (status === 2) {
      return '已发货';
    }
    if (status === 3) {
      return '已完成';
    }
    if (status === 4) {
      return '已关闭 ';
    }
    if (status === 5) {
      return '无效订单';
    }
  }
  getSellLevel(id) {
    if (id === 0) {
      return 'normal';
    }
    if (id === 1) {
      return 'bronze';
    }
    if (id === 2) {
      return 'silver';
    }
    if (id === 3) {
      return 'golden';
    }
    if (id === 4) {
      return 'diamond';
    }
  }
}
export default UserManager;
