<template>
  <div class="brandlist-background">
    <div class="brandlist-box">
      <div>
        <label class="brandlist-point">&#9679;</label>
        <label class="brandlist-title">品牌管理页</label>
      </div>
      <el-form :inline="true" class="brandlist-search">
        <el-form-item label="搜索:" class="brandlist-search-text">
          <el-input v-model="search" size="medium" placeholder="品牌名称"/>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" round icon="el-icon-search" @click="searchBrand">搜索</el-button>
          <el-button type="info" round icon="el-icon-refresh" @click="backBrands">返回</el-button>
        </el-form-item>
        <el-form-item class="brandlist-buttons">
          <el-button type="danger" round @click="handleDeleteButton">消除</el-button>
          <el-button type="success" round @click="newBrand">添加</el-button>
        </el-form-item>
      </el-form>
      <div class="brandlist-table">
        <el-table
          :data="displayBrand"
          style="width: 100%; cursor: pointer;"
          header-align="center"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowColor"
        >
          <el-table-column type="selection" width="32" align="right"></el-table-column>
          <el-table-column label="全选" align="left" width="41" label-class-name="brandlist-suffix"></el-table-column>
          <el-table-column prop="id" label="品牌编号" width="300" align="center"></el-table-column>
          <el-table-column prop="name" label="品牌名称" width="300" align="center"></el-table-column>
          <el-table-column align="center" label="Logo">
            <template slot-scope="scope">
              <img :src="scope.row.picture" v-if="!scope.row.picture==''" class="brandlist-photo">
            </template>
          </el-table-column>
          <!--  <el-table-column align="center" label="品牌类型" width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.brandStyle" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>-->
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">消除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="brandlist-pagination">
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
      <el-dialog title="警告" :visible.sync="dialogVisible" width="30%">
        <span>确定真想消除这个品牌</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pressCancel">取消</el-button>
          <el-button type="primary" @click="pressConfirm">同意</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    currentPage: function(value) {
      this.pagination.current = value;
      this.paginationFunc();
    }
  },
  data() {
    return {
      search: "",
      value1: "",
      logoUrl: "",
      searchBrandList: [],
      displayBrand: [],
      brands: [],
      options: [
        {
          value: "StreetWear",
          label: "StreetWear"
        },
        {
          value: "Vintage",
          label: "Vintage"
        },
        {
          value: "Luxury",
          label: "Luxury"
        },
        {
          value: "Avant Garde",
          label: "Avant Garde"
        },
        {
          value: "Tech Wear",
          label: "Tech Wear"
        },
        {
          value: "Minimalist",
          label: "Minimalist"
        }
      ],
      multipleSelection: [],
      dialogVisible: false,
      deleteId: 0,
      selectFlag: false,
      pagination: {
        current: 1,
        size: 12,
        total: 0
      },
      currentPage: 1
    };
  },
  methods: {
    /**
     * brandlists is selected.
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * delete selected brand information.
     */
    handleDelete(id) {
      this.deleteId = id;
      this.dialogVisible = true;
      this.selectFlag = false;
    },
    /**
     * If "delete"Button clicked, this method is called.
     */
    handleDeleteButton() {
      if (this.multipleSelection.length === 0) {
        /*  alert("Select CheckBox!"); */
        return;
      }
      this.dialogVisible = true;
      this.selectFlag = true;
    },
    /**
     * ask user and perform delete opreation.
     */
    async pressConfirm() {
      this.searchBrandList = [];
      if (this.selectFlag) {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.$store.commit("Brand/setId", this.multipleSelection[i].id);
          await this.$store.dispatch("Brand/deleteBrand");
          this.getResult();
        }
        await this.$store.dispatch("Brand/getBrandList");
        this.brands = this.$store.getters["Brand/getBrandList"];
        this.searchBrandList = this.brands;
        this.paginationFunc();
      } else {
        this.$store.commit("Brand/setId", this.deleteId);
        await this.$store.dispatch("Brand/deleteBrand");
        this.getResult();
        await this.$store.dispatch("Brand/getBrandList");
        this.brands = this.$store.getters["Brand/getBrandList"];
        this.searchBrandList = this.brands;
        this.paginationFunc();
      }
      this.dialogVisible = false;
    },
    /**
     * get requestResult
     */
    getResult() {
      if (this.result) {
        this.$notify({
          title: "Success",
          message: "删除成功了!",
          type: "success"
        });
      } else {
        this.$notify({
          title: "Error",
          message: "无法从商品列表中删除!",
          type: "error"
        });
      }
    },
    /**
     *  cancel opreation
     */
    pressCancel() {
      this.dialogVisible = false;
    },
    paginationFunc() {
      this.displayBrand = [];
      this.pagination.total = this.searchBrandList.length;
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        this.displayBrand.push(this.searchBrandList[i]);
      }

      this.pagination.current = 1;
    },
    /**
     * If clicked "Search"button, display the brandlist by filter.
     */
    searchBrand() {
      this.searchBrandList = [];
      this.searchBrandList = this.brands.filter(
        brand =>
          !this.search ||
          brand.name.toLowerCase().includes(this.search.toLowerCase())
      );

      this.paginationFunc();
    },
    /* If clicked "Back" button, display the total of brandlists. */
    backBrands() {
      this.searchBrandList = [];
      this.search = "";

      this.searchBrandList = this.brands;
      this.paginationFunc();
    },
    /* If clicked "addBrand" button, display the 'NewBrand' page. */
    newBrand() {
      this.$router.push({ path: "brands/new" });
    },
    // eslint-disable-next-line no-unused-vars
    tableRowColor({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "brandlist-row-color";
      }

      return "";
    },
    handleCurrentChange(page) {
      this.pagination.current = page;
    }
  },
  computed: {
    result: function() {
      return this.$store.getters["Brand/getStatus"];
    }
  },
  async created() {
    await this.$store.dispatch("Brand/getBrandList");
    this.brands = this.$store.getters["Brand/getBrandList"];
    this.searchBrandList = this.brands;
    this.paginationFunc();
  }
};
</script>

<style>
.brandlist-box {
  width: calc(100% - 30px);
  margin: auto;
  background-color: white;
}
.brandlist-point {
  float: left;
  padding-left: 10px;
  color: blue;
  padding-top: 15px;
}
.brandlist-title {
  font-size: 25px;
  font-weight: bold;
  color: black;
  padding-top: 10px;
}
.brandlist-background {
  background-color: rgb(238, 235, 235);
  padding-bottom: 20px;
}
.brandlist-search {
  margin-top: 20px;
}
.brandlist-buttons {
  float: right;
  padding-right: 10px;
}
.brandlist-search-text {
  padding-left: 20px;
}
.brandlist-left {
  padding-left: 120px;
}
.brandlist-delete {
  margin-top: 10px;
  margin-bottom: 10px;
}
.brandlist-photo {
  width: 50px;
  height: 50px;
  /*  position: absolute; */
  -webkit-transition: width 1s;
  transition: width 1s;
}
.brandlist-suffix {
  font-size: 12px;
}
.brandlist-table .el-table th > .cell {
  padding-left: 2px;
  padding-right: 2px;
}
.el-table .brandlist-row-color {
  background: rgb(248, 245, 245);
}
.brandlist-pagination {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}
</style>
