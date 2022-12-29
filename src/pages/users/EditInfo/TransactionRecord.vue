<template>
  <div class="users-title_block Users-setting">
    <el-row>
      <!--Title-->
      <div class="users-product-page-title">
        <label class="users-product-page-point">&#8226;</label>
        <label style="font-size:28px;">交易记录列表</label>
      </div>
    </el-row>
    <div class="users_step_setting">
      <el-steps :active="active" align-center>
        <el-step title="提交订单"></el-step>
        <el-step title="支付订单"></el-step>
        <el-step title="平台发货"></el-step>
        <el-step title="确认收货"></el-step>
        <el-step title="完成评价"></el-step>
      </el-steps>
    </div>

    <div>
      <el-form label-position="right" label-width="150px" class="user_transaction_table">
        <!--Order Informations table-->
        <el-col class="users-transaction-table-title">基本信息</el-col>
        <el-table :data="displayOrder" class="user-transactiion_table_size">
          <!--Order Num column-->
          <el-table-column prop="orderNo" label="订单编号 " align="center" width="200"></el-table-column>

          <!--User name column-->
          <el-table-column prop="userName" label="用户账号  " align="center" width="300"></el-table-column>

          <!--Payment way column-->
          <el-table-column label="支付方式 " align="left">
            <template slot-scope="scope">
              <el-form>
                <div class="user-transaction-image">
                  <img
                    v-if="typeof scope.row.payMode !== 'undefined'"
                    src="../../../assets/Capture.jpg"
                    class="user-transaction-image-size"
                  >
                  <label>{{scope.row.payMode}}</label>
                </div>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
        <div class="utp-pagination">
          <el-pagination
            :total="pagination1.total"
            :pager-count="5"
            :page-size="pagination1.size"
            :current-page.sync="currentPage1"
            @current-change="handleCurrentChange1"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
        <!--Order Informations table-->
        <el-col class="users-transaction-table-title">产品信息</el-col>
        <el-table
          :data="displayItem"
          show-summary
          :summary-method="getSummaries"
          class="user-transactiion_table_size"
        >
          <!--Item Picture column-->
          <el-table-column label="商品图片 " width="200" align="center">
            <template slot-scope="scope">
              <!--     <img :src="scope.row.itemPicture" align="center" height="30px" width="50px"> -->
              <el-form :inline="true">
                <el-form-item
                  v-for="(image, index) in scope.row.images"
                  :key="index"
                  :class="index!==0?'user-transaction-image-form':''"
                >
                  <img :src="image" class="user-transaction-table-images">
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!--Item detail column-->
          <el-table-column label="商品品牌/名称" align="center">" align="center">
            <template slot-scope="scope">
              <label>{{scope.row.brandName}}</label>
              <br>
              <label>{{scope.row.name}}</label>
            </template>
          </el-table-column>
          <!--Price column-->
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <label>{{'$'+scope.row.price}}</label>
              <br>
              <label>{{scope.row.proNum}}</label>
            </template>
          </el-table-column>
          <!--Attribute column-->
          <el-table-column prop="attribute" label="描述" align="center"></el-table-column>

          <!--Account column-->
          <el-table-column prop="account" label="交易数量" align="center"></el-table-column>

          <!--Pay price column-->
          <el-table-column prop="payPrice" label="支付价格" align="center">
            <template slot-scope="scope">
              <label>{{'$'+scope.row.payPrice}}</label>
            </template>
          </el-table-column>
        </el-table>
        <div class="utp-pagination">
          <el-pagination
            :total="pagination2.total"
            :pager-count="5"
            :page-size="pagination2.size"
            :current-page.sync="currentPage2"
            @current-change="handleCurrentChange2"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
        <!--Order Informations table-->
        <el-col class="users-transaction-table-title">收货人信息</el-col>

        <el-table :data="displayAddress" class="user-transactiion_table_size">
          <!--Receiver name column-->
          <el-table-column prop="receiverName" label="收货人姓名 " width="200" align="center"></el-table-column>
          <!--Phone number column-->
          <el-table-column prop="phone" label="收货人手机  " width="200" align="center"></el-table-column>
          <!--Post Code column-->
          <el-table-column prop="postCode" label="邮编" width="200" align="center"></el-table-column>
          <!--Address column-->
          <el-table-column prop="address" label="地址" width="200" align="center"></el-table-column>

          <!--Receiver`s user name column-->
          <!-- <el-table-column prop="receiver_user_name" label="Receiver user name " align="center"></el-table-column> -->
          <el-table-column label=" " align="150"></el-table-column>
        </el-table>
        <div class="utp-pagination">
          <el-pagination
            :total="pagination3.total"
            :pager-count="5"
            :page-size="pagination3.size"
            :current-page.sync="currentPage3"
            @current-change="handleCurrentChange3"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import UserManager from "../../../manager/UserManager";

export default {
  name: "TransactionRecord",
  data() {
    return {
      userManager: new UserManager(),
      active: 0,
      ItemInformation: [],
      displayItem: [],
      totalPrice: 0,
      totalAccount: 0,
      totalPayPrice: 0,
      OrderRecordData: [],
      displayOrder: [],
      AddressListData: [],
      displayAddress: [],
      pagination1: {
        total: 0,
        size: 5,
        currentPage: 1
      },
      currentPage1: 1,
      pagination2: {
        total: 0,
        size: 5,
        currentPage: 1
      },
      currentPage2: 1,
      pagination3: {
        total: 0,
        size: 5,
        currentPage: 1
      },
      currentPage3: 1
    };
  },
  methods: {
    handleCurrentChange1(page) {
      this.pagination1.currentPage = page;
    },
    handleCurrentChange2(page) {
      this.pagination2.currentPage = page;
    },
    handleCurrentChange3(page) {
      this.pagination3.currentPage = page;
    },
    getSummaries(param) {
      const sums = [];

      param.columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 2) {
          sums[index] = "$" + this.totalPrice;
          return;
        }
        if (index === 4) {
          sums[index] = this.totalAccount;
          return;
        }
        if (index === 5) {
          sums[index] = "$" + this.totalPayPrice;
          return;
        }
        sums[index] = "";
      });

      return sums;
    },
    setDisplayItem(newVal) {
      this.displayItem = [];
      let max = Math.min(
        this.pagination2.total - 1,
        newVal * this.pagination2.size - 1
      );
      let min = (newVal - 1) * this.pagination2.size;

      for (let i = min; i <= max; i++) {
        this.displayItem.push(this.ItemInformation[i]);
      }
    },
    setDisplayAddress(newVal) {
      this.displayAddress = [];
      let max = Math.min(
        this.pagination3.total - 1,
        newVal * this.pagination3.size - 1
      );
      let min = (newVal - 1) * this.pagination3.size;

      for (let i = min; i <= max; i++) {
        this.displayAddress.push(this.AddressListData[i]);
      }
    },
    setDisplayOrder(newVal) {
      this.displayOrder = [];
      let max = Math.min(
        this.pagination1.total - 1,
        newVal * this.pagination1.size - 1
      );
      let min = (newVal - 1) * this.pagination1.size;

      for (let i = min; i <= max; i++) {
        this.displayOrder.push(this.OrderRecordData[i]);
      }
    }
  },
  watch: {
    currentPage1: async function(newVal) {
      this.pagination1.currentPage = newVal;
      this.setDisplayOrder(newVal);
    },
    currentPage2: async function(newVal) {
      this.pagination2.currentPage = newVal;
      this.setDisplayItem(newVal);
    },
    currentPage3: async function(newVal) {
      this.pagination3.currentPage = newVal;
      this.setDisplayAddress(newVal);
    }
  },
  computed: {
    /* Third table data */
    ItemListData: function() {
      return this.$store.getters["Users/ItemInformation"];
    },
    TransactionRecordData: function() {
      return this.$store.getters["Users/TransactionRecordData"];
    }
  },
  async created() {
    let id = this.$route.params["userId"];

    await this.$store.dispatch("Users/getItemInformation", id);
    await this.$store.dispatch("Users/getTransactionRecordData", id);
    await this.$store.dispatch("Users/getOrderInformation", id);

    for (let i = 0; i < this.ItemListData.length; i++) {
      this.ItemInformation.push({
        account: this.ItemListData[i].features.count,
        payPrice:
          Number(this.ItemListData[i].features.count) *
          Number(this.ItemListData[i].features.price),
        attribute: this.ItemListData[i].features.keyword,
        images: this.ItemListData[i].attributes.restPhotos,
        price: this.ItemListData[i].features.price,
        proNum: this.ItemListData[i].no,
        brandName: this.ItemListData[i].features.brand,
        name: this.ItemListData[i].features.name
      });

      this.totalPrice = this.totalPrice + this.ItemListData[i].features.price;
      this.totalAccount += this.ItemListData[i].features.count;
      this.totalPayPrice += this.ItemInformation[i].payPrice;
    }
    this.pagination2.total = this.ItemInformation.length;
    this.setDisplayItem(1);

    let list = this.$store.getters["Users/OrderInformation"];
    let res = [];

    for (let i in list) {
      await this.$store.dispatch("Users/getUserById", list[i].user);
      res.push({
        id: list[i].user,
        orderNo: list[i].orderNo,
        userName: this.$store.getters["Users/userById"].name,
        status: this.userManager.getOrderStatus(list[i].status),
        payMode: this.userManager.getPayMode(list[i].payment)
      });
    }
    this.OrderRecordData = res;
    this.pagination1.total = this.OrderRecordData.length;
    this.setDisplayOrder(1);
    this.active = list[0].status;

    this.AddressListData = [];
    this.AddressListData.push({
      phone: this.TransactionRecordData.phone,
      address: this.TransactionRecordData.address,
      postCode: this.TransactionRecordData.postCode,
      receiverName: this.TransactionRecordData.name
    });
    this.pagination3.total = this.AddressListData.length;
    this.setDisplayAddress(1);
  }
};
</script>


<!-- Add attribute to limit CSS to this component only -->
<style >
/* title style */
.users-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 25px;
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
.users-font {
  font-size: 16px;
}
.Users-setting {
  width: 98%;
}
.user_transaction_table .el-table {
  background-color: white;
  border: 0px;
  margin-bottom: 20px;
}
.user_transaction_table .el-table th {
  border: 0px;
  border-bottom: 0px;
}

.user_transaction_table .el-table__row {
  background-color: lightgray;
}
.user-step-icon {
  width: 80%;
  margin-left: 10%;
}

.users_step_setting .el-step__head.is-finish {
  color: white;
  border-color: blue;
}

.users_step_setting .el-step__head.is-finish .el-step__icon {
  background: blue;
}

.users-transaction-table-title {
  text-align: left;
  padding-left: 20px;
  padding-top: 30px;
  font-weight: bold;
}
.user-transactiion_table_size {
  width: 100%;
  font-weight: bold;
}
.user-transaction-image-form {
  margin-left: 5px;
}
.user-transaction-table-images {
  width: 40px;
  height: 50px;
  float: left;
  position: absolute;
  -webkit-transition: width 1s;
  transition: width 1s;
}
.user-transaction-table-images:hover {
  width: 50px;
  height: 50px;
  z-index: 999;
}
.user-transaction-image-size {
  border-radius: 5px;
  width: 20px;
  height: 20px;
  align-items: center;
}
.user-transaction-image label {
  margin-bottom: 0px;
}
.utp-pagination {
  text-align: center;
}
</style>


