<template>
  <div>
    <div>
      <label class="audit-item-text audit-item-bold">商品名称:&nbsp;&nbsp;{{itemList.name}}</label>
    </div>
    <div class="audit-item-height">
      <el-form :inline="true">
        <el-form-item
          v-for="(image, index) in itemList.images"
          :key="index"
          :class="index!==0?'audit-item-form':''"
        >
          <img :src="image" class="audit-item-image">
        </el-form-item>
      </el-form>
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
        <el-button type="primary">Save</el-button>
        <el-button type="danger">Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {},
  props: {
    itemList: {
      type: Object,
      default: function() {
        return {
          id: "",
          name: "",
          image: [],
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
      }
    };
  },
  methods: {
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
      this.update.status = 0;
      let str = await this.updateData();

      if (str === "Success!") {
        this.$emit("status", 0);
      }
    },
    async updateData() {
      this.update.id = this.itemList.id;
      this.update.itemId = this.itemList.no;
      this.update.auditTime = new Date().getTime;
      this.update.status = 1;
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
  float: left;
  position: absolute;
  width: 150px;
  height: 150px;
  -webkit-transition: width 1s;
  transition: width 1s;
}
.audit-item-form {
  margin-left: 50px;
}
.audit-item-image:hover {
  width: 160px;
  z-index: 999;
}
.audit-item-height {
  height: 170px;
}
</style>
