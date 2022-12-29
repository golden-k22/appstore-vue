<template>
  <div>
    <div class="smart-search-title">
      <p class="smart-search-title-text">高级检索</p>
      <!-- close button -->
      <img src="../../../assets/image/close.png" class="smart-search-close-button" @click="close">
    </div>
    <el-form ref="smartSearchForm" :model="searchKeyList">
      <div class="row smart-search-top">
        <div class="col-6">
          <div class="smart-search-labels">
            <label>商品分类:</label>
          </div>
          <div class="smart-search-labels">
            <el-form-item prop="itemType">
              <el-select v-model="searchKeyList.itemType" placeholder="请选择商品分类">
                <el-option
                  v-for="(itemType, index0) in searchList.itemTypeList"
                  :key="index0"
                  :value="itemType.id"
                  :label="itemType.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="col-6">
          <div class="smart-search-labels">
            <label>商品品牌:</label>
          </div>
          <div class="smart-search-labels">
            <el-form-item prop="itemBrand">
              <el-select v-model="searchKeyList.itemBrand" placeholder="请选择品牌">
                <el-option
                  v-for="(itemBrand, index1) in searchList.itemBrandList"
                  :key="index1"
                  :value="itemBrand"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="row smart-search-top">
        <div class="col-6">
          <div class="smart-search-labels">
            <label>审核状态:</label>
          </div>
          <div class="smart-search-labels">
            <el-form-item prop="auditStatus">
              <el-select v-model="searchKeyList.auditStatus" placeholder="全都">
                <el-option
                  v-for="(auditStatus, index3) in searchList.auditStatusList"
                  :key="index3"
                  :value="index3"
                  :label="auditStatus"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="col-6">
          <div class="smart-search-labels">
            <label>输入搜索:</label>
          </div>
          <div class="smart-search-input">
            <el-form-item prop="primaryKey">
              <el-input v-model="primaryKey" placeholder="商品名称/商品货号"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <!-- line -->
    <div class="smart-search-top">
      <div class="smart-search-line"></div>
    </div>
    <div class="row smart-search-top">
      <div class="col-7"></div>
      <div class="smart-search-button col-5">
        <button
          type="button"
          class="btn btn-outline-info smart-search-button-interval"
          @click="reset"
        >重置</button>
        <button type="button" class="btn smart-search-button-color" @click="search">开始检索</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.searchKeyList = this.$store.getters["AllItemList/smartSearchKey"];
    this.primaryKey = this.searchKeyList.primaryKey;
  },
  props: {
    searchList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      primaryKey: "",
      searchKeyList: {
        primaryKey: "",
        itemType: "",
        itemBrand: "",
        auditStatus: ""
      }
    };
  },
  methods: {
    /** Close button event */
    close() {
      this.$emit("smartSearchClose", true);
    },
    /** reset button event */
    reset() {
      this.primaryKey = "";
      this.searchKeyList = {
        primaryKey: "",
        itemType: "",
        itemBrand: "",
        auditStatus: ""
      };
      //this.$refs["smartSearchForm"].resetFields();
    },
    /** search button event */
    search() {
      this.searchKeyList.primaryKey = this.primaryKey;
      this.$emit("smartSearchKey", this.searchKeyList);
      this.close();
    }
  }
};
</script>

<style>
/** title */
.smart-search-title {
  height: 50px;
  background-color: rgb(243, 240, 240);
  position: relative;
  width: 100%;
  margin: auto;
}
/** title text */
.smart-search-title-text {
  line-height: 50px;
  float: left;
  margin-left: 10px;
}
/** close button */
.smart-search-close-button {
  width: 20px;
  height: 20px;
  float: right;
  margin-top: 12px;
  margin-right: 10px;
}
/** top value of elements */
.smart-search-top {
  margin-top: 20px;
}
/** layout of reset, search button */
.smart-search-button {
  margin-bottom: 20px;
}
/** interval between buttons */
.smart-search-button-interval {
  margin-right: 15px;
}
/** background of search button */
.smart-search-button-color {
  background-color: lightseagreen;
}
/** text style of label */
.smart-search-labels {
  text-align: left;
  margin-left: 18%;
}
/** search input */
.smart-search-input {
  width: 65%;
  margin: auto;
}
/** line */
.smart-search-line {
  height: 1px;
  background-color: rgb(243, 240, 240);
  margin: auto;
  width: 100%;
}
</style>
