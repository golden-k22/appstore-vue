<template>
  <div class="follow-list-bacKground">
    <!-- line -->
    <!-- title -->
    <div class="follow-list-title">
      <label class="follow-list-point">&#9679;</label>
      <!-- title text -->
      <label class="follow-list-title-text">收藏商品</label>
    </div>
    <div class="follow-list-sub">
      <!-- table title -->
      <div class="follow-list-table-title follow-list-subtitles-background">
        <label>
          &nbsp;&nbsp;
          <i class="fa fa-list-ul"></i>&nbsp;数据列表
        </label>
      </div>
      <div class="follow-list-table-head follow-list-el-table">
        <el-table stripe :data="displayData">
          <el-table-column type="selection" align="right" width="30"></el-table-column>
          <el-table-column label="全选" align="left" width="41" label-class-name="follow-list-suffix"></el-table-column>
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
                class="follow-list-image-container"
              >
                <img :src="image" class="follow-list-image">
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
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="follow-product-pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        :pager-count="5"
        :page-size="pagination.size"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <div class="follow-list-bottom"></div>
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
  async created() {
    this.id = this.$route.params["userId"];

    this.itemList = await this.getAllItemList();
    this.displayList();
  },
  data() {
    return {
      /** data of item list table */
      itemList: [],
      items: [],
      id: 0,
      pagination: {
        current: 1,
        size: 12,
        total: 0
      },
      currentPage: 1,
      displayData: []
    };
  },
  methods: {
    handleCurrentChange(page) {
      this.pagination.current = page;
    },
    displayList() {
      this.displayData = [];
      this.pagination.total = this.itemList.length;
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        this.displayData.push(this.itemList[i]);
      }

      this.pagination.current = 1;
    },
    /** Getting the item list */
    async getAllItemList() {
      await this.$store.dispatch("Users/getSelectedList", this.id);
      this.items = this.$store.getters["Users/getFollowItem"];

      let list = [];
      let item = {};

      if (this.items === undefined) {
        list = [];
      } else {
        for (let i = 0; i < this.items.length; i++) {
          item = {
            itemNum: "",
            itemImage: [],
            itemName: "",
            brand: "",
            price: "",
            status: "",
            itemTypeId: "",
            selected: "",
            id: ""
          };
          item.itemNum = this.items[i].no;

          item.itemImage = this.items[i].attributes.restPhotos;

          /*         while (item.itemImage.length > 6) {
          item.itemImage.pop();
        } */
          item.itemName = this.items[i].features.name;
          item.brand = this.items[i].features.brand;
          item.price = this.items[i].features.price;
          switch (this.items[i].status) {
          case 0:
            item.status = "审核等待";
            break;
          case 1:
            item.status = "审核通过";
            break;
          case 2:
            item.status = "不通过";
            break;
          case 3:
            item.status = "已下架";
            break;
          case 4:
            item.status = "已售出";
            break;
          case 5:
            item.status = "已删除";
            break;
          case 6:
            item.status = "已下架(未审核)";
            break;
          case 7:
            item.status = "已售出(未审核)";
            break;
          default:
            break;
          }
          item.itemTypeId = this.items[i].user;
          item.selected = "";
          item.id = this.items[i].id;
          list.push(item);
        }
      }

      return list;
    }
  }
};
</script>

<style>
/** line style of title */
.follow-list-line {
  height: 1px;
}
/** style of title div */
.follow-list-title {
  height: 60px;
}
.follow-list-point {
  float: left;
  padding-left: 10px;
  color: blue;
  line-height: 60px;
}
/** layout of title */
.follow-list-title-text {
  line-height: 60px;
  font-size: 28px;
}

/** search, table style */
.follow-list-sub {
  width: 95%;
  margin: auto;
  margin-top: 30px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(243, 240, 240);
}
/** paragraph color of follow list table */
.follow-list-paragraph {
  color: white;
  background-color: #0088dd;
  border-radius: 40px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
}
/** layout of images */
.follow-list-image-container {
  float: left;
}
/** size of image on the table */
.follow-list-image {
  width: 30px;
  margin-right: 10px;
}
/** text of follow name and brand column, price column */
.follow-list-table-text {
  text-align: left;
}
/** background of table body */
.follow-list-table-body-background {
  background-color: white;
}
.follow-list-table-title {
  height: 50px;
  width: 100%;
  text-align: left;
  line-height: 50px;
}

/** number color of state information */
.follow-list-num-color {
  color: red;
}
/** background */
.follow-list-bacKground {
  background-color: white;
}
/**  background color of titles */
.follow-list-subtitles-background {
  background-color: rgb(243, 240, 240);
}

/** footer */
.follow-list-bottom {
  height: 30px;
}

.follow-list-table-head .el-table th {
  background-color: rgb(248, 246, 246);
}
.follow-list-suffix {
  font-size: 12px;
}
.follow-list-el-table .el-table th > .cell {
  padding-left: 2px;
  padding-right: 2px;
}
.follow-product-pagination {
  text-align: center;
}
</style>
