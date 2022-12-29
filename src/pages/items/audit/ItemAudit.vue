<template>
  <div>
    <div class="audit-search-box">
      <el-input
        placeholder="查询商品名称/商品货号"
        prefix-icon="el-icon-search"
        class="audit-search audit-search-icon"
        v-model="nameOrNum"
      ></el-input>
    </div>
    <div class="audit-list-box">
      <div class="audit-body">
        <div>
          <label class="audit-point">&#9679;</label>
          <label class="audit-title">商品审核页</label>
          <span class="audit-count">待审核数量:{{count}}</span>
        </div>
        <div class="audit-classify">
          <el-form :inline="true">
            <el-form-item label="商品分类:" class="audit-select">
              <el-select placeholder="请选择商品类别" v-model="type">
                <el-option
                  v-for="(item, index) in itemTypeList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品品牌:" class="audit-select">
              <el-select placeholder="请选择品牌" v-model="brand">
                <el-option
                  v-for="(item, index) in itemBrandList"
                  :key="index"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="audit-round-button">
              <el-button type="primary" round @click="search">查找</el-button>
              <el-button type="info" round @click="reset">清空占</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="audit-table">
          <el-table :data="displayList" :row-class-name="tableRowColor">
            <el-table-column type="selection" width="30" align="right"></el-table-column>
            <el-table-column label="全选" align="left" width="41" label-class-name="audit-suffix"></el-table-column>
            <el-table-column label="编号" align="center" width="150" prop="productNum"></el-table-column>
            <el-table-column label="商品图片" align="center" width="300">
              <template slot-scope="scope">
                <el-form :inline="true">
                  <el-form-item
                    v-for="(image, index) in scope.row.images"
                    :key="index"
                    :class="index!==0?'audit-image-form':''"
                  >
                    <img :src="image" class="audit-table-images">
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name" align="center"></el-table-column>
            <el-table-column label="价格" prop="price" align="center">
              <template slot-scope="scope">
                <label>${{scope.row.price}}</label>
              </template>
            </el-table-column>
            <el-table-column label="审核状态" prop="status" align="center">
              <template slot-scope="scope">
                <label :class="getTextCss(scope.row.status)">{{scope.row.status}}</label>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button type="primary" @click="check(scope.row)" size="small">详情</el-button>
                <el-button type="danger" @click="auditButton(scope.row)" size="small">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="audit-pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="pagination.total"
            :pager-count="5"
            :page-size="pagination.size"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.visible"
        :close-on-click-modal="false"
        class="audit-dialog-title audit-dialog-close audit-dialog-body"
      >
        <Audit :itemList="selectedAudit" v-on:status="updateStatus"></Audit>
        <router-view></router-view>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="高级检索"
        :visible.sync="checkDialogVisible"
        :modal-append-to-body="true"
        :close-on-click-modal="false"
        class="audit-dialog-title audit-dialog-close audit-dialog-body"
      >
        <div class="info-font">
          <div class="row">
            <div class="col-6">
              <p>编号:</p>
              <el-input v-model="checkData.productNum" :disabled="true"></el-input>
            </div>
            <div class="col-6">
              <p>商品名称:</p>
              <el-input v-model="checkData.name" :disabled="true"></el-input>
            </div>
          </div>
          <div class="row info-interval">
            <div class="col-6">
              <p>价格:</p>
              <el-input v-model="checkData.price" :disabled="true"></el-input>
            </div>
            <div class="col-6">
              <p>审核状态:</p>
              <el-input v-model="checkData.status " :disabled="true"></el-input>
            </div>
          </div>
          <div class="row info-interval">
            <div class="col-6">
              <p>商品类型:</p>
              <el-input v-model="checkData.category" :disabled="true"></el-input>
            </div>
            <div class="col-6">
              <p>商品分类型:</p>
              <el-input v-model="checkData.subCateg " :disabled="true"></el-input>
            </div>
          </div>
          <div class="info-interval">
            <el-carousel :interval="3000" type="card" height="200px" class="acd-images">
              <el-carousel-item v-for="(image, index0) in checkData.images" :key="index0">
                <img :src="image" class="acd-image" @click="setImage(image)">
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </el-dialog>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="expandImg" alt>
    </el-dialog>
  </div>
