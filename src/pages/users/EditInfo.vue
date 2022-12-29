<template>
  <div class="container-fluid">
    <el-row class="users-fontsetting">
      <el-col>
        <!-- license page block -->
        <div class="users-title_block">
          <div class="users-product-page-title">
            <label class="users-product-page-point">&#8226;</label>
            <label style="font-size:28px;">编辑用户信息</label>
          </div>
          <el-form
            :model="userList"
            :rules="rules"
            label-position="right"
            ref="EditInfoList"
            label-width="150px"
            class="demo-ruleForm users-fontsetting"
          >
            <!-- User name -->
            <el-form-item label="用户帐号:" prop="name">
              <input v-model="userList.name" class="users-input-size">
            </el-form-item>
            <!-- Phone number -->
            <el-form-item label="手机号码:" prop="phoneNumber">
              <input v-model="userList.phoneNumber" class="users-input-size">
            </el-form-item>
            <!-- Member degree -->
            <el-form-item label="会员等级:" prop="memberGrade">
              <div class="form-group">
                <div>
                  <select
                    id="Memberdegree"
                    v-model="userList.memberGrade"
                    class="form-control users-select-size"
                  >
                    <option value="0">普通会员</option>
                    <option value="1">青铜会员</option>
                    <option value="2">银卡会员</option>
                    <option value="3">黄金会员</option>
                    <option value="4">钻石会员</option>
                  </select>
                </div>
              </div>
            </el-form-item>
            <!-- Gender -->
            <el-form-item label="性别 :" prop="gender">
              <el-radio-group v-model="userList.gender" class="users-radio-setting">
                <el-radio :label="0" class="users-radio-size">保密</el-radio>
                <el-radio :label="1" class="users-radio-size">男</el-radio>
                <el-radio :label="2" class="users-radio-size">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- Register date -->
            <el-form-item label="注册时间:" prop="registrationDate">
              <el-date-picker
                v-model="userList.registrationDate"
                class="users-datePicker-size"
                type="date"
                placeholder="Pick a day"
              ></el-date-picker>
            </el-form-item>
            <!-- City select -->
            <el-form-item label="城市:">
              <!-- <div class="form-group"> -->
              <div>
                <el-select v-model="provinceCode" class="users-city-size">
                  <el-option
                    v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
                <el-select v-model="cityCode" class="users-city-size">
                  <el-option
                    v-for="(item, index) in cityList"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>

            <!-- New password -->
            <el-form-item label="新密码:" prop="newPassword">
              <input v-model="userList.newPassword" class="users-input-size">
            </el-form-item>
            <!-- Password  hint-->
            <el-form-item label="确认密码:" prop="hint">
              <input v-model="userList.hint" class="users-input-size">
            </el-form-item>
            <!-- Account status -->
            <el-form-item label="账户状态:" prop="accountState">
              <el-form :inline="true">
                <el-form-item label>
                  <label>封锁账户</label>
                </el-form-item>
                <el-form-item label class="uep-switch">
                  <el-switch
                    v-model="userList.accountState"
                    class="users-swith-setting"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </el-form-item>
                <el-form-item label>
                  <label>活跃中</label>
                </el-form-item>
              </el-form>
            </el-form-item>
            <!--  license generate button -->
            <el-form-item>
              <el-button class="users-button_setting" type="primary" @click="updateEvent()">Submit</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import UserManager from "../../manager/UserManager";

