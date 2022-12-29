<template>
  <div class="users-title_block Users-setting">
    <el-row class="top">
      <!--Title-->
      <div class="users-product-page-title">
        <label class="users-product-page-point">&#8226;</label>
        <label style="font-size:28px;">订单记录</label>
      </div>
    </el-row>
    <!--Products table-->
    <el-table :data="displayOrder" class="users-table-cursor1">
      <!--Order Num column-->
      <el-table-column prop="orderNo" label="订单编号 " align="center"></el-table-column>
      <!--Submit date column-->
      <el-table-column prop="submittedTime" label="提交时间  " align="center"></el-table-column>
      <!--User name column-->
      <el-table-column prop="userName" label="用户账号  " align="center"></el-table-column>
      <!--Sum of order column-->
      <el-table-column prop="totalAmount" label="订单金额  " width="150" align="center"></el-table-column>

      <!--Payment way column-->
      <el-table-column prop="payMode" label="支付方式 " width="150" align="center"></el-table-column>

      <!--Order record column-->
      <el-table-column prop="status" label="订单状态  " width="120" align="center"></el-table-column>
      <!--Operation column-->
      <el-table-column label="操作  " width="120" align="center">
        <template slot-scope="scope">
          <!--Order info -->
          <el-button @click="get(scope.row.id)" align="center" class="user_record_button">
            <span>订单信息</span>
          </el-button>
        </template>

        <!--Confirm end-->
        <!--Confirm end-->
      </el-table-column>
    </el-table>
    <div class="uol-pagination">
      <el-pagination
        :total="pagination3.total"
        :pager-count="5"
        :page-size="pagination3.size"
        :current-page.sync="currentPage3"
        @current-change="handleCurrentChange3"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import UserManager from "../../../manager/UserManager";

export default {
  name: "OrderRecord",
  data() {
    return {
      userManager: new UserManager(),
      OrderRecordData: [],
      displayOrder: [],
      pagination3: {
        total: 0,
        size: 5,
        currentPage: 1
      },
      currentPage3: 1
    };
  },
  watch: {
    currentPage3: async function(newVal) {
      this.pagination3.currentPage = newVal;
      this.setDisplayOrder(newVal);
    }
  },
  async created() {
    let id = this.$route.params["userId"];

    await this.$store.dispatch("Users/getOrderInformation", id);
    let list = this.$store.getters["Users/OrderInformation"];
    let res = [];

    for (let i in list) {
      await this.$store.dispatch("Users/getUserById", list[i].user);
      res.push({
        id: list[i].user,
        orderNo: list[i].orderNo,
        submittedTime: this.userManager.getDate(list[i].submitted),
        userName: this.$store.getters["Users/userById"].name,
        totalAmount: list[i].amount,
        payMode: this.userManager.getPayMode(list[i].payment),
        status: this.userManager.getOrderStatus(list[i].status)
      });
      if (res[i].totalAmount === null) {
        res[i].totalAmount = "无";
      }
    }
    this.OrderRecordData = res;
    this.pagination3.total = res.length;
    this.setDisplayOrder(1);
  },
  methods: {
    handleCurrentChange3(page) {
      this.pagination3.currentPage = page;
    },
    setDisplayOrder(newVal) {
      this.displayOrder = [];
      let max = Math.min(
        this.pagination3.total - 1,
        newVal * this.pagination3.size - 1
      );
      let min = (newVal - 1) * this.pagination3.size;

      for (let i = min; i <= max; i++) {
        this.displayOrder.push(this.OrderRecordData[i]);
      }
    },
    /* When action button clilked, event doing. */
    async get(id) {
      this.$router.push({
        path: `/users/${this.$route.params["userId"]}/orders/${id}`
      });
    }
  }
};
</script>


<!-- Add attribute to limit CSS to this component only -->
<style >
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
/* title style */
.users-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 50px;
  margin-top: 20px;
}
/* font size setting */
.users-font {
  font-size: 16px;
}
/** table cursor */
.users-table-cursor1 {
  width: 100%;
}
.Users-setting {
  width: 98%;
}
.Users-setting .el-table tr {
  background-color: lightgray;
}
.user_record_button.el-button {
  background: lightgray;
  border: 0px;
  color: blue;
}
.uol-pagination {
  text-align: center;
}
</style>


