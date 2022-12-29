
<template>
  <div>
    <el-form
      class="items-form-size items-error"
      ref="editInfo"
      :model="display"
      :rules="rules"
      label-width="120px"
    >
      <div style="text-align:start;">
        <el-form-item label="商品类别:">{{this.itemType}}</el-form-item>
      </div>
      <el-form-item label="商品名称:" prop="name">
        <el-input v-model="display.name"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌:" prop="brand">
        <el-select v-model="display.brand" placeholder="Choose Brand">
          <el-option v-for="(brand, index) in brandList" :key="index" :label="brand" :value="brand"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品关键词:">
        <el-input v-model="display.keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="back">上一步, 选择标签和类别</el-button>
        <el-button
          type="primary"
          style="margin-top: 50px; margin-left:40px;"
          @click="next"
        >下一步, 修改细节</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemType: "",
      display: {
        name: "",
        brand: "",
        keyword: ""
      },
      item: {},
      rules: {
        name: [
          {
            required: true,
            message: "Please input this item name!",
            trigger: "change"
          }
        ],
        keyword: [
          {
            required: true,
            message: "Please input this item keyword!",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    next() {
      this.$refs.editInfo.validate(async valid => {
        if (valid) {
          this.item.features.name = this.display.name;
          this.item.features.brand = this.display.brand;
          this.item.features.keyword = this.display.keyword;
          this.$store.commit("Item/setUpdateItem", this.item);
          this.$emit("next", 2);
        }
      });
    },
    back() {
      this.$emit("back", 2);
    }
  },
  async created() {
    this.itemType = this.$store.getters["Item/chooseType"];
    this.item = this.$store.getters["Item/updateItem"];
    await this.$store.dispatch("AllItemList/getItemBrand");
    this.display = {
      name: this.item.features.name,
      brand: this.item.features.brand,
      keyword: this.item.features.keyword
    };
  },
  computed: {
    brandList: function() {
      return this.$store.getters["AllItemList/itemBrand"];
    }
  }
};
</script>

<style>
.items-form-size {
  width: 60%;
  margin-top: 50px;
  margin-left: 200px;
}
.items-error .el-form-item__error {
  margin-left: 24px;
}
</style>

