<template>
  <div class="push-title_block">
    <!-- header -->
    <div class="row push-product-page-title">
      <div class="col-sm-11">
        <label class="push-product-page-point">&#8226;</label>
        <label>客户端创建列表</label>
      </div>
    </div>
    <!-- end header -->
    <!-- searching -->
    <div>
      <el-form :inline="true" class="push-list-form">
        <el-form-item label="创建用户:" class="push-select">
          <el-input placeholder="请输入用户ID" v-model="search.publisher"></el-input>
        </el-form-item>
        <el-form-item label="发布类型:" class="push-select">
          <el-input placeholder="请输入收货人" v-model="search.sendType"></el-input>
        </el-form-item>
        <el-form-item label="创建时间:" class="push-select">
          <!--  <div class="col-6">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请输入提交时间"
              v-model="search.sendTime"
            ></el-date-picker>
          </div>-->
          <el-input placeholder="请输入提交时间" v-model="search.sendTime"></el-input>
        </el-form-item>
        <el-form-item class="push-round-button">
          <el-button type="primary" round @click="searchPush">查找</el-button>
          <el-button type="info" round @click="refreshPage">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- table -->
    <div>
      <el-table
        ref="multipleTable"
        :data="currentSystemList"
        class="push-list-table-size"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="100px" align="center"></el-table-column>
        <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="sendTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="sendType" label="发布类型" align="center"></el-table-column>
        <el-table-column prop="deviceType" label="设备类型" align="center"></el-table-column>
        <el-table-column prop="status" label="发送状态" align="center"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button @click="editPush(scope.row.id)" class="push_detail_click">修改</el-button>
            <el-button @click="handleDelete(scope.$index)" class="push_edit_click">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog title="警告" :visible.sync="dialogVisible" width="30%">
        <span>确定真想消除这个品牌</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pressCancel">取消</el-button>
          <el-button type="primary" @click="pressConfirm">同意</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- pagination box -->
    <div class="push-pagination">
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
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      deleteIndex: 0,
      currentSystemList: [],
      currentPage: 1,
      pagination: {
        current: 1,
        size: 4,
        total: 0
      },
      tempIOSList: [],
      search: {
        id: "",
        sendType: "",
        pushTime: ""
      }
    };
  },
  computed: {
    iosList: function() {
      return this.$store.getters["Notification/getIOSList"];
    },
    result: function() {
      return this.$store.getters["Notification/getStatus"];
    }
  },
  async created() {
    await this.$store.dispatch("Notification/getPushList", 2);
    this.tempIOSList = this.iosList;
    this.displayList();
  },

  methods: {
    handleDelete(index) {
      this.deleteIndex = index;
      this.dialogVisible = true;
      this.selectFlag = false;
    },
    async pressConfirm() {
      this.tempIOSList = [];

      this.$store.commit(
        "Notification/setId",
        this.iosList[this.deleteIndex].id
      );
      await this.$store.dispatch("Notification/deleteList");
      this.getResult();
      await this.$store.dispatch("Notification/getPushList", 2);
      this.tempIOSList = this.iosList;
      this.displayList();

      this.dialogVisible = false;
    },
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
    pressCancel() {
      this.dialogVisible = false;
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
    /* click of editPush button of table */
    editPush(id) {
      this.$router.push(`systempush/${id}`);
    },

    //pushlist displaying including loding process(dialog)
    displayList() {
      this.pagination.total = this.tempIOSList.length;
      this.currentSystemList = [];
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        this.currentSystemList.push(this.tempIOSList[i]);
      }
      let sendType = ["立即发送", "定时发送"];
      let deviceType = ["iOS", "Android", "全部"];
      let status = ["未发送", "已发送"];

      this.currentSystemList.forEach(item => {
        if (
          !isNaN(Number(item.sendType)) &&
          !isNaN(Number(item.deviceType)) &&
          !isNaN(Number(item.status))
        ) {
          let sendTypeId = item.sendType - 1;

          if (sendTypeId === -1) {
            item.sendType = "";
          } else {
            item.sendType = sendType[sendTypeId];
          }
          let deviceTypeId = item.deviceType - 1;

          if (deviceTypeId === -1) {
            item.deviceType = "";
          } else {
            item.deviceType = deviceType[deviceTypeId];
          }
          let statusId = item.status;

          item.status = status[statusId];
        }
      });
    },

    /**
     * If clicked "Search"button, display the iosList by filter.
     */
    searchPush() {
      let res = [];

      res = this.iosList.filter(
        item =>
          !this.search.publisher ||
          item.publisher.toString().includes(this.search.publisher.toString())
      );

      res = res.filter(
        item =>
          !this.search.sendType ||
          item.sendType.toString().includes(this.search.sendType.toString())
      );

      res = res.filter(
        item =>
          !this.search.sendTime ||
          item.sendTime.toString().includes(this.search.sendTime.toString())
      );

      this.tempIOSList = res;
      this.displayList();
    },
    /* refresh page */
    refreshPage() {
      this.search.publisher = "";
      this.search.sendType = "";
      this.search.sendTime = "";
      this.tempIOSList = this.iosList;
      this.displayList();
    }
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
.push-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
}
.push-product-page-point {
  color: blue;
}
.push-title_block {
  border: 1px solid #fff;
  border-radius: 4px;
  margin: auto;
  width: 99%;
  background-color: #fff;
}
.push-list-header {
  background: #f3f3f3;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #e6e6e6;
  height: 70px;
}
.push-list-tag-size {
  width: 10px;
  height: 40px;
}
.push-list-align-right {
  text-align: right;
}
.push-list-align-left {
  text-align: left;
}
.push-list-align-center {
  text-align: center;
}
.push-list-float-left {
  float: left;
}

.push-list-margin-top {
  margin-top: 12px;
}

.push-list-bg-primary {
  border-radius: 40px;
  background-color: #98b3dd;
  padding-top: 8px;
  color: white;
}
.push-list-bg-secondary {
  background: #0088dd;
  border-radius: 40px;
  padding-top: 8px;
  color: white;
}
.push-list-box-size {
  width: 140px;
  height: 40px;
}
.push-list-xheader {
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
.push-list-xbody {
  width: 100%;
  align-items: center;
}

.push-list-table-size {
  width: 100%;
  margin: auto;
  font-weight: bold;
}
.push-select {
  margin-left: 15px;
  font-weight: bold;
}
.push-round-button {
  float: right;
  padding-right: 15px;
}
.el-table .warning-row {
  background: rgb(200, 200, 200);
}
.push_detail_click {
  background: rgb(88, 88, 236);
  border: 0px;
  border-radius: 5px;
  color: white;
  width: 80px;
  height: 40px;
  font-weight: bold;
}
.push_edit_click {
  background: rgb(204, 58, 58);
  border: 0px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  width: 80px;
  height: 40px;
}
.push-image-size {
  border-radius: 5px;
  width: 20px;
  height: 20px;
  align-items: center;
}
.push-image label {
  margin-bottom: 0px;
}
.push-pagination {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}
.push-list-form {
  width: 100%;
  margin: auto;
}
</style>


