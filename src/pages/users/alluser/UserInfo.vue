<template>
  <div class="userInfo">
    <div class="users_border">
      <div style="padding-bottom:30px;">
        <!--Title-->
        <div class="users-product-page-title">
          <label class="users-product-page-point">&#8226;</label>
          <label style="font-size:28px;">用户信息</label>
        </div>
        <div class="row">
          <div class="col-md-12">
            <el-button
              type="primary"
              round
              class="user-info-label-margin"
              @click="followNum"
            >收藏({{followNumber}})</el-button>
            <el-button
              type="primary"
              round
              class="user-info-label-margin"
              @click="followPro"
            >关注({{followProNum}})</el-button>
          </div>
        </div>
        <div>
          <div>
            <p class="user-info-p">用户详情</p>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="user-info-image-padding">
                <img :src="userData.photo" class="user-info-img user-info-image-round">
              </div>
              <div>
                <el-button type="primary" round class="user-info-button-interv" @click="order">TA的订单</el-button>
                <el-button type="primary" round @click="transaction">TA的交易</el-button>
              </div>
              <div class="user-info-button-padding">
                <el-button
                  type="primary"
                  round
                  class="user-info-button-interv"
                  @click="address"
                >TA的地址</el-button>
                <el-button
                  type="primary"
                  round
                  @click="back"
                >&nbsp;&nbsp;&nbsp;返&nbsp;&nbsp;回&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </div>
            </div>
            <div class="col-6 user-info-input-width user-info-input-back">
              <div class="row">
                <el-form :inline="true" class="user-info-subtitle" :model="userData">
                  <el-form-item label>
                    <label>用户昵称:</label>
                  </el-form-item>
                  <el-form-item label prop="name">
                    <el-input v-model="userData.name" :disabled="true"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="row">
                <el-form :inline="true" class="user-info-subtitle" :model="userData">
                  <el-form-item label>
                    <label>用户性别:</label>
                  </el-form-item>
                  <el-form-item label>
                    <el-input v-model="userData.gender" :disabled="true" prop="gender"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="row">
                <el-form :inline="true" class="user-info-subtitle" :model="userData">
                  <el-form-item label class="user-info-text-padding">
                    <label>城市:</label>
                  </el-form-item>
                  <el-form-item label>
                    <el-input v-model="userData.city" :disabled="true" prop="city"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="row">
                <el-form :inline="true" class="user-info-subtitle" :model="userData">
                  <el-form-item label class="user-info-text-padding">
                    <label>电话:</label>
                  </el-form-item>
                  <el-form-item label>
                    <el-input v-model="userData.phone" :disabled="true" prop="phone"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="row">
                <el-form :inline="true" class="user-info-subtitle" :model="userData">
                  <el-form-item label>
                    <label>账户状态:</label>
                  </el-form-item>
                  <el-form-item label>
                    <el-input v-model="userData.accountState" :disabled="true" prop="loveItem"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="row">
                <el-form :inline="true" class="user-info-subtitle" :model="userData">
                  <el-form-item label class="user-info-pocket">
                    <label>钱包:</label>
                  </el-form-item>
                  <el-form-item label>
                    <el-input v-model="userData.pocketMoney" :disabled="true" prop="pocketMoney"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserManager from "../../../manager/UserManager";

export default {
  computed: {
    followNumber: function() {
      return this.$store.getters["Users/followUserCount"];
    },
    followProNum: function() {
      return this.$store.getters["Users/followProductCount"];
    }
  },
  data() {
    return {
      userManager: new UserManager(),
      userData: {}
    };
  },
  methods: {
    order() {
      this.$router.push(`/users/${this.$route.params.userId}/orders`);
    },
    transaction() {
      this.$router.push(`/users/${this.$route.params.userId}/transaction`);
    },
    address() {
      this.$router.push(`/users/${this.$route.params.userId}/address`);
    },
    back() {
      this.$router.push(`/users/userList`);
    },
    edit() {
      this.$router.push(`/users/${this.$route.params.userId}/edit`);
    },
    followNum() {
      this.$router.push({
        path: `/users/${this.$route.params.userId}/followuser`
      });
    },
    followPro() {
      this.$router.push({
        path: `/users/${this.$route.params.userId}/followproduct`
      });
    },
    async getCity(province, city) {
      let info = [province, city];

      await this.$store.dispatch("Users/getCityByCode", info);
      let data = this.$store.getters["Users/cityByCode"];

      return data.name;
    },
    getAccountState(active) {
      if (active) {
        return " 活跃中";
      }
      return "封锁账户";
    }
  },
  async created() {
    let userId = this.$route.params["userId"];

    await this.$store.dispatch("Users/getUserById", userId);
    let data = this.$store.getters["Users/userById"];

    this.userData = {
      name: data.name,
      gender: this.userManager.getGender(data.gender),
      phone: data.phone,
      loveItem: this.userManager.getDisplayHobbies(data.hobbies),
      photo: data.photo,
      city: await this.getCity(data.province, data.city),
      pocketMoney: "$" + data.wallets,
      accountState: this.getAccountState(data.active)
    };
    await this.$store.dispatch("Users/getFollowUserCount", userId);
    await this.$store.dispatch("Users/getFollowProductCount", userId);
  }
};
</script>
<style>
.user-info-button-padding {
  padding-top: 10px;
}
.user-info-label-margin {
  margin-right: 30px;
  float: right;
}
.user-info-input-back .el-input.is-disabled .el-input__inner {
  color: black;
  background-color: white;
}
.user-info-p {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
}
.user-info-subtitle {
  float: left;
  text-align: left;
}
.user-info-text-padding {
  padding-right: 30px;
}
.user-info-input-width .el-input__inner {
  width: 260px;
}
.user-info-input-width-1 .el-input__inner {
  margin-top: 10px;
  width: 340px;
}
.user-info-select-width .el-input__inner {
  width: 110px;
}
.user-info-text-color {
  color: mediumturquoise;
}
.user-info-text-top {
  padding-top: 28px;
}
.user-info-button-interv {
  margin-right: 20px;
}
.user-info-img {
  width: 250px;
  height: 250px;
}
.user-info-image-padding {
  padding-bottom: 20px;
  padding-top: 0px;
}
.user-info-image-round {
  border-radius: 300px;
}
/* title style */
.users-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
}
.users-product-page-point {
  color: blue;
}
.user_image {
  width: 300px;
  background-color: #eee;
}
.users_border {
  background-color: white;
  border: solid white;
  margin: 25px;
}
.user_property {
  text-align: right;
  padding-right: 15px;
  width: 120px;
  background-color: #e5e5e5;
}

.userInfo {
  text-align: center;
}
.user-info-pocket {
  padding-right: 20px;
}
</style>