</template>

<script>
import Audit from "../../../components/items/audit/Audit";
import ProductManager from "../../../manager/ProductManager";

export default {
  components: {
    Audit
  },
  async created() {
    await this.$store.dispatch("AllItemList/getItemBrand");
    await this.$store.dispatch("AllItemList/getItemType");
    await this.$store.dispatch("Audit/getAuditList");

    this.getProductList(this.auditList);
    this.filter();
  },
  watch: {
    nameOrNum: function(value) {
      this.searchKey.nameOrNum = value;
      this.filter();
    },
    currentPage: function(value) {
      this.pagination.current = value;
      this.filter();
    },
    type: function(val) {
      this.searchKey.type = val;
    },
    brand: function(val) {
      this.searchKey.brand = val;
    }
  },
  computed: {
    auditList: function() {
      let list = this.$store.getters["Audit/auditList"];
      let res = [];

      for (let i in list) {
        res.push({
          id: list[i].id,
          productNum: list[i].no,
          images: list[i].attributes.restPhotos,
          name: list[i].features.name,
          price: list[i].features.price,
          status: this.productManager.getAuditStatus(list[i].status),
          category: list[i].features.kind,
          subCateg: list[i].features.subKind,
          brand: list[i].features.brand
        });
      }

      return res;
    },
    itemBrandList: function() {
      let list = this.$store.getters["AllItemList/itemBrand"];

      return list;
    },
    itemTypeList: function() {
      let list = this.$store.getters["AllItemList/itemType"];

      return list;
    },
    count: function() {
      return this.productList.length;
    }
  },
  data() {
    return {
      productManager: new ProductManager(),
      nameOrNum: "",
      type: "",
      brand: "",
      currentPage: 1,
      searchKey: {
        nameOrNum: "",
        type: "",
        brand: ""
      },
      displayList: [],
      productList: [],
      categ: {
        type: [],
        brand: []
      },
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      dialog: {
        title: "",
        visible: false
      },
      selectedAudit: {
        id: "",
        name: "",
        images: [],
        no: ""
      },
      checkDialogVisible: false,
      checkData: {
        productNum: "",
        name: "",
        price: "",
        status: "",
        images: []
      },
      dialogVisible: false,
      expandImg: "",
      append: false
    };
  },
  methods: {
    setImage(img) {
      this.dialogVisible = true;
      this.expandImg = img;
    },
    // eslint-disable-next-line no-unused-vars
    tableRowColor({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "audit-row-color";
      }

      return "";
    },
    getProductList(list) {
      this.productList = [];
      for (let i = 0; i < list.length; i++) {
        this.productList.push({
          id: list[i].id,
          productNum: list[i].productNum,
          images: list[i].images,
          name: list[i].name,
          price: list[i].price,
          status: list[i].status,
          brand: list[i].brand,
          category: list[i].category,
          subCateg: list[i].subCateg
        });
      }
    },
    search() {
      this.filter();
    },
    reset() {
      this.searchKey.type = this.type = "";
      this.searchKey.brand = this.brand = "";
      this.filter();
    },
    handleCurrentChange(page) {
      this.pagination.current = page;
    },
    filter() {
      this.displayList = [];
      let list = this.productList.filter(
        data =>
          (!this.searchKey.nameOrNum ||
            this.searchKey.nameOrNum.toString() ===
              data.productNum.toString() ||
            data.name.includes(this.searchKey.nameOrNum.toString())) &&
          (!this.searchKey.type || this.searchKey.type === data.category) &&
          (!this.searchKey.brand || this.searchKey.brand === data.brand)
      );

      this.pagination.total = list.length;
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        this.displayList.push(list[i]);
      }

      this.pagination.current = 1;
    },
    auditButton(item) {
      this.dialog.title = "商品审核";
      this.dialog.visible = true;
      this.selectedAudit = {
        id: item.id,
        name: item.name,
        images: item.images,
        no: item.productNum
      };
    },
    updateStatus(status) {
      for (let i = 0; i < this.displayList.length; i++) {
        if (this.displayList[i].id === this.selectedAudit.id) {
          if (status === 1) {
            this.displayList[i].status = "审核通过";
          } else {
            this.displayList[i].status = "未通过";
          }
          break;
        }
      }
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].id === this.selectedAudit.id) {
          if (status === 1) {
            this.productList[i].status = "审核通过";
          } else {
            this.productList[i].status = "未通过";
          }
          break;
        }
      }
      this.dialog.visible = false;
    },
    getTextCss(status) {
      if (status === "不通过") {
        return "audit-state-black";
      }
      if (status === "未审核") {
        return "audit-state-red";
      }
      return "audit-state-green";
    },
    async check(row) {
      await this.$store.dispatch("AllItemList/getItemTypeById", row.category);
      let idList = [row.category, row.subCateg];

      await this.$store.dispatch("Item/getSubTypeById", idList);
      this.checkDialogVisible = true;
      this.checkData = {
        productNum: row.productNum,
        name: row.name,
        price: "$" + row.price,
        status: row.status,
        images: row.images,
        category: this.$store.getters["AllItemList/itemTypeById"],
        subCateg: this.$store.getters["Item/subTypeById"].name
      };
      /*       this.checkData.images = [
        require("../../../assets/img_avatar3.png"),
        require("../../../assets/img_avatar3.png"),
        require("../../../assets/img_avatar3.png"),
        require("../../../assets/img_avatar3.png"),
        require("../../../assets/img_avatar3.png")
      ]; */
    }
  }
};
</script>