export default {
  data() {
    return {
      userManager: new UserManager(),
      userList: {
        name: "",
        phoneNumber: "",
        memberGrade: "",
        gender: "",
        registrationDate: "",
        province: "",
        city: "",
        newPassword: "",
        hint: "",
        accountState: false
      },
      provinceCode: "",
      cityCode: "",
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名子",
            trigger: "blur"
          }
        ],
        registrationDate: [
          {
            required: true,
            message: "请输入注册时间子",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    cityCode: function(val) {
      this.userList.city = val;
    },
    provinceCode: async function(newVal) {
      if (this.getProvinceTest(newVal)) {
        await this.$store.dispatch("Users/getCities", newVal);
      }
      if (this.userList.province !== newVal && this.cityList.length !== 0) {
        this.cityCode = this.cityList[0].code;
      }
      this.userList.province = newVal;
    }
  },
  computed: {
    provinceList: function() {
      return this.$store.getters["Users/provinces"];
    },
    cityList: function() {
      if (this.getProvinceTest(this.provinceCode)) {
        return this.$store.getters["Users/cities"];
      }
      return [];
    }
  },
  async created() {
    let userId = this.$route.params["userId"];

    await this.$store.dispatch("Users/getUserById", userId);
    await this.$store.dispatch("Users/getProvinces");
    let data = this.$store.getters["Users/userById"];

    this.userList = {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      memberGrade: data.grade,
      gender: data.gender,
      registrationDate: this.userManager.getDate(data.registered),
      province: data.province,
      city: data.city,
      county: data.county,
      newPassword: "",
      hint: "",
      accountState: data.active
    };
    this.cityCode = this.userList.city;
    this.provinceCode = this.userList.province;
    if (this.userList.province === this.userList.city) {
      this.cityCode = "";
      //this.userList.city = "";
    }
    if (this.getProvinceError(this.userList.province)) {
      this.provinceCode = "";
    }
    if (await this.getCityError(this.userList.city)) {
      this.cityCode = "";
    }
  },
  methods: {
    async getCityError(code) {
      let state = true;

      if (this.provinceCode !== "") {
        await this.$store.dispatch("Users/getCities", this.provinceCode);
      }
      for (let i in this.cityList) {
        if (code === this.cityList[i].code) {
          state = false;
          break;
        }
      }

      return state;
    },
    getProvinceTest(code) {
      let res = true;

      for (let i in this.provinceList) {
        if (this.provinceList[i].name === "香港特别行政区") {
          if (this.provinceList[i].code === code) {
            res = false;
            break;
          }
        }
        if (this.provinceList[i].name === "澳门特别行政区") {
          if (this.provinceList[i].code === code) {
            res = false;
            break;
          }
        }
        if (this.provinceList[i].name === "台湾省") {
          if (this.provinceList[i].code === code) {
            res = false;
            break;
          }
        }
      }
      return res;
    },
    getProvinceError(code) {
      let state = true;

      for (let i in this.provinceList) {
        if (code === this.provinceList[i].code) {
          state = false;
          break;
        }
      }
      return state;
    },
    async updateEvent() {
      this.$refs["EditInfoList"].validate(async valid => {
        if (valid) {
          let updateList = {
            id: this.userList.id,
            editable: {
              name: this.userList.name,
              gender: this.userList.gender,
              province: this.userList.province,
              city: this.userList.city,
              county: this.userList.county,
              phone: this.userList.phoneNumber,
              grade: this.userList.memberGrade,
              registered: new Date(this.userList.registrationDate).getTime(),
              active: this.userList.accountState
            },
            password: {
              hash: this.userList.newPassword,
              hint: this.userList.hint
            }
          };

          if (updateList.editable.county === 0) {
            updateList.editable.county = 1;
          }

          for (let i in this.provinceList) {
            if (this.provinceList[i].name === "香港特别行政区") {
              if (this.provinceList[i].code === updateList.editable.province) {
                updateList.editable.city = updateList.editable.province;
                break;
              }
            }
            if (this.provinceList[i].name === "澳门特别行政区") {
              if (this.provinceList[i].code === updateList.editable.province) {
                updateList.editable.city = updateList.editable.province;
                break;
              }
            }
            if (this.provinceList[i].name === "台湾省") {
              if (this.provinceList[i].code === updateList.editable.province) {
                updateList.editable.city = updateList.editable.province;
                break;
              }
            }
          }
          if (updateList.editable.province === "") {
            this.$message({
              message: "城市请求!",
              type: "error"
            });
            return;
          }
          if (updateList.editable.city === "") {
            this.$message({
              message: "城市请求!",
              type: "error"
            });
            return;
          }
          let info = [updateList, updateList.id];
          let resp = await this.$store.dispatch("Users/putUserInfoById", info);

          if (resp === 0) {
            this.$message({
              message: "网络错误!",
              type: "error"
            });
          }
          if (resp === 1) {
            this.$message({
              message: "成功!",
              type: "success"
            });
            this.$router.push({ path: "/users/userlist" });
          }
          if (resp === 2) {
            this.$message({
              message: "错误请求!",
              type: "error"
            });
          }
          if (resp === 3) {
            this.$message({
              message: "没有找到!",
              type: "error"
            });
          }
        }
      });
    }
  }
};
</script>
<style >
.users-title_block {
  display: block;

  border: 1px solid #fff;
  border-radius: 4px;
  margin-left: 15px;
  width: 96%;
  background-color: #fff;
}
.users-button_setting {
  position: relative;
  float: right;
  margin-right: 10%;
  background: #21d179;
}
.users-label_title {
  padding-left: 15px;
  font-size: 24pt;
}
.users-fontsetting {
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
}

.users-input-size {
  width: 90%;
  float: left;
  padding-left: 12px;
  line-height: 200%;
}
.users-datePicker-size {
  width: 100%;
  float: left;
  line-height: 200%;
}
.users-radio-setting {
  float: left;
  margin-top: 10px;
}
.users-radio-size {
  margin-right: 60px;
  margin-left: 10px;
  font-weight: bold;
}
.users-swith-setting {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
}
.users-select-size {
  margin-top: 10px;
  width: 90%;
  float: left;
  height: 300%;
}
.users-city-size {
  width: 44%;
  float: left;
  line-height: 200%;
  margin-right: 2%;
}
.uep-switch .users-swith-setting {
  margin-left: 0px;
}
</style>
