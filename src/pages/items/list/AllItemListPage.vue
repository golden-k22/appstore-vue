<template>
  <div class="item-list-bacKground">
    <!-- line -->
    <!-- title -->
    <div class="item-list-title">
      <label class="item-list-point">&#9679;</label>
      <!-- title text -->
      <label class="item-list-title-text">商品管理页</label>
      <!-- refresh button -->
      <button type="button" class="btn btn-info item-list-refresh-button" @click="refresh">
        <img src="../../../assets/image/refresh.png" class="item-list-refresh-button-image">刷新
      </button>
    </div>
    <!-- line -->
    <!-- state information  -->
    <div class="row item-list-info">
      <label class="item-list-allitem item-list-radius">
        &nbsp;所有物品(
        <label>{{Number(allItemCount)}}</label>)&nbsp;
      </label>
      <label class="item-list-waiting-audit item-list-radius">
        &nbsp;等待审核物品(
        <label>{{Number(waitingAuditCount)}}</label>)&nbsp;
      </label>
      <label class="item-list-notpass item-list-radius">
        &nbsp;未通过审核物品(
        <label>{{Number(notPassAuditCount)}}</label>) &nbsp;
      </label>
    </div>
    <!-- search -->
    <div class="item-list-sub">
      <div class="item-list-search-title item-list-subtitles-background">
        <label class="item-list-search-title-text">搜索:</label>
        <!--
        search button-->
        <button
          type="button"
          class="btn btn-primary item-list-smartsearch-button item-list-radius"
          @click="smartSearchClick"
        >&nbsp;超级搜索&nbsp;</button>
      </div>
      <!-- search body -->
      <form class="item-list-search-body form-inline">
        <label class="item-list-search-body-padding">搜索:</label>
        <input placeholder="商品名称/ID" v-model="primaryKey" class="form-control">
        <label class="item-list-search-body-padding">商品类型:</label>
        <el-select
          v-model="searchKey.itemType"
          placeholder="选择类型"
          class="item-list-search-body-padding"
        >
          <el-option
            v-for="(type, index1) in itemTypeList"
            :key="index1"
            :value="type.id"
            :label="type.name"
          ></el-option>
        </el-select>
        <label class="item-list-search-body-padding">商品品牌:</label>
        <el-select
          v-model="searchKey.itemBrand"
          placeholder="选择品牌"
          class="item-list-search-body-padding"
        >
          <el-option
            v-for="(brand, index2) in itemBrandList"
            :key="index2"
            :value="brand"
            :label="brand"
          ></el-option>
        </el-select>
        <!-- search button -->
        <button
          type="button"
          class="btn btn-success item-list-radius"
          @click="search"
        >&nbsp;&nbsp;查找&nbsp;&nbsp;</button>
      </form>
    </div>
    <!-- Item list table -->
    <div
      class="item-list-sub"
      v-loading="loadingState"
      element-loading-text="Loading..."
      element-loading-background="rgba(240, 240, 240, 0.8)"
    >
      <!-- table title -->
      <div class="item-list-table-title item-list-subtitles-background">
        <label>
          &nbsp;&nbsp;
          <i class="fa fa-list-ul"></i>&nbsp;商品列表
        </label>
        <button
          type="button"
          class="btn btn-danger item-list-button-delete item-list-radius"
          @click="deleteClick"
        >&nbsp;删除&nbsp;</button>
      </div>
      <div class="item-list-table-head item-list-el-table">
        <el-table ref="product" stripe :data="itemList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="right" width="30"></el-table-column>
          <el-table-column label="全选" align="left" width="41" label-class-name="item-list-suffix"></el-table-column>
          <el-table-column label="商品编号">
            <template slot-scope="scope">
              <label>{{scope.row.itemNum}}</label>
            </template>
          </el-table-column>
          <el-table-column label="商品图片" width="270">
            <template slot-scope="scope">
              <div
                v-for="(image, index) in scope.row.itemImage"
                v-bind:key="index"
                class="item-list-image-container"
              >
                <img :src="image" class="item-list-image">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品名称 &amp; 品牌">
            <template slot-scope="scope">
              <label>{{scope.row.itemName}}</label>
              <br>
              <label>品牌:&nbsp;{{scope.row.brand}}</label>
            </template>
          </el-table-column>
          <el-table-column label="商品价格" align="center">
            <template slot-scope="scope">
              <label>价格:&nbsp;${{scope.row.price}}</label>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" width="135">
            <template slot-scope="scope">
              <label>{{scope.row.status}}</label>
              <br>
              <label
                class="item-list-paragraph item-list-cursor"
                @click="auditDetailClick(Number(scope.row.id))"
              >审核详情</label>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <label
                @click="checkClick(scope.row.id)"
                class="item-list-cursor item-list-paragraph"
              >查看</label>
              <label class="item-list-cursor item-list-paragraph" @click="edit(scope.row.id)">修改</label>
              <br>
              <label @click="reviewClick()" class="item-list-cursor item-list-paragraph">评论</label>
              <label
                @click="itemDelete(scope.row.id)"
                class="item-list-cursor item-list-paragraph item-list-color-red"
              >删除</label>
            </template>
          </el-table-column>
        </el-table>
        <div class="item-list-pagination">
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
    <div class="item-list-bottom"></div>
    <div v-if="modalState" class="item-list-modal">
      <div class="item-list-modal-type">
        <smart-search
          v-if="!smartSearchClose"
          :searchList="smartSearchList"
          v-on:smartSearchClose="setModalState"
          v-on:smartSearchKey="smartSearchEvent"
        ></smart-search>
        <audit-detail v-if="!auditDetailClose" v-on:auditDetailClose="setModalState"></audit-detail>
        <Check v-if="checkState" :id="checkId" v-on:checkClose="setModalState"></Check>
      </div>
    </div>
  </div>