<style>
.audit-search-box {
  background-color: white;
  height: 70px;
  width: 100%;
  margin: auto;
  padding-left: 20px;
}
.audit-search .el-input__inner {
  margin-top: 15px;
  width: 20%;
  border-radius: 30px;
  float: left;
  margin-left: 10px;
}
.audit-search-icon .el-input__prefix {
  margin-top: 10px;
  left: 15px;
}
.audit-list-box {
  width: 100%;
  background-color: lightgray;
  padding-top: 20px;
  padding-bottom: 20px;
}
.audit-body {
  width: 97%;
  margin: auto;
  background-color: white;
  padding-top: 15px;
}
.audit-point {
  float: left;
  padding-left: 10px;
  color: blue;
  margin-top: 10px;
}
.audit-title {
  font-size: 30px;
  font-weight: bold;
  color: black;
}
.audit-count {
  float: right;
  padding-right: 20px;
  color: red;
  margin-top: 10px;
}
.audit-line {
  margin-top: 15px;
  height: 1px;
  width: 100%;
  margin: auto;
  background-color: gray;
}
.audit-classify {
  padding-top: 15px;
  padding-bottom: 15px;
}
.audit-select {
  margin-left: 15px;
}
.audit-round-button {
  float: right;
  padding-right: 15px;
}
.audit-pagination {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}
.el-table .audit-row-color {
  background: rgb(248, 245, 245);
}
.audit-table-images {
  float: left;
  position: absolute;
  width: 60px;
  height: 50px;
  -webkit-transition: width 1s;
  transition: width 1s;
}
.audit-table-images:hover {
  width: 50px;
  z-index: 999;
}
.audit-image-form {
  margin-left: 5px;
}
.audit-dialog-title .el-dialog__title {
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
}
.audit-dialog-close .el-dialog__headerbtn {
  font-size: 30px;
  font-weight: bold;
  top: 20px;
}
.audit-dialog-body .el-dialog__body {
  padding: 10px 20px;
}
.audit-state-red {
  color: red;
}
.audit-state-green {
  color: green;
}
.audit-state-black {
  color: black;
}
.audit-suffix {
  font-size: 12px;
}
.audit-table .el-table th > .cell {
  padding-left: 2px;
  padding-right: 2px;
}
.info-font {
  font-size: 20px;
}
.info-interval {
  margin-top: 20px;
  margin-bottom: 30px;
}
.acd-image {
  height: 100%;
  width: 100%;
}
.acd-images {
  margin: auto;
}
</style>
