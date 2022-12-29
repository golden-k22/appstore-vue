<template>
  <div>
    <div class="audit-detail-title">
      <p class="audit-detail-title-text">审核详情</p>
      <!-- close button -->
      <img src="../../../assets/image/close.png" class="audit-detail-close-button" @click="close">
    </div>
    <div>
      <table class="table table-bordered audit-detail-table">
        <thead class="audit-detail-table-header">
          <tr>
            <th>审核时间</th>
            <th>审核人员</th>
            <th>审核结果</th>
            <th>反馈详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in auditDetailList" v-bind:key="index">
            <td>{{item.auditDate}}</td>
            <td>{{item.auditPeople}}</td>
            <td>{{item.auditResult}}</td>
            <td>{{item.response}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="audit-detail-bottom"></div>
  </div>
</template>

<script>
import ProductManager from "../../../manager/ProductManager";

export default {
  async mounted() {
    await this.updateTable();
  },
  computed: {
    itemId: function() {
      return this.$store.getters["AllItemList/selectedId"];
    }
  },
  data() {
    return {
      productManager: new ProductManager(),
      auditDetailList: []
    };
  },
  methods: {
    /** Close button event */
    close() {
      this.$emit("auditDetailClose", true);
    },
    async updateTable() {
      await this.$store.dispatch("AllItemList/getAuditDetail");
      let list = this.$store.getters["AllItemList/auditDetail"];
      let item;

      for (let i = 0; i < list.length; i++) {
        item = {
          auditDate: "",
          auditPeople: "",
          auditResult: "",
          response: ""
        };
        item.auditDate = this.productManager.getDate(list[i].audited);
        item.response = list[i].comment;
        item.auditPeople = "admin";
        item.auditResult = this.productManager.getAuditStatus(list[i].status);

        this.auditDetailList.push(item);
      }
    }
  }
};
</script>

<style>
/** title */
.audit-detail-title {
  height: 50px;
  background-color: rgb(243, 240, 240);
  position: relative;
  width: 100%;
  margin: auto;
}
/** title text */
.audit-detail-title-text {
  line-height: 50px;
  float: left;
  margin-left: 10px;
}
/** close button */
.audit-detail-close-button {
  width: 20px;
  height: 20px;
  float: right;
  margin-top: 12px;
  margin-right: 10px;
}
/** bottom space */
.audit-detail-bottom {
  height: 20px;
}
/** top value of elements */
.audit-detail-table {
  margin: auto;
  width: 95%;
}
/** table header color */
.audit-detail-table-header {
  background-color: rgba(250, 250, 250, 0.8);
}
</style>
