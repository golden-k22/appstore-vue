<template>
  <div>
    <div>
      <label class="audit-item-text audit-item-bold">商品名称:&nbsp;&nbsp;{{itemList.name}}</label>
    </div>
    <div class="audit-item-img-box">
      <el-carousel :interval="3000" type="card" height="200px" class="audit-item-images">
        <el-carousel-item v-for="(image, index) in itemList.images" :key="index">
          <img :src="image" class="audit-item-image" @click="expandEvent(image)">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div>
      <h6>反馈详情:</h6>
      <el-input
        type="textarea"
        placeholder="填写反馈"
        :autosize="{ minRows: 7, maxRows: 20}"
        v-model="update.refuseReason"
      ></el-input>
    </div>
    <div class="row audit-item-button">
      <div class="col-5 offset-7">
        <el-button type="primary" @click="pass()">审核通过</el-button>
        <el-button type="danger" @click="notPass()">审核不通过</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="expandImg" alt>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Object,
      default: function() {
        return {
          id: "",
          name: "",
          images: [],
          no: ""
        };
      }
    }
  },
  watch: {
    itemList: function(value) {
      this.update.id = value.id;
      this.update.itemId = value.no;
      this.update.refuseReason = "";
    }
  },
  data() {
    return {
      update: {
        auditTime: "",
        id: 0,
        itemId: 0,
        refuseReason: "",
        status: 0
      },
      dialogVisible: false,
      expandImg: ""
    };
  },
  methods: {
    expandEvent(image) {
      this.expandImg = image;
      this.dialogVisible = true;
    },
    async pass() {
      this.update.status = 1;
      let str = await this.updateData();

      if (str === "Success!") {
        this.$emit("status", 1);
      }
    },
    async notPass() {
      this.update.id = this.itemList.id;
      this.update.itemId = this.itemList.no;
      this.update.auditTime = new Date().getTime;
      this.update.status = 2;
      let str = await this.updateData();

      if (str === "Success!") {
        this.$emit("status", 2);
      }
    },
    async updateData() {
      this.update.id = this.itemList.id;
      this.update.itemId = this.itemList.no;
      this.update.auditTime = new Date().getTime();
      this.$store.commit("Audit/setUpdateAudit", this.update);
      let str = await this.$store.dispatch("Audit/updateAuditResult");

      this.notify(str);
      return str;
    },
    notify(str) {
      if (str === "Success!") {
        this.$notify({
          title: "Success",
          message: str,
          type: "success"
        });
      } else {
        this.$notify({
          title: "Warning",
          message: str,
          type: "warning"
        });
      }
    }
  }
};
</script>

<style>
.audit-item-text {
  font-size: 20px;
}
.audit-item-bold {
  font-weight: bold;
}
.audit-item-right {
  float: right;
}
.audit-item-button {
  padding-top: 40px;
  padding-bottom: 20px;
}
.audit-item-position {
  position: relative;
}
.audit-item-image {
  width: 100%;
  height: 100%;
}
.audit-item-images {
  margin: auto;
}
.audit-item-img-box {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