</template>

<script>
import SmartSearch from "../../../components/items/list/SmartSearch";
import AuditDetail from "../../../components/items/list/AuditDetail";
import Check from "../../../components/items/list/Check";
import ProductManager from "../../../manager/ProductManager";

export default {
  components: {
    smartSearch: SmartSearch,
    auditDetail: AuditDetail,
    Check
  },
  async created() {
    await this.refresh();
  },
  data() {
    return {
      /** state of modal */
      modalState: false,
      /** search key */
      primaryKey: "",
      /** search key */
      searchKey: {
        primaryKey: "",
        itemType: "",
        itemBrand: "",
        auditStatus: ""
      },
      /** smart search list */
      smartSearchList: {
        itemTypeList: [],
        itemBrandList: [],
        auditStatusList: []
      },
      /** If false, display the smart search dialog; or close. */
      smartSearchClose: true,
      /** If false, display the audit detail dialog; or close. */
      auditDetailClose: true,
      /** selected id of item list */
      selectedId: 0,
      checkState: false,
      checkId: 0,
      pagination: {
        total: 0,
        size: 10,
        currentPage: 1
      },
      currentPage: 1,
      productManager: new ProductManager(),
      multipleSelection: [],
      loadingState: true
    };
  },
  watch: {
    currentPage: async function(newVal) {
      this.pagination.currentPage = newVal;
      await this.setProductList();
    }
  },
  computed: {
    /** all item count */
    allItemCount: function() {
      return this.$store.getters["AllItemList/allItemCount"];
    },
    /** waiting count for audit */
    waitingAuditCount: function() {
      return this.$store.getters["AllItemList/waitingCount"];
    },
    /** not passed count for audit */
    notPassAuditCount: function() {
      return this.$store.getters["AllItemList/notPassCount"];
    },
    itemBrandList: function() {
      let list = this.$store.getters["AllItemList/itemBrand"];

      return list;
    },
    itemTypeList: function() {
      let list = this.$store.getters["AllItemList/itemType"];

      return list;
    },
    itemList: function() {
      let list = this.$store.getters["AllItemList/itemList"];
      let data = [];

      for (let i in list) {
        data.push({
          itemNum: list[i].no,
          itemImage: list[i].attributes.restPhotos,
          itemName: list[i].features.name,
          brand: list[i].features.brand,
          price: list[i].features.price,
          status: this.productManager.getAuditStatus(Number(list[i].status)),
          id: list[i].id,
          itemTypeId: list[i].features.kind
        });
      }

      return data;
    }
  },
  methods: {
    reviewClick() {
      this.$router.push({ path: "/items/review" });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /* Smart search button event */
    smartSearchClick() {
      this.searchKey.primaryKey = this.primaryKey;
      this.$store.commit("AllItemList/setSmartSearchKey", this.searchKey);
      this.modalState = true;
      this.smartSearchClose = false;
      this.auditDetailClose = true;
      this.checkState = false;
    },
    /** Smart search */
    async smartSearchEvent(key) {
      this.searchKey = {
        primaryKey: key.primaryKey,
        itemType: key.itemType,
        itemBrand: key.itemBrand,
        auditStatus: key.auditStatus
      };
      this.primaryKey = this.searchKey.primaryKey;
      await this.setProductList();
    },
    /** Search button event */
    async search() {
      this.searchKey.primaryKey = this.primaryKey;
      this.searchKey.auditStatus = "";
      await this.setProductList();
    },
    async dispatchList() {
      await this.$store.dispatch("AllItemList/getItemBrand");
      await this.$store.dispatch("AllItemList/getItemType");
      await this.$store.dispatch("AllItemList/getAllItemCount");
      await this.$store.dispatch("AllItemList/getWaitingCount");
      await this.$store.dispatch("AllItemList/getNotPassCount");
    },
    /** Refresh button event */
    async refresh() {
      this.searchKey = {
        primaryKey: "",
        itemType: "",
        itemBrand: "",
        auditStatus: ""
      };
      this.primaryKey = this.searchKey.primaryKey;
      this.currentPage = 1;
      this.pagination.currentPage = this.currentPage;
      await this.setInitProductList();
      await this.dispatchList();
      this.smartSearchList = {
        itemTypeList: this.itemTypeList,
        itemBrandList: this.itemBrandList,
        auditStatusList: this.productManager.getAuditStatusList()
      };
      this.pagination.total = Number(this.allItemCount);
      this.loadingState = true;
      if (this.itemList.length !== 0) {
        this.loadingState = false;
      }
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
    },
    async setProductList() {
      let info = [
        this.pagination.currentPage,
        this.pagination.size,
        this.searchKey
      ];

      this.pagination.total = Number(
        await this.$store.dispatch("AllItemList/getFilterList", info)
      );
      this.loadingState = true;
      if (this.itemList.length !== 0) {
        this.loadingState = false;
      }
    },
    async setInitProductList() {
      let info = [this.pagination.currentPage, this.pagination.size];

      await this.$store.dispatch("AllItemList/getItemList", info);
    },
    checkClick(id) {
      this.checkId = id;
      this.checkState = true;
      this.modalState = true;
      this.smartSearchClose = true;
      this.auditDetailClose = true;
    },

    /* Audit detail paragraph event */
    auditDetailClick(index) {
      this.$store.commit("AllItemList/setSelectedId", index);
      this.modalState = true;
      this.smartSearchClose = true;
      this.auditDetailClose = false;
      this.checkState = false;
    },
    /** Setting the state of modal */
    setModalState(state) {
      this.smartSearchClose = state;
      this.auditDetailClose = state;
      this.checkState = !state;
      this.modalState = false;
    },
    /** check paragraph clcik event */
    edit(index) {
      this.$store.commit("Item/setId", index);
      this.$router.push("/items/audit/itemId/edit");
    },
    /** Delete of selected table data */
    async deleteClick() {
      this.$confirm("你确定要永久删除所选项目？ 继续？", "Warning", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          for (let i in this.multipleSelection) {
            let res = await this.$store.dispatch(
              "AllItemList/delete",
              this.multipleSelection[i].id
            );

            if (res === 0) {
              this.$message({
                message: "网络出错!",
                type: "error"
              });
              break;
            }
            if (res === 1) {
              this.$message({
                message: "成功!",
                type: "success"
              });
            }
            if (res === 2) {
              this.$message({
                message: "没找到商品!",
                type: "error"
              });
              break;
            }
          }
          await this.setProductList();
          await this.dispatchList();
        })
        .catch(() => {});
    },
    /***
     * selected item delete
     */
    async itemDelete(index) {
      this.$confirm("你确定要永久删除所选项目？ 继续？", "Warning", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$store.dispatch("AllItemList/delete", index);

          if (res === 0) {
            this.$message({
              message: "网络故障!",
              type: "error"
            });
          }
          if (res === 1) {
            this.$message({
              message: "成功!",
              type: "success"
            });
          }
          if (res === 2) {
            this.$message({
              message: "没找到商品!",
              type: "error"
            });
          }
          await this.setProductList();
          await this.dispatchList();
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
/** line style of title */
.item-list-line {
  height: 1px;
}
/** style of title div */
.item-list-title {
  height: 60px;
}
.item-list-point {
  float: left;
  padding-left: 10px;
  color: blue;
  line-height: 60px;
}
/** layout of title */
.item-list-title-text {
  line-height: 60px;
  font-size: 28px;
}
/** layout of refresh button */
.item-list-refresh-button {
  float: right;
  margin-top: 8px;
  margin-right: 20px;
}
/** image size of refresh button */
.item-list-refresh-button-image {
  width: 25px;
}
/** search, table style */
.item-list-sub {
  width: 95%;
  margin: auto;
  margin-top: 30px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(243, 240, 240);
}
/** paragraph color of item list table */
.item-list-paragraph {
  color: white;
  background-color: #0088dd;
  border-radius: 40px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
}
/** layout of images */
.item-list-image-container {
  float: left;
}
/** size of image on the table */
.item-list-image {
  width: 30px;
  margin-right: 10px;
}
/** text of item name and brand column, price column */
.item-list-table-text {
  text-align: left;
}
/** background of table body */
.item-list-table-body-background {
  background-color: white;
}
.item-list-table-title {
  height: 50px;
  width: 100%;
  text-align: left;
  line-height: 50px;
}
/** Delete button */
.item-list-button-delete {
  float: right;
  margin-right: 20px;
  margin-top: 8px;
}
/** style of information display box */
.item-list-info {
  text-align: left;
  font-size: 18px;
}
/** display style of all item label */
.item-list-allitem {
  margin-top: 25px;
  background-color: #0088dd;
  color: white;
  margin-right: 20px;
  margin-left: 20px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
}
/** display style of wating for audit label */
.item-list-waiting-audit {
  margin-top: 25px;
  background-color: #0088dd;
  color: white;
  margin-right: 20px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
}
/** display style of not pass audit label */
.item-list-notpass {
  margin-top: 25px;
  background-color: #0088dd;
  color: white;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
}
/** number color of state information */
.item-list-num-color {
  color: red;
}
/** background */
.item-list-bacKground {
  background-color: white;
}
/**  background color of titles */
.item-list-subtitles-background {
  background-color: rgb(243, 240, 240);
}
/** search form title */
.item-list-search-title {
  height: 60px;
}
.item-list-radius {
  border-radius: 30px;
}
/** smart search button */
.item-list-smartsearch-button {
  float: right;
  margin-top: 10px;
  margin-right: 15px;
}
/** search title text */
.item-list-search-title-text {
  text-align: left;
  float: left;
  margin-left: 20px;
  margin-top: 18px;
  font-size: 20px;
}
/** search body  */
.item-list-search-body {
  width: 100%;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: white;
}
.item-list-search-body-padding {
  padding-left: 10px;
  padding-right: 10px;
}
/** modal style */
.item-list-modal {
  position: fixed;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.8);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
  overflow: auto;
}
/** modal type */
.item-list-modal-type {
  top: 10%;
  width: 50%;
  margin-top: -21px;
  position: relative;
  background-color: white;
  margin: auto;
}
/** footer */
.item-list-bottom {
  height: 30px;
}
.item-list-cursor {
  cursor: pointer;
}
.item-list-pagination {
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}
.item-list-table-head .el-table th {
  background-color: rgb(248, 246, 246);
}
.item-list-suffix {
  font-size: 12px;
}
.item-list-el-table .el-table th > .cell {
  padding-left: 2px;
  padding-right: 2px;
}
.item-list-color-red {
  background-color: rgb(243, 86, 86);
}
</style>
