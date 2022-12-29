<template>
  <div class="order-detail_block order-detail-main">
    <!-- header -->
    <el-row>
      <div class="order-product-page-title">
        <label class="order-product-page-point">&#8226;</label>
        <label>订单详情</label>
        <el-button class="order_detail_back_click" icon="el-icon-close" @click="closeClick">关门</el-button>
        <el-button class="order_detail_search_click" icon="el-icon-refresh" type="reset">刷新</el-button>
      </div>
    </el-row>
    <!-- steps -->
    <div class="users_step_setting">
      <el-steps :active="activeStatus" align-center>
        <el-step title="提交订单"></el-step>
        <el-step title="支付订单"></el-step>
        <el-step title="平台发货 "></el-step>
        <el-step title="确认收货"></el-step>
        <el-step title="完成评价"></el-step>
      </el-steps>
    </div>

    <!-- info -->
    <div class="order-detail-xbody order-detail-bg-white m-3 p-3">
      <div class="row order-detail-xbody order-detail-main m-3 p-3">
        <div class="col-4 order-detail-align-left text-danger">
          <i class="el-icon-error">当前订单状态：{{status}}</i>
        </div>
        <div class="col-8 order-detail-align-right">
          <el-button class="order-detail-bg-secondary" @click="editReceiver">修改收货人信息</el-button>
          <el-button class="order-detail-bg-secondary">修改商品信息</el-button>
          <el-button class="order-detail-bg-secondary" @click="editAmount">修改合计支付</el-button>
          <el-button class="order-detail-bg-secondary" @click="closeOrder">关闭订单</el-button>
        </div>
      </div>
      <!-- basic info -->
      <el-col class="order-detail-align-left fa fa-bookmark">基本信息</el-col>
      <el-table :data="tableOrder" class="order-detail-table-size">
        <el-table-column prop="order" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="submitted" label="发货单流水号" align="center"></el-table-column>
        <el-table-column prop="user" label="用户账号" align="center"></el-table-column>
        <el-table-column prop="amount" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="payment" label="订单类型" align="center"></el-table-column>
        <el-table-column prop="status" label="配送方式" align="center"></el-table-column>
      </el-table>

      <!-- reciever info -->
      <el-col class="order-detail-align-left fa fa-bookmark">收货人信息</el-col>
      <el-table :data="receivers" class="order-detail-table-size">
        <el-table-column prop="name" label="收货人" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="postCode" label="邮政编码" align="center"></el-table-column>
        <el-table-column prop="address" label="收货地址" align="center"></el-table-column>
      </el-table>

      <!-- item info -->
      <el-col class="order-detail-align-left fa fa-bookmark">商品信息</el-col>
      <el-table :data="products" class="order-detail-table-size">
        <el-table-column prop="productImage" label="商品图片" align="center"></el-table-column>
        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="price" label="价格/货号" align="center"></el-table-column>
        <el-table-column prop="property" label="属性" align="center"></el-table-column>
        <el-table-column prop="count" label="数量" align="center"></el-table-column>
        <el-table-column prop="kind" label="库存" align="center"></el-table-column>
        <el-table-column prop="subKind" label="小计" align="center"></el-table-column>
      </el-table>

      <!-- operation info -->
      <el-col class="order-detail-align-left fa fa-bookmark">操作信息</el-col>
      <el-table :data="operation" class="order-detail-table-size">
        <el-table-column prop="order" label="操作人" align="center"></el-table-column>
        <el-table-column prop="submitted" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="user" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="amount" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="payment" label="配送时间" align="center"></el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog
        title="修改收货人信息"
        :visible.sync="receiverVisible"
        :close-on-click-modal="false"
        class="receiver-dialog-title receiver-dialog-close receiver-dialog-body"
      >
        <EditReceiver :itemList="selectedReceiver" v-on:result="receiverResult"></EditReceiver>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="修改合计支付"
        :visible.sync="amountVisible"
        :close-on-click-modal="false"
        class="receiver-dialog-title receiver-dialog-close receiver-dialog-body"
      >
        <EditAmount :itemList="selectedAmount" v-on:result="amountResult"></EditAmount>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import EditReceiver from "./EditReceiver";
