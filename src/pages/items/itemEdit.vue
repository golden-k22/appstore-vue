<template>
  <div>
    <div v-if="active===1" class="item-header"></div>
    <div v-if="active===2" class="item-header">修改商品信息</div>
    <div v-if="active===3" class="item-header">修改商品细节</div>
    <div class="item-step" style="margin-bottom:40px;">
      <el-steps :active="this.active" align-center>
        <el-step title="修改标签"></el-step>
        <el-step title="修改信息"></el-step>
        <el-step title="修改细节"></el-step>
      </el-steps>
    </div>
    <div>
      <component-choosetype v-if="active===1" v-on:next="nextPage"></component-choosetype>
      <component-editinfo v-if="active===2" v-on:next="nextPage" v-on:back="previousPage"></component-editinfo>
      <component-editproperty v-if="active===3" v-on:save="save" v-on:back="previousPage"></component-editproperty>
    </div>
  </div>
</template>

<script>
import chooseType from "./chooseType";
import editInfo from "./editInfo";
import editProperty from "./editProperty";

export default {
  components: {
    "component-choosetype": chooseType,
    "component-editinfo": editInfo,
    "component-editproperty": editProperty
  },
  data() {
    return {
      active: 1
    };
  },

  methods: {
    // go to next page
    nextPage(page) {
      this.active = page + 1;
    },
    //back to previous page
    previousPage(page) {
      this.active = page - 1;
    },

    // save all data
    async save() {
      let item = this.$store.getters["Item/updateItem"];

      let updateItem = {
        id: item.id,
        editable: {
          name: item.features.name,
          brand: item.features.brand,
          keyword: item.features.keyword,
          kind: item.features.kind,
          subKind: item.features.subKind,
          tags: item.features.tags
        },
        attributes: {
          size: item.attributes.size,
          color: item.attributes.color,
          headPhoto: item.attributes.headPhoto,
          restPhotos: item.attributes.restPhotos
        }
      };

      let res = await this.$store.dispatch("Item/update", updateItem);

      if (res === 0) {
        this.$message({
          message: "网络错误!",
          type: "error"
        });
      }
      if (res === 1) {
        this.$message({
          message: "成功!",
          type: "success"
        });
        this.$router.push({ path: "/items/all" });
      }
      if (res === 2) {
        this.$message({
          message: "错误请求!",
          type: "error"
        });
      }
      if (res === 3) {
        this.$message({
          message: "没有找到!",
          type: "error"
        });
      }
    }
  },
  async created() {}
};
</script>

<style>
.item-header {
  background: gainsboro;
  margin-top: 0px;
  margin-bottom: 40px;
  height: 40px;
  text-align: start;
  padding: 10px;
  font-family: fantasy;
}
.item-step .el-step__head.is-finish {
  color: #1ca751;
  border-color: #1ca751;
}
.el-step__title.is-finish {
  color: #1ca751;
}
</style>
