<template>
  <div class="order-title_block">
    <!-- header -->
    <div class="order-product-page-title">
      <label class="order-product-page-point">&#8226;</label>
      <label>订单列表</label>
    </div>

    <!-- end header -->
    <!-- number of status  -->
    <div class="m-3">
      <div class="row" style="text-align: center">
        <p class="order-list-bg-primary order-list-box-size m-3">
          统计订单(
          <span v-text="orderCount"></span>
          )
        </p>
        <el-button
          class="order-list-bg-secondary order-list-box-size m-3"
          @click="submittedDisplay"
        >未支付
          <!--  (
          <span v-text="submittedCount"></span>
          )-->
        </el-button>
        <el-button
          class="order-list-bg-secondary order-list-box-size m-3"
          @click="paidDisplay"
        >未平台发货
          <!--  (
          <span v-text="paidCount"></span>
          )-->
        </el-button>

        <el-button
          class="order-list-bg-secondary order-list-box-size m-3"
          @click="mailedDisplay"
        >未完成评价
          <!-- (
          <span v-text="mailedCount"></span>
          )-->
        </el-button>
        <el-button
          class="order-list-bg-secondary order-list-box-size m-3"
          @click="completeDisplay"
        >完成评价
          <!--  (
          <span v-text="completeCount"></span>
          )-->
        </el-button>
        <el-button class="order-list-bg-secondary order-list-box-size m-3" @click="closedDisplay">关门
          <!--  (
          <span v-text="closedCount"></span>
          )-->
        </el-button>
      </div>
    </div>
    <!-- searching -->
    <div>
      <el-form :inline="true" class="order-list-form">
        <el-form-item label="用户ID:" class="order-select">
          <el-input placeholder="请输入用户ID" v-model="search.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="收货人" class="order-select">
          <el-input placeholder="请输入收货人" v-model="search.userId"></el-input>
        </el-form-item>
        <el-form-item label="提交时间" class="order-select">
          <div class="col-6">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请输入提交时间"
              v-model="search.submittedTime"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="order-round-button">
          <el-button type="primary" round @click="searchOrder">查找</el-button>
          <el-button type="info" round @click="refreshPage">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- table -->
    <div>
      <el-table
        ref="multipleTable"
        :data="currentOrders"
        @selection-change="handleSelectionChange"
        class="order-list-table-size"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="100px" align="center"></el-table-column>
        <el-table-column prop="orderNo" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="submitted" label="提交时间" align="center"></el-table-column>
        <el-table-column prop="user" label="用户账号" align="center"></el-table-column>
        <el-table-column prop="amount" label="订单金额" align="center"></el-table-column>
        <el-table-column label="支付方式" align="center">
          <template slot-scope="scope">
            <el-form>
              <div class="order-image">
                <img
                  v-if="scope.row.payType !== ''"
                  src="../../assets/Capture.jpg"
                  class="order-image-size"
                >
                <label>{{scope.row.payment}}</label>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" align="center"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button @click="checkOrder(scope.row.id)" class="order_detail_click">查看</el-button>
            <el-button @click="auditPage" class="order_edit_click">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- pagination box -->
    <div class="order-pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        :pager-count="5"
        :page-size="pagination.size"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- smart search -->
    <div v-if="modalState" class="order-list-modal">
      <div class="order-list-modal-type">
        <smart-search
          v-if="!smartSearchClose"
          :searchList="smartSearchList"
          v-on:smartSearchClose="setModalState"
          v-on:smartSearchKey="smartSearch"
        ></smart-search>
        <audit-detail
          v-if="!auditDetailClose"
          :itemId="selectedId"
          v-on:auditDetailClose="setModalState"
        ></audit-detail>
      </div>
    </div>
  </div>
</template>

<script>
import SmartSearch from "@/components/items/list/SmartSearch";
import AuditDetail from "@/components/items/list/AuditDetail";

