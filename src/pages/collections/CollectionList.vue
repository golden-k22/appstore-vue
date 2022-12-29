<template>
  <div class="collection-list-main">
    <!-- ============================ header ==============================-->
    <div class="collection-list-header">
      <div class="row">
        <div class="col-6">
          <label class="collection-list-point">&#9679;</label>
          <label class="collection-list-title">特辑管理页</label>
        </div>
        <div class="col-6 collection-list-padding">
          <el-button
            icon="el-icon-refresh"
            class="collection-list-bg-secondary collection-list-buttons"
            @click="refreshPage"
          >刷新</el-button>
          <el-button
            type="success"
            class="collection-list-buttons collection-list-interv"
            @click="newCollection"
          >创建</el-button>
        </div>
      </div>
    </div>
    <!-- ============================= end header  ========================== -->
    <!-- ========================== number of status ======================== -->
    <div class="m-3">
      <div class="row white-back">
        <p class="collection-list-bg-primary collection-list-box-size m-3">
          合辑总数 (
          <span v-text="collectionCount"></span>
          )
        </p>
        <p class="collection-list-bg-secondary collection-list-box-size m-3">
          {{colTypeState[0].value}} (
          <span v-text="standaloneCount"></span>
          )
        </p>
        <p class="collection-list-bg-secondary collection-list-box-size m-3">
          {{colTypeState[1].value}} (
          <span v-text="otherCount"></span>
          )
        </p>

        <p class="collection-list-bg-secondary collection-list-box-size m-3">
          {{colTypeState[2].value}} (
          <span v-text="exceptTableCount"></span>
          )
        </p>
        <p class="collection-list-bg-secondary collection-list-box-size m-3">
          {{colTypeState[3].value}} (
          <span v-text="listCount"></span>
          )
        </p>
        <p class="collection-list-bg-secondary collection-list-box-size m-3">
          {{colTypeState[4].value}} (
          <span v-text="flowCount"></span>
          )
        </p>
        <p class="collection-list-bg-secondary collection-list-box-size m-3">
          {{colTypeState[5].value}} (
          <span v-text="firstCount"></span>
          )
        </p>
      </div>
    </div>

    <!-- ============================= data list ================================== -->
    <div class="m-3">
      <div class="row white-back collection-list-xheader">
        <div class="col-6 collection-list-align-left">
          <h3 class="fa fa-list m-2">特辑列表</h3>
        </div>
      </div>

      <!-- ================================== table ===============================-->
      <div
        class="row collection-list-xbody"
        v-loading="loadingState"
        element-loading-text="Loading..."
        element-loading-background="rgba(240, 240, 240, 0.8)"
      >
        <el-table :data="currentCollections" border class="collection-list-table-size">
          <el-table-column prop="id" width="100" label="特辑ID" align="center"></el-table-column>
          <el-table-column prop="colTitle" label="特辑题目" align="center"></el-table-column>
          <el-table-column prop="colType" label="特辑类型" align="center"></el-table-column>
          <el-table-column prop="onUse" label="状态" align="center"></el-table-column>
          <el-table-column label="特辑图片" align="center">
            <template slot-scope="scope">
              <img :src.sync="scope.row.pic" class="image" width="131px" height="121px">
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button @click="checkCollection(scope.row.id)" type="text" size="small">查看特辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- ============================ pagination box ============================== -->
      <div class="collection-list-page">
        <pagination
          v-on:pageInfoChanged="getPaginationInfo"
          v-bind:totals="this.totalCollections"
          v-bind:pages="this.pageSizes"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "../../pages/collections/Pagination";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      name: 0,
      totalCollections: 0,
      currentCollections: [],
      paginationInfo: {}, //pagination information: count of order per page, selected page number
      pageSizes: [4, 8, 12], //count list of order to be displayed in page
      allCollections: [],
      loadingState: true,
      colTypeState: [
        {
          type: 1,
          value: "独家"
        },
        {
          type: 2,
          value: "其他"
        },
        {
          type: 3,
          value: "列表外展示"
        },
        {
          type: 4,
          value: "列表外2"
        },
        {
          type: 5,
          value: "商品流"
        },
        {
          type: 6,
          value: "首页"
        }
      ]
    };
  },
  computed: {
    /* get Total Number of collectionCount */
    collections: function() {
      return this.$store.getters["Collections/getCollections"];
    },
    /* get Total Number of collectionCount */
    collectionCount: function() {
      return this.$store.getters["Collections/collectionCount"];
    },

    /* get Total Number of standaloneCount */
    standaloneCount: function() {
      return this.$store.getters["Collections/standaloneCount"];
    },

    /* get Total Number of otherCount */
    otherCount: function() {
      return this.$store.getters["Collections/otherCount"];
    },

    /* get Total Number of exceptTableCount */
    exceptTableCount: function() {
      return this.$store.getters["Collections/exceptTableCount"];
    },
    listCount: function() {
      return this.$store.getters["Collections/getListCount"];
    },
    flowCount: function() {
      return this.$store.getters["Collections/getFlowCount"];
    },
    firstCount: function() {
      return this.$store.getters["Collections/getFirstCount"];
    }
  },
  async created() {
    await this.$store.dispatch("Collections/getCollectionsFromDB");
    await this.$store.dispatch("Collections/getStatusCount");

    if (this.collections !== "") {
      this.loadingState = false;
    }

    this.paginationInfo = {
      capacity: this.pageSizes[0],
      page: 1
    };

    this.totalCollections = this.collections.length;
    this.allCollections = this.collections;

    this.displayList(this.paginationInfo);
  },

  methods: {
    /* click of checkorder button of table */
    async checkCollection(id) {
      this.$router.push(`collections/${id}`);
    },
    //pagination information change handle
    async getPaginationInfo(capacity, currentPage) {
      this.paginationInfo = {
        capacity: capacity,
        page: currentPage
      };

      await this.displayList(this.paginationInfo);
    },

    //collections list displaying including loding process(dialog)
    async displayList(pageInfo) {
      this.totalCollections = this.allCollections.length;
      this.currentCollections = [];
      let length = this.allCollections.length;
      let startRow = (pageInfo.page - 1) * pageInfo.capacity;

      let endRow;

      if (pageInfo.page * pageInfo.capacity <= length) {
        endRow = pageInfo.page * pageInfo.capacity;
      } else {
        endRow = length;
      }

      for (let i = startRow; i < endRow; i++) {
        this.currentCollections.push(this.allCollections[i]);
      }

      let useState = ["禁忌", "可用"];

      for (let i = 0; i < this.currentCollections.length; i++) {
        if (Number(this.currentCollections[i].colType)) {
          let id = this.currentCollections[i].colType - 1;

          if (id === -1) {
            this.currentCollections[i].colType = "";
          } else {
            this.currentCollections[i].colType = this.colTypeState[id].value;
          }

          id = this.currentCollections[i].onUse;
          this.currentCollections[i].onUse = useState[id];
        } else {
          break;
        }
      }
    },

    /* refresh page */
    refreshPage() {
      this.allCollections = this.collections;
      this.paginationInfo = {
        capacity: this.pageSizes[0],
        page: 1
      };

      this.totalCollections = this.collections.length;
      this.allCollections = this.collections;

      this.displayList(this.paginationInfo);
    },
    newCollection() {
      this.$router.push({ path: "collections/newcollection" });
    }
  }
};
</script>

