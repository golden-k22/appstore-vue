<template>
  <div class="users-title_block Users-setting">
    <el-row class="top">
      <!--Title-->
      <div class="users-product-page-title">
        <label class="users-product-page-point">&#8226;</label>
        <label style="font-size:28px;">收货地址</label>
      </div>
    </el-row>

    <!--Address list table-->
    <el-table :data="AddressListData" border class="users-table-cursor3">
      <!--Name column-->
      <el-table-column prop="name" label="姓名 " width="200" align="center"></el-table-column>
      <!--phonenumber column-->
      <el-table-column prop="phone" label="手机号码 " width="200" align="center"></el-table-column>
      <!--address city column-->
      <el-table-column prop="address" label="详细地址 " align="center"></el-table-column>
      <!--post code column-->
      <el-table-column label="邮政编码 " width="150" align="center">345064</el-table-column>

      <!--address type button column-->
      <el-table-column prop="default" label="默认地址" width="150" align="center">
        <!--Action-->
        <template slot-scope="scope">
          <span
            align="center"
            :class="scope.row.default? 'el-icon-success users-icon-setting':'Users-status-false'"
          ></span>
        </template>
        <!--Confirm end-->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      AddressListData: []
    };
  },
  computed: {
    /*  get List data of Address information */
    AddressListInformation: function() {
      return this.$store.getters["Users/AddressListData"];
    }
  },
  async created() {
    let id = this.$route.params["userId"];

    await this.$store.dispatch("Users/getAddressListData", id);

    for (let i = 0; i < this.AddressListInformation.length; i++) {
      await this.$store.dispatch(
        "Users/getUserById",
        this.AddressListInformation[i].user
      );
      this.AddressListData.push({
        name: this.$store.getters["Users/userById"].name,
        phone: this.AddressListInformation[i].phone,
        address: this.AddressListInformation[i].address,
        postCode: this.AddressListInformation[i].postCode,
        default: this.AddressListInformation[i].default
      });
    }
  }
};
</script>


<!-- Add attribute to limit CSS to this component only -->
<style >
/* title style */
.users-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  text-decoration-color: blue;
  margin-bottom: 50px;
  margin-top: 20px;
}
.users-product-page-point {
  color: blue;
}
.users-title_block {
  display: block;
  border: 1px solid #fff;
  border-radius: 4px;
  margin-left: 15px;
  width: 96%;
  background-color: #fff;
}
/* font size setting */
.users-font {
  font-size: 16px;
}
/** table cursor */
.users-table-cursor3 {
  width: 100%;
  background-color: lightgray;
}
.Users-setting {
  width: 98%;
}

.users-table-cursor3 .el-table {
  background-color: white;
  border: 0px;
  margin-bottom: 20px;
}
.users-table-cursor3 .el-table th {
  border: 0px;
  border-bottom: 0px;
}

.users-table-cursor3 .el-table__row {
  background-color: lightgray;
}
.users-icon-setting {
  color: darkgreen;
  zoom: 1.5;
}

.Users-status-false {
  visibility: hidden;
}
</style>