export default {
  components: {
    smartSearch: SmartSearch,
    auditDetail: AuditDetail
  },
  data() {
    return {
      name: 0,
      checkAll: false,
      multipleSelection: [],
      totalOrders: 0,
      currentOrders: [],
      currentPage: 1,
      pagination: {
        current: 1,
        size: 4,
        total: 0
      },
      tempOrders: [],
      //paginationInfo: {}, //pagination information: count of order per page, selected page number
      //pageSizes: [4, 8, 12], //count list of order to be displayed in page
      search: {
        orderNo: "",
        userId: "",
        submittedTime: ""
      },
      /** smart search list */
      smartSearchList: {
        itemTypeList: ["123", "333"],
        itemBrandList: ["ssss", "sssddds"],
        auditStatusList: ["Pass", "Not Pass"]
      },
      /** state of modal */
      modalState: false,
      /** If false, display the smart search dialog; or close. */
      smartSearchClose: true,
      /** If false, display the audit detail dialog; or close. */
      auditDetailClose: true
    };
  },
  computed: {
    /* get Total Number of orderList */
    orders: function() {
      return this.$store.getters["Order/getOrders"];
    },
    /* get Total Number of orderCount */
    orderCount: function() {
      return this.$store.getters["Order/orderCount"];
    },

    /* get Total Number of submittedCount */
    submittedCount: function() {
      return this.$store.getters["Order/submittedCount"];
    },

    /* get Total Number of paidCount */
    paidCount: function() {
      return this.$store.getters["Order/paidCount"];
    },

    /* get Total Number of mailedCount */
    mailedCount: function() {
      return this.$store.getters["Order/mailedCount"];
    },

    /* get Total Number of completeCount */
    completeCount: function() {
      return this.$store.getters["Order/completeCount"];
    },

    /* get Total Number of closedCount */
    closedCount: function() {
      return this.$store.getters["Order/closedCount"];
    }
  },
  async created() {
    await this.$store.dispatch("Order/getOrdersFromDB");
    await this.$store.dispatch("Order/getStatusCount");
    this.tempOrders = this.orders;
    this.displayList();
  },

  methods: {
    submittedDisplay() {
      this.tempOrders = this.submittedCount;
      this.displayList();
    },
    paidDisplay() {
      this.tempOrders = this.paidCount;
      this.displayList();
    },
    mailedDisplay() {
      this.tempOrders = this.mailedCount;
      this.displayList();
    },
    completeDisplay() {
      this.tempOrders = this.completeCount;
      this.displayList();
    },
    closedDisplay() {
      this.tempOrders = this.closedCount;
      this.displayList();
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      }
      return "";
    },
    handleCurrentChange(page) {
      this.pagination.current = page;
    },
    /** Smart search */
    smartSearch(key) {
      this.searchKey = key;
      this.searchOrder();

      this.allOrders = this.orders.filter(
        data =>
          !this.searchKey.auditStatus ||
          data.status.toLowerCase() === this.searchKey.auditStatus.toLowerCase()
      );
    },

    /** Setting the state of modal */
    setModalState(state) {
      this.smartSearchClose = state;
      this.auditDetailClose = state;
      this.modalState = false;
    },
    /* Smart search button event */
    smartSearchClick() {
      this.modalState = true;
      this.smartSearchClose = false;
      this.auditDetailClose = true;
    },
    /* select all */
    handleCheckAllChange() {
      let rows = this.checkAll ? this.orders : [];

      this.toggleSelection(rows);
    },
    /* select row of table when checkbox*/
    toggleSelection(rows) {
      if (rows.length > 0) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    /* select row of table */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let checkedCount = val.length;

      this.checkAll = checkedCount === this.orders.length;
    },
    /* click of checkorder button of table */
    async checkOrder(id) {
      this.$router.push(`orders/${id}`);
    },

    //orders list displaying including loding process(dialog)
    displayList() {
      this.pagination.total = this.tempOrders.length;
      this.currentOrders = [];
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        /* this.tempOrders[i].updateTime =
          new Date(this.tempOrders[i].updateTime).getFullYear() +
          "-" +
          (
            "0" + Number(new Date(this.tempOrders[i].updateTime).getMonth() + 1)
          ).slice(-2) +
          "-" +
          ("0" + new Date(this.tempOrders[i].updateTime).getDate()).slice(-2); */

        this.setStatus(this.tempOrders[i]);
        this.setType(this.tempOrders[i]);
        this.currentOrders.push(this.tempOrders[i]);
      }
    },

    setStatus(order) {
      if (order.status === 0) {
        order.status = "待付款";
      }
      if (order.status === 1) {
        order.status = "待发货";
      }
      if (order.status === 2) {
        order.status = "已发货";
      }
      if (order.status === 3) {
        order.status = "已完成";
      }
      if (order.status === 4) {
        order.status = "已关闭";
      }
      if (order.status === 5) {
        order.status = "无效订单";
      }
    },

    setType(order) {
      if (order.payment === 0) {
        order.payment = "未支付";
      }
      if (order.payment === 1) {
        order.payment = "支付宝";
      }
      if (order.payment === 2) {
        order.payment = "微信";
      }
    },

    /**
     * If clicked "Search"button, display the orders by filter.
     */
    searchOrder() {
      let res = [];

      res = this.orders.filter(
        order =>
          !this.search.orderNo ||
          order.orderNo.toString().includes(this.search.orderNo.toString())
      );

      res = res.filter(
        order =>
          !this.search.userId ||
          order.user.toString().includes(this.search.userId.toString())
      );

      res = res.filter(
        order =>
          !this.search.submittedTime ||
          order.submitted
            .toString()
            .includes(this.search.submittedTime.toString())
      );
      this.tempOrders = res;
      this.displayList();
    },
    auditPage() {
      this.$router.push({ path: "items/audit" });
    },
    /* refresh page */
    refreshPage() {
      this.search.orderNo = "";
      this.search.userId = "";
      this.search.submittedTime = "";

      this.totalOrders = this.orders.length;
      this.tempOrders = this.orders;
      this.displayList();
    }
    /*  paginationFunc() {
      this.currentOrders = [];
      this.pagination.total = this.orders.length;
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        this.currentOrders.push(this.orders[i]);
      }

      this.pagination.current = 1;
    } */
  },
  watch: {
    currentPage: function(value) {
      this.pagination.current = value;
      this.displayList();
    }
  }
};
</script>