import EditAmount from "./EditAmount";
/* eslint-disable */
export default {
  components: {
    EditReceiver,
    EditAmount
  },
  data() {
    return {
      status: "",
      activeStatus: 0,
      order: {},
      receiver: {},
      tableOrder: [],
      product: [],
      operation: [],
      receivers: [],
      id: 0,
      receiverVisible: false,
      amountVisible: false,
      selectedReceiver: {
        orderId: 0,
        name: "",
        phone: "",
        postCode: "",
        address: ""
      },
      selectedAmount: {
        orderId: 0
      }
    };
  },
  computed: {
    products: function() {
      return this.$store.getters["Order/getItems"];
    },
    result: function() {
      return this.$store.getters["Order/getStatus"];
    }
  },
  async created() {
    this.id = this.$route.params["orderId"];

    await this.$store.dispatch("Order/getOrderByIdFromDB", this.id);
    await this.$store.dispatch("Order/getReceiversByIdFromDB", this.id);
    await this.$store.dispatch("Order/getProducts", this.id);
    this.receiver = this.$store.getters["Order/getReceivers"];
    this.order = this.$store.getters["Order/getOrderById"];
    this.activeStatus = this.order.status;
    this.setStatus(this.activeStatus);
    if (this.order.payType === 0) {
      this.order.payType = "未支付";
    }
    if (this.order.payType === 1) {
      this.order.payType = "支付宝";
    }
    if (this.order.payType === 2) {
      this.order.payType = "微信";
    }
    this.tableOrder.push(this.order);
    this.receivers.push(this.receiver);
  },
  methods: {
    /* when '修改收货人信息'button click, edit receiver list by id. */
    editReceiver() {
      this.selectedReceiver.orderId = this.id;
      this.selectedReceiver.name = this.receiver.name;
      this.selectedReceiver.phone = this.receiver.phone;
      this.selectedReceiver.postCode = this.receiver.postCode;
      this.selectedReceiver.address = this.receiver.address;
      this.receiverVisible = true;
    },
    /* when ''button click, edit amount by id. */
    editAmount() {
      this.selectedAmount.orderId = this.id;
      this.amountVisible = true;
    },
    receiverResult(result) {
      if (result) {
        this.receiverVisible = false;
      }
    },
    amountResult(result) {
      if (result) {
        this.amountVisible = false;
      }
    },
    /* when '关闭订单'button click, delete orderlist of record by id and go to orders page. */
    async closeOrder() {
      await this.$store.dispatch("Order/deleteOrder", this.id);
      this.getResult();
    },

    getResult() {
      if (this.result) {
        this.$notify({
          title: "Success",
          message: "删除成功了!",
          type: "success"
        });
        this.closeClick();
      } else {
        this.$notify({
          title: "Error",
          message: "无法从商品列表中删除!",
          type: "error"
        });
      }
    },
    /* when close button click, go to orders page */
    closeClick() {
      this.$router.push({ path: "/orders" });
    },
    setStatus(value) {
      if (value === 0) {
        this.status = "待付款";
      }
      if (value === 1) {
        this.status = "待发货";
      }
      if (value === 2) {
        this.status = "已发货";
      }
      if (value === 3) {
        this.status = "已完成";
      }
      if (value === 4) {
        this.status = "已关闭";
      }
      if (value === 5) {
        this.status = "无效订单";
      }
    }
  }
};
</script>


<style>
.order-detail_block {
  display: block;
  border: 1px solid #fff;
  border-radius: 4px;
  margin-left: 15px;
  width: 96%;
  background-color: #fff;
}
.order-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 15px;
  margin-top: 20px;
}
.order-product-page-point {
  color: blue;
}
.order-detail-main {
  width: 97%;
}
.order-detail-bg-white {
  background: #ffffff;
}

.order-detail-align-right {
  text-align: right;
}
.order-detail-align-left {
  width: 100%;
  font-weight: bold;
}
.order-detail-align-center {
  text-align: center;
}
.order-detail-float-left {
  float: left;
}

.order-detail-margin-top {
  margin-top: 12px;
}

.order-detail-bg-primary {
  background-color: #1abc9c;
}
.order-detail-bg-secondary {
  background: #ffffff;
  border: 1px solid #cccccc;
}
.order-detail-xbody {
  border-style: solid solid solid solid;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-color: #dddddd;
  border-width: 1px;
  margin-bottom: 20px;
}
.order-detail-table-size {
  width: 100%;
  margin-bottom: 15px;
}
.users_step_setting .el-step__head.is-finish {
  color: white;
  border-color: blue;
}

.users_step_setting .el-step__head.is-finish .el-step__icon {
  background: blue;
}
.order-detail-bg-secondary {
  background: #0088dd;
  border-radius: 40px;
  padding-top: 8px;
  color: white;
}
.order_detail_search_click {
  background: rgb(88, 88, 236);
  border: 0px;
  border-radius: 5px;
  color: white;
  width: 80px;
  height: 40px;
  font-weight: bold;
  float: right;
  margin-right: 20px;
}
.order_detail_back_click {
  background: rgb(204, 58, 58);
  border: 0px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  width: 80px;
  height: 40px;
  float: right;
  margin-right: 20px;
}
.order_detail_page_property {
  width: 100%;
  font-weight: bold;
}
.order-detail-table-size .el-table {
  background-color: white;
  border: 0px;
  margin-bottom: 20px;
}
.order-detail-table-size .el-table th {
  border: 0px;
  border-bottom: 0px;
}
.order-detail-table-size .el-table__row {
  background-color: lightgray;
}
.receiver-dialog-title .el-dialog__title {
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
}
.receiver-dialog-close .el-dialog__headerbtn {
  font-size: 30px;
  font-weight: bold;
  top: 20px;
}
.receiver-dialog-body .el-dialog__body {
  padding: 10px 20px;
}
</style>

