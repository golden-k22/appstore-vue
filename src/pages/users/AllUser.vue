<template>
  <div>
    <div class="aul-body">
      <el-row>
        <!--Title-->
        <div class="aul-title">
          <label class="aul-title-point">&#8226;</label>
          <label class="aul-title-text">用户信息</label>
        </div>
      </el-row>
      <div
        v-loading="loadingState"
        element-loading-text="Loading..."
        element-loading-background="rgba(240, 240, 240, 0.8)"
      >
        <el-table :data="tableData" :row-class-name="tableRowColor">
          <!--photo column-->
          <el-table-column label="用户头像 " align="center">
            <template slot-scope="scope">
              <img :src="scope.row.photo" class="aul-table-image">
            </template>
          </el-table-column>
          <!--name column-->
          <el-table-column prop="name" label="用户昵称 " align="center"></el-table-column>
          <!--gender column-->
          <el-table-column prop="gender" label="用户性别 " align="center"></el-table-column>
          <!--birthday column-->
          <!-- <el-table-column prop="birthday" label="生日 " align="center"></el-table-column> -->
          <!--city column-->
          <el-table-column prop="city" label="城市 " align="center">
            <template slot-scope="scope">
              <div>
                <label>{{scope.row.province}}</label>
                <br>
                <label>{{scope.row.city}}</label>
              </div>
            </template>
          </el-table-column>
          <!--phonenumber column-->
          <el-table-column prop="phone" label="电话 " align="center"></el-table-column>
          <!--wechat column-->
          <el-table-column prop="sellLevel" label="用户等级" align="center"></el-table-column>
          <!--hobbies column-->
          <el-table-column prop="active" label="账户状态 " align="center"></el-table-column>
          <!--Button column-->
          <el-table-column label="操作 " align="center" width="150">
            <template slot-scope="scope">
              <div>
                <div>
                  <Button @click="edit(scope.row.id)" class="aul-btn-edit">编制</Button>
                  <Button @click="info(scope.row.id)" class="aul-btn-info">详细</Button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="aul-pagenation">
          <el-pagination
            :total="pagination.total"
            :pager-count="5"
            :page-size="pagination.size"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserManager from "../../manager/UserManager";

export default {
  watch: {
    currentPage: async function(value) {
      this.pagination.currentPage = value;
      await this.setTableData(
        this.pagination.currentPage,
        this.pagination.size
      );
    }
  },
  async created() {
    await this.$store.dispatch("Users/getUserCount");
    this.pagination.total = this.$store.getters["Users/userCount"];
    await this.setTableData(this.pagination.currentPage, this.pagination.size);
  },
  data() {
    return {
      userManager: new UserManager(),
      //displaying data of table
      tableData: [],
      currentPage: 1,
      pagination: {
        currentPage: 1,
        size: 10,
        total: 0
      },

      loadingState: true
    };
  },
  methods: {
    /***
     * Setting the row background color of table.
     */
    tableRowColor({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "aul-gray-row";
      }
      return "";
    },
    handleCurrentChange(page) {
      this.pagination.current = page;
    },
    /***
     * Getting the table data.
     */
    async setTableData(currentPage, size) {
      this.loadingState = true;
      let res = [];
      let info = [currentPage, size];

      await this.$store.dispatch("Users/getUserList", info);
      let data = this.$store.getters["Users/userList"];

      for (let i in data) {
        res.push({
          id: data[i].id,
          photo: data[i].photo,
          name: data[i].name,
          gender: this.userManager.getGender(Number(data[i].gender)),
          province: await this.getProvince(data[i].province),
          city: await this.getCity(data[i].province, data[i].city),
          phone: data[i].phone,
          hobbies: this.userManager.getDisplayHobbies(data[i].hobbies),
          sellLevel: this.userManager.getSellLevel(data[i].grade),
          active: this.getAccountState(data[i].active)
        });
      }

      this.tableData = res;
      if (res.length !== 0) {
        this.loadingState = false;
      }
    },
    getAccountState(active) {
      if (active) {
        return " 活跃中";
      }
      return "封锁账户";
    },
    /***
     * Getting the city name.
     */
    async getCity(province, city) {
      let info = [province, city];

      await this.$store.dispatch("Users/getCityByCode", info);

      let data = this.$store.getters["Users/cityByCode"];

      return data.name;
    },
    async getProvince(code) {
      await this.$store.dispatch("Users/getProvinceByCode", code);
      let data = this.$store.getters["Users/provinceByCode"];

      return data.name;
    },
    info(id) {
      this.$router.push(`/users/${id}`);
    },
    edit(id) {
      this.$router.push(`/users/${id}/edit`);
    }
  }
};
</script>
<style>
.aul-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  text-decoration-color: blue;
  margin-bottom: 50px;
  margin-top: 20px;
}
.aul-title-point {
  color: rgb(74, 74, 136);
}
.aul-title-text {
  font-size: 28px;
}
.aul-body {
  margin: auto;
  width: 99%;
  margin-left: 10px;
  display: block;
  border: 1px solid #fff;
  border-radius: 4px;
  font-weight: bold;
  background-color: #fff;
}
.Users-setting {
  width: 100%;
}
.Users-setting .el-table {
  background-color: white;
  border: 0px;
}
.Users-setting .el-table th {
  background-color: white;
  border: 0px;
}
.Users-setting .tr:nth-child(even) {
  background-color: lightgray;
}
.aul-btn-edit {
  background: rgb(88, 88, 236);
  border: 0px;
  border-radius: 5px;
  color: white;
  width: 60px;
  height: 30px;
  font-weight: bold;
}
.aul-btn-info {
  background: rgb(204, 58, 58);
  border: 0px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  width: 60px;
  height: 30px;
}
.aul-table-image {
  height: 30px;
  width: 30px;
  border-radius: 50%;
}
.el-table .aul-gray-row {
  background: rgb(200, 200, 200);
}
.aul-pagenation {
  padding-top: 10px;
  padding-bottom: 20px;
  text-align: center;
}
</style>
