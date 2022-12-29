<template>
  <div>
    <div class="rnp-search-box">
      <el-input
        placeholder="查询商品名称/商品货号"
        prefix-icon="el-icon-search"
        class="rnp-search rnp-search-icon"
        v-model="nameOrNum"
      ></el-input>
    </div>
    <div class="rnp-list-box">
      <div class="rnp-body">
        <div>
          <label class="rnp-point">&#9679;</label>
          <label class="rnp-title">商品评价</label>
        </div>
        <div class="rnp-classify">
          <el-form :inline="true">
            <el-form-item label="商品分类:" class="rnp-select">
              <el-select placeholder="请选择商品类别" v-model="type">
                <el-option
                  v-for="(item, index) in itemTypeList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品品牌:" class="rnp-select">
              <el-select placeholder="请选择品牌" v-model="brand">
                <el-option
                  v-for="(item, index) in itemBrandList"
                  :key="index"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="rnp-round-button">
              <el-button type="primary" round @click="search">查找</el-button>
              <el-button type="info" round @click="reset">晴空</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="rnp-table"
          v-loading="loadingState"
          element-loading-text="Loading..."
          element-loading-background="rgba(240, 240, 240, 0.8)"
        >
          <el-table :data="dataList" :row-class-name="tableRowColor">
            <el-table-column type="selection" width="30" align="right"></el-table-column>
            <el-table-column label="全选" align="left" width="41" label-class-name="rnp-suffix"></el-table-column>
            <el-table-column label="编号" align="center" width="150" prop="productNum"></el-table-column>
            <el-table-column label="商品图片" align="center" width="300">
              <template slot-scope="scope">
                <el-form :inline="true">
                  <el-form-item
                    v-for="(image, index) in scope.row.images"
                    :key="index"
                    :class="index!==0?'rnp-image-form':''"
                  >
                    <img :src="image" class="rnp-table-images">
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
                <label>{{scope.row.status}}</label>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button type="primary" @click="check(scope.row)" size="small">Report</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="rnp-pagination">
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
        title="商品评价"
        :visible.sync="checkDialogVisible"
        :close-on-click-modal="false"
        class="rnp-dialog-title rnp-dialog-close rnp-dialog-body"
      >
        <Report :itemList="selectedReport"></Report>
        <router-view></router-view>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Report from "../../components/users/report";
import ProductManager from "../../manager/ProductManager";

export default {
  components: {
    Report
  },
  async created() {
    await this.$store.dispatch("AllItemList/getItemBrand");
    await this.$store.dispatch("AllItemList/getItemType");
    await this.$store.dispatch("AllItemList/getAllItemCount");
    let info = [this.pagination.currentPage, this.pagination.size];

    await this.$store.dispatch("AllItemList/getItemList", info);
    this.pagination.total = Number(
      this.$store.getters["AllItemList/allItemCount"]
    );
    this.loadingState = true;
    if (this.dataList.length !== 0) {
      this.loadingState = false;
    }
  },
  watch: {
    nameOrNum: async function(value) {
      this.searchKey.primaryKey = value;
      await this.filter();
    },
    currentPage: async function(value) {
      this.pagination.currentPage = value;
      await this.filter();
    },
    type: function(val) {
      this.searchKey.itemType = val;
    },
    brand: function(val) {
      this.searchKey.itemBrand = val;
    }
  },
  computed: {
    dataList: function() {
      let list = this.$store.getters["AllItemList/itemList"];
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
    }
  },
  data() {
    return {
      loadingState: true,
      productManager: new ProductManager(),
      nameOrNum: "",
      type: "",
      brand: "",
      currentPage: 1,
      /** search key */
      searchKey: {
        primaryKey: "",
        itemType: "",
        itemBrand: "",
        auditStatus: ""
      },
      pagination: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      dialog: {
        title: "",
        visible: false
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
      append: false,
      selectedReport: {
        id: "",
        name: "",
        images: [],
        no: ""
      }
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
        return "rnp-row-color";
      }

      return "";
    },
    async search() {
      this.currentPage = 1;
      await this.filter();
    },
    async reset() {
      this.currentPage = 1;
      this.searchKey.itemType = this.type = "";
      this.searchKey.itemBrand = this.brand = "";
      await this.filter();
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
    },
    async filter() {
      let info = [
        this.pagination.currentPage,
        this.pagination.size,
        this.searchKey
      ];

      this.pagination.total = Number(
        await this.$store.dispatch("AllItemList/getFilterList", info)
      );
    },
    check(row) {
      this.checkDialogVisible = true;
      this.selectedReport = {
        id: row.id,
        name: row.name,
        images: row.images,
        no: row.productNum
      };
    }
  }
};
</script>

<style>
.rnp-search-box {
  background-color: white;
  height: 70px;
  width: 100%;
  margin: auto;
  padding-left: 20px;
}
.rnp-search .el-input__inner {
  margin-top: 15px;
  width: 20%;
  border-radius: 30px;
  float: left;
  margin-left: 10px;
}
.rnp-search-icon .el-input__prefix {
  margin-top: 10px;
  left: 15px;
}
.rnp-list-box {
  width: 100%;
  background-color: lightgray;
  padding-top: 20px;
  padding-bottom: 20px;
}
.rnp-body {
  width: 97%;
  margin: auto;
  background-color: white;
  padding-top: 15px;
}
.rnp-point {
  float: left;
  padding-left: 10px;
  color: blue;
  margin-top: 10px;
}
.rnp-title {
  font-size: 30px;
  font-weight: bold;
  color: black;
}
.rnp-line {
  margin-top: 15px;
  height: 1px;
  width: 100%;
  margin: auto;
  background-color: gray;
}
.rnp-classify {
  padding-top: 15px;
  padding-bottom: 15px;
}
.rnp-select {
  margin-left: 15px;
}
.rnp-round-button {
  float: right;
  padding-right: 15px;
}
.rnp-pagination {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}
.el-table .rnp-row-color {
  background: rgb(248, 245, 245);
}
.rnp-table-images {
  float: left;
  position: absolute;
  width: 60px;
  height: 50px;
  -webkit-transition: width 1s;
  transition: width 1s;
}
.rnp-table-images:hover {
  width: 50px;
  z-index: 999;
}
.rnp-image-form {
  margin-left: 5px;
}
.rnp-dialog-title .el-dialog__title {
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
}
.rnp-dialog-close .el-dialog__headerbtn {
  font-size: 30px;
  font-weight: bold;
  top: 20px;
}
.rnp-dialog-body .el-dialog__body {
  padding: 10px 20px;
}
.rnp-suffix {
  font-size: 12px;
}
.rnp-table .el-table th > .cell {
  padding-left: 2px;
  padding-right: 2px;
}
.rnp-font {
  font-size: 20px;
}
.rnp-image {
  float: left;
  position: absolute;
  width: 80px;
  height: 80px;
  -webkit-transition: width 1s;
  transition: width 1s;
}
.rnp-image:hover {
  width: 90px;
  z-index: 999;
}
.rnp-interval {
  margin-top: 20px;
  margin-bottom: 30px;
}
</style>
