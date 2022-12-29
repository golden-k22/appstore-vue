<template>
  <div class="edit-product-row">
    <div class="row">
      <div class="edit-product-title">
        <label class="edit-product-title-text">商品详情</label>
        <!-- close button -->
        <img src="../../../assets/image/close.png" class="edit-product-close-button" @click="close">
      </div>
    </div>
    <div class="epi-image-box">
      <el-carousel :interval="3000" type="card" height="200px" class="epi-images">
        <el-carousel-item v-for="(image, index) in item.imgs" :key="index">
          <img :src="image" class="epi-image" @click="expand(image)">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="row edit-product-input-text">
      <div class="col-6 edit-product-div">
        <label class="edit-product-label edit-product-left">商品编号</label>
        <el-input v-model="item.num" class="edit-product-input edit-product-left" :disabled="true"></el-input>
      </div>
      <div class="col-6 edit-product-div">
        <label class="edit-product-label">商品名称</label>
        <el-input v-model="item.proName" class="edit-product-input" :disabled="true"></el-input>
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-6">
        <div class="edit-product-item-height">
          <el-form :inline="true">
            <el-form-item
              v-for="(image, index) in item.imgs"
              :key="index"
              :class="index!==0?'edit-product-item-form':''"
            >
              <img :src="image" class="edit-product-item-image" @click="expand(image)">
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="col-6 edit-product-div edit-product-input-text">
        <label class="edit-product-p">商品编号</label>
        <el-input
          v-model="item.num"
          class="edit-product-input edit-product-bottom"
          :disabled="true"
        ></el-input>
        <label class="edit-product-p">商品名称</label>
        <el-input v-model="item.proName" class="edit-product-input" :disabled="true"></el-input>
      </div>
    </div>-->
    <div class="row edit-product-input-text">
      <div class="col-6 edit-product-div">
        <label class="edit-product-label edit-product-left">商品类型</label>
        <el-input v-model="item.type" class="edit-product-input edit-product-left" :disabled="true"></el-input>
      </div>
      <div class="col-6 edit-product-div">
        <label class="edit-product-label">商品分类型</label>
        <el-input v-model="item.subType" class="edit-product-input" :disabled="true"></el-input>
      </div>
    </div>
    <div class="row edit-product-input-text">
      <div class="col-6 edit-product-div">
        <label class="edit-product-label edit-product-left">商品价格</label>
        <el-input
          v-model="item.price"
          class="edit-product-input edit-product-left"
          :disabled="true"
        ></el-input>
      </div>
      <div class="col-6 edit-product-div">
        <label class="edit-product-p">审核状态</label>
        <el-input v-model="item.status" class="edit-product-input" :disabled="true"></el-input>
      </div>
    </div>
    <div class="row edit-product-input-text">
      <div class="col-6 edit-product-div">
        <label class="edit-product-label edit-product-left">商品颜色</label>
        <el-input
          v-model="item.color"
          class="edit-product-input edit-product-left"
          :disabled="true"
        ></el-input>
      </div>
      <div class="col-6 edit-product-div">
        <label class="edit-product-label">商品品牌</label>
        <el-input v-model="item.brand" class="edit-product-input" :disabled="true"></el-input>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
      <img width="100%" :src="expandImage" alt>
    </el-dialog>
  </div>
</template>

<script>
import ProductManager from "../../../manager/ProductManager";

export default {
  async created() {
    await this.$store.dispatch("AllItemList/getItemById", this.id);
    let kind = this.selectedItem.features.kind;
    let subKind = this.selectedItem.features.subKind;

    await this.$store.dispatch("AllItemList/getItemTypeById", kind);
    let idList = [kind, subKind];

    await this.$store.dispatch("Item/getSubTypeById", idList);
    let data = this.selectedItem;

    this.item = {
      id: data.id,
      imgs: data.attributes.restPhotos,
      num: data.no,
      proName: data.features.name,
      type: this.$store.getters["AllItemList/itemTypeById"],
      subType: this.$store.getters["Item/subTypeById"].name,
      brand: data.features.brand,
      price: "$" + data.features.price,
      status: this.productManager.getAuditStatus(data.status),
      color: data.attributes.color
    };
  },
  computed: {
    selectedItem: function() {
      return this.$store.getters["AllItemList/itemById"];
    }
  },
  props: {
    id: { type: Number, default: 0 }
  },
  data() {
    return {
      item: {
        id: "",
        imgs: [],
        num: "",
        proName: "",
        type: "",
        brand: "",
        price: "",
        status: ""
      },
      productManager: new ProductManager(),
      dialogVisible: false,
      expandImage: ""
    };
  },
  methods: {
    close() {
      this.$emit("checkClose", true);
    },
    expand(img) {
      this.expandImage = img;
      this.dialogVisible = true;
    }
  }
};
</script>

<style>
.edit-product-title {
  height: 50px;
  background-color: rgb(243, 240, 240);
  position: relative;
  width: 100%;
  margin: auto;
}
/** title text */
.edit-product-title-text {
  line-height: 50px;
  float: left;
  margin-left: 10px;
  font-size: 28px;
}
.edit-product-close-button {
  width: 20px;
  height: 20px;
  float: right;
  margin-top: 12px;
  margin-right: 10px;
}
.edit-product-image {
  width: 100px;
  height: 100px;
}
.edit-product-padding {
  padding-top: 30px;
  padding-bottom: 20px;
}
.edit-product-div {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: auto;
}
.edit-product-input {
  width: 90%;
}
.edit-product-left {
  margin-left: 20px;
}
.edit-product-bottom {
  margin-bottom: 10px;
}
.edit-label {
  font-size: 16px;
}
.edit-product-input-text .el-input.is-disabled .el-input__inner {
  color: black;
  background-color: white;
}
.edit-product-item-image {
  float: left;
  position: absolute;
  width: 120px;
  height: 150px;
  -webkit-transition: width 1s;
  transition: width 1s;
  margin-left: 10px;
}
.edit-product-item-form {
  margin-left: 50px;
}
.edit-product-item-image:hover {
  width: 140px;
  z-index: 2000;
}
.edit-product-item-height {
  height: 170px;
  padding-top: 20px;
}
.edit-product-auto {
  margin: auto;
}
.edit-product-row .row {
  margin-right: 0px;
  margin-left: 0px;
}
.epi-image {
  width: 100%;
  height: 100%;
}
.epi-images {
  margin: auto;
}
.epi-image-box {
  padding: 20px 20px 20px 20px;
}
</style>