<style>
.collection-list-padding {
  padding-top: 10px;
  padding-right: 30px;
}
.collection-list-interv {
  margin-right: 20px;
}
.collection-list-point {
  padding-left: 20px;
  font-size: 16px;
  padding-top: 10px;
  color: blue;
}
.collection-list-title {
  font-weight: bold;
  font-size: 28px;
  padding-top: 10px;
}
.collection-list-buttons {
  float: right;
}
.collection-list-main {
  width: calc(100% - 30px);
  margin: auto;
  font-weight: bold;
}

.white-back {
  background-color: white;
}

.collection-list-header {
  background-color: white;
  height: 70px;
}
.collection-list-tag-size {
  width: 10px;
  height: 40px;
}
.collection-list-align-right {
  text-align: right;
}
.collection-list-align-left {
  text-align: left;
}
.collection-list-align-center {
  text-align: center;
}
.collection-list-float-left {
  float: left;
}

.collection-list-margin-top {
  margin-top: 12px;
}

.collection-list-bg-primary {
  background-color: rgb(178, 196, 244);
  color: white;
}
.collection-list-bg-secondary {
  background: rgb(123, 154, 251);
  border: 1px solid #cccccc;
  color: white;
}

.collection-list-xheader {
  padding: 10px;
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
.collection-list-xbody {
  border-style: solid solid solid solid;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-color: #dddddd;
  border-width: 1px;
}
.collection-list-box-size {
  width: 150px;
  height: 40px;
  padding-top: 8px;
  padding-bottom: 5px;
  border-radius: 40px;
  text-align: center;
}

.collection-list-table-size {
  width: 100%;
  margin: auto;
}

/** modal style */
.collection-list-modal {
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
.collection-list-align-button {
  text-align: right;
  margin-top: 7px;
}
.collection-list-page {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}
</style>


