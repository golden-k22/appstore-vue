<template>
  <div class="system-push-title_block">
    <!-- header -->
    <div class="row system-push-product-page-title">
      <div class="col-sm-11">
        <label class="system-push-product-page-point">&#8226;</label>
        <label>后台推送列表</label>
      </div>
      <div class="col-sm-1">
        <el-button type="success" @click="newPush">创建</el-button>
      </div>
    </div>
    <!-- end header -->
    <!-- searching -->
    <div>
      <el-form :inline="true" class="system-push-list-form">
        <el-form-item label="创建用户:" class="system-push-select">
          <el-input placeholder="请输入用户ID" v-model="search.publisher"></el-input>
        </el-form-item>
        <el-form-item label="发布类型:" class="system-push-select">
          <el-input placeholder="请输入收货人" v-model="search.sendType"></el-input>
        </el-form-item>
        <el-form-item label="创建时间:" class="system-push-select">
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
        <el-form-item class="system-push-round-button">
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
        class="system-pus-list-table-size"
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
            <el-button @click="editPush(scope.row.id)" class="system-push_detail_click">修改</el-button>
            <el-button @click="handleDelete(scope.row.id)" class="system-push_edit_click">删除</el-button>
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
    <div class="system-push-pagination">
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
      deleteId: 0,
      currentSystemList: [],
      currentPage: 1,
      pagination: {
        current: 1,
        size: 4,
        total: 0
      },
      tempSystemList: [],
      search: {
        publisher: "",
        sendType: "",
        sendTime: ""
      }
    };
  },
  computed: {
    systemList: function() {
      return this.$store.getters["Notification/getSytemList"];
    },
    result: function() {
      return this.$store.getters["Notification/getStatus"];
    }
  },
  async created() {
    await this.$store.dispatch("Notification/getPushList", 1);
    //this.systemList = this.$store.getters["Notification/getSytemList"];

    this.tempSystemList = this.systemList;
    this.displayList();
  },

  methods: {
    /* if "创建"button clicked, display new push page. */
    newPush() {
      this.$router.push({ path: "/businesses/newpush" });
    },
    handleDelete(id) {
      this.deleteId = id;
      this.dialogVisible = true;
      this.selectFlag = false;
    },
    async pressConfirm() {
      this.tempSystemList = [];

      this.$store.commit("Notification/setId", this.deleteId);
      await this.$store.dispatch("Notification/deleteList");
      this.getResult();
      await this.$store.dispatch("Notification/getPushList", 1);

      this.tempSystemList = this.systemList;
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
      this.pagination.total = this.tempSystemList.length;
      this.currentSystemList = [];
      let min = (this.pagination.current - 1) * this.pagination.size;
      let max = Math.min(
        this.pagination.current * this.pagination.size,
        this.pagination.total
      );

      for (let i = min; i < max; i++) {
        this.currentSystemList.push(this.tempSystemList[i]);
      }

      let sendType = ["立即发送", "定时发送"];
      let deviceType = ["iOS", "Android", "全部"];
      let status = ["未发送", "已发送"];

      for (let j = 0; j < this.currentSystemList.length; j++) {
        if (
          !isNaN(Number(this.currentSystemList[j].sendType)) &&
          !isNaN(Number(this.currentSystemList[j].deviceType)) &&
          !isNaN(Number(this.currentSystemList[j].status))
        ) {
          let sendTypeId = this.currentSystemList[j].sendType - 1;

          if (sendTypeId === -1) {
            this.currentSystemList[j].sendType = "";
          } else {
            this.currentSystemList[j].sendType = sendType[sendTypeId];
          }
          let deviceTypeId = this.currentSystemList[j].deviceType - 1;

          if (deviceTypeId === -1) {
            this.currentSystemList[j].deviceType = "";
          } else {
            this.currentSystemList[j].deviceType = deviceType[deviceTypeId];
          }
          let statusId = this.currentSystemList[j].status;

          this.currentSystemList[j].status = status[statusId];
        }
      }
    },

    /**
     * If clicked "Search"button, display the systemList by filter.
     */
    searchPush() {
      //this.tempSystemList = [];
      let res = [];

      res = this.systemList.filter(
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
      this.tempSystemList = res;
      this.displayList();
    },
    /* refresh page */
    refreshPage() {
      this.search.publisher = "";
      this.search.sendType = "";
      this.search.sendTime = "";
      this.tempSystemList = this.systemList;
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
.system-push-product-page-title {
  text-align: left;
  margin-left: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
}
.system-push-product-page-point {
  color: blue;
}
.system-push-title_block {
  border: 1px solid #fff;
  border-radius: 4px;
  margin: auto;
  width: 99%;
  background-color: #fff;
}
.system-push-list-header {
  background: #f3f3f3;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #e6e6e6;
  height: 70px;
}
.system-push-list-tag-size {
  width: 10px;
  height: 40px;
}
.system-push-list-align-right {
  text-align: right;
}
.system-push-list-align-left {
  text-align: left;
}
.system-push-list-align-center {
  text-align: center;
}
.system-push-list-float-left {
  float: left;
}

.system-push-list-margin-top {
  margin-top: 12px;
}

.system-push-list-bg-primary {
  border-radius: 40px;
  background-color: #98b3dd;
  padding-top: 8px;
  color: white;
}
.system-push-list-bg-secondary {
  background: #0088dd;
  border-radius: 40px;
  padding-top: 8px;
  color: white;
}
.system-push-list-box-size {
  width: 140px;
  height: 40px;
}
.system-push-list-xheader {
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
.system-push-list-xbody {
  width: 100%;
  align-items: center;
}

.system-push-list-table-size {
  width: 100%;
  margin: auto;
  font-weight: bold;
}
.system-push-select {
  margin-left: 15px;
  font-weight: bold;
}
.system-push-round-button {
  float: right;
  padding-right: 15px;
}
.el-table .warning-row {
  background: rgb(200, 200, 200);
}
.system-push_detail_click {
  background: rgb(88, 88, 236);
  border: 0px;
  border-radius: 5px;
  color: white;
  width: 80px;
  height: 40px;
  font-weight: bold;
}
.system-push_edit_click {
  background: rgb(204, 58, 58);
  border: 0px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  width: 80px;
  height: 40px;
}
.system-push-image-size {
  border-radius: 5px;
  width: 20px;
  height: 20px;
  align-items: center;
}
.system-push-image label {
  margin-bottom: 0px;
}
.system-push-pagination {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 20px;
}
.system-push-list-form {
  width: 100%;
  margin: auto;
}
</style>


