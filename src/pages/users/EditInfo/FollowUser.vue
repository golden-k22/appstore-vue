<template>
  <div class="follow-users-title_block follow-users-setting">
    <el-row class="top">
      <!--Title-->
      <div class="follow-users-product-page-title">
        <label class="follow-users-product-page-point">&#8226;</label>
        <label style="font-size:28px;">收藏用户</label>
      </div>
    </el-row>
    <!--Products table-->
    <el-table :data="displayData" class="follow-users-table-cursor1">
      <!--Order Num column-->
      <el-table-column prop="dealings" label="购买数量 " align="center"></el-table-column>
      <!--Submit date column-->
      <el-table-column prop="phone" label="email  " align="center"></el-table-column>
      <!--User name column-->
      <el-table-column prop="birthday" label="收藏数量" align="center"></el-table-column>
      <!--Sum of order column-->
      <el-table-column prop="name" label="介绍  " width="200" align="center"></el-table-column>

      <!--Payment way column-->
      <el-table-column prop="grade" label="卖的商品数量 " width="200" align="center"></el-table-column>

      <!--Order record column-->
      <el-table-column prop="province" label="订单状态  " width="200" align="center"></el-table-column>
    </el-table>
    <div class="follow-user-pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        :pager-count="5"
        :page-size="pagination.size"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <div class="follow-users-list-bottom"></div>
  </div>
</template>

<script>
export default {
  watch: {
    currentPage: function(value) {
      this.pagination.current = value;
      this.displayList();
    }
  },
  data() {
    return {
      pagination: {
        current: 1,
        size: 12,
        total: 0
      },
      currentPage: 1,
      displayData: []
    };
  },
  computed: {
    /* Order Record Data */
    followUserList: function() {
      return this.$store.getters["Users/getFollowList"];
    }
  },
  async created() {
    let id = this.$route.params["userId"];

    await this.$store.dispatch("Users/getFollowList", id);
    this.displayList();
  },
  methods: {
    handleCurrentChange(page) {
      this.pagination.current = page;
    },
    displayList() {
      this.displayData = [];
      this.pagination.total = this.followUserList.length;
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        this.displayData.push(this.followUserList[i]);
      }

      this.pagination.current = 1;
    }
  }
};
</script>


<!-- Add attribute to limit CSS to this component only -->
<style >
.follow-users-list-bottom {
  height: 30px;
}

.follow-users-product-page-point {
  color: blue;
}
.follow-users-title_block {
  display: block;
  border: 1px solid #fff;
  border-radius: 4px;
  margin-left: 15px;
  width: 96%;
  background-color: #fff;
}
/* title style */
.follow-users-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 50px;
  margin-top: 20px;
}
/* font size setting */
.follow-users-font {
  font-size: 16px;
}
/** table cursor */
.follow-users-table-cursor1 {
  width: 100%;
}
.follow-users-setting {
  width: 98%;
}
.follow-users-setting .el-table tr {
  background-color: lightgray;
}
.user_record_button.el-button {
  background: lightgray;
  border: 0px;
  color: blue;
}
.follow-user-pagination {
  text-align: center;
}
</style>