<style>
.order-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: 20px;
}
.order-product-page-point {
  color: blue;
}
.order-title_block {
  border: 1px solid #fff;
  border-radius: 4px;
  margin: auto;
  width: 99%;
  background-color: #fff;
}
.order-list-header {
  background: #f3f3f3;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #e6e6e6;
  height: 70px;
}
.order-list-tag-size {
  width: 10px;
  height: 40px;
}
.order-list-align-right {
  text-align: right;
}
.order-list-align-left {
  text-align: left;
}
.order-list-align-center {
  text-align: center;
}
.order-list-float-left {
  float: left;
}

.order-list-margin-top {
  margin-top: 12px;
}

.order-list-bg-primary {
  border-radius: 40px;
  background-color: #98b3dd;
  padding-top: 8px;
  color: white;
}
.order-list-bg-secondary {
  background: #0088dd;
  border-radius: 40px;
  padding-top: 8px;
  color: white;
}
.order-list-box-size {
  width: 140px;
  height: 40px;
}
.order-list-xheader {
  font-size: 18px;
  color: #333333;
  background: linear-gradient(
    180deg,
    rgba(245, 245, 245, 1) 0%,
    rgba(245, 245, 245, 1) 0%,
    rgba(232, 232, 232, 1) 100%,
    rgba(232, 232, 232, 1) 100%
  );
  border-style: solid;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-color: #dddddd;
  border-width: 1px;
}
.order-list-xbody {
  /*   border-style: solid solid solid solid;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-color: #dddddd;
  border-width: 1px;
  margin-bottom: 20px; */
  width: 100%;
  align-items: center;
}

.order-list-table-size {
  width: 100%;
  margin: auto;
  font-weight: bold;
}

/** modal style */
.order-list-modal {
  position: fixed;
  z-index: 2000;
  background-color: rgba(250, 250, 250, 0.8);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
  overflow: auto;
}
/** modal type */
.order-list-modal-type {
  top: 10%;
  width: 50%;
  margin-top: -21px;
  position: relative;
  background-color: white;
  margin: auto;
}
.order-select {
  margin-left: 15px;
  font-weight: bold;
}
.order-round-button {
  float: right;
  padding-right: 15px;
}
.el-table .warning-row {
  background: rgb(200, 200, 200);
}
.order_detail_click {
  background: rgb(88, 88, 236);
  border: 0px;
  border-radius: 5px;
  color: white;
  width: 80px;
  height: 40px;
  font-weight: bold;
}
.order_edit_click {
  background: rgb(204, 58, 58);
  border: 0px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  width: 80px;
  height: 40px;
}
.order-image-size {
  border-radius: 5px;
  width: 20px;
  height: 20px;
  align-items: center;
}
.order-image label {
  margin-bottom: 0px;
}
.order-pagination {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}
.order-list-form {
  width: 100%;
  margin: auto;
}
</style>


