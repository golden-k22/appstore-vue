<template>
  <div>
    <div class="row">
      <div class="col-6">
        <div>
          <div class="pdp-img-box">
            <el-carousel :interval="3000" type="card" height="200px" class="pdp-images">
              <el-carousel-item v-for="(image, index) in images" :key="index">
                <img :src="image" class="pdp-image" @click="expandEvent(image)">
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="pdp-type-box">
          <el-form :inline="true" class="pdp-typ-input">
            <el-form-item label="商品类型:">
              <el-input v-model="firstLabel" placeholder clearable></el-input>
            </el-form-item>
            <el-form-item label>
              <label>&nbsp;&rArr;&nbsp;</label>
            </el-form-item>
            <el-form-item label>
              <el-input v-model="secondLabel" placeholder clearable></el-input>
            </el-form-item>
          </el-form>
          <div class="pdp-type-list">
            <el-select v-model="first" placeholder @change="firstChange">
              <el-option
                v-for="(item, index) in firstTypes"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="second" placeholder @change="secondChange">
              <el-option
                v-for="(item, index) in secondTypeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="pdp-type-save">
          <el-button type="primary" class="pdp-type-button" @click="saveType">保存</el-button>
        </div>
      </div>
      <div class="col-6">
        <div>
          <el-form :inline="true">
            <el-form-item label="商品名称:" class="pdp-input">
              <el-input v-model="name" placeholder :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form :inline="true">
            <el-form-item label="商品编号:" class="pdp-input">
              <el-input v-model="no" placeholder :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form :inline="true">
            <el-form-item label="商品品牌:" class="pdp-input">
              <el-input v-model="brand" placeholder :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form :inline="true">
            <el-form-item label="审核状态:" class="pdp-input">
              <el-input v-model="status" placeholder :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form :inline="true">
            <el-form-item label="商品价格:" class="pdp-input">
              <el-input v-model="price" placeholder :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form :inline="true">
            <el-form-item label="商品大小:" class="pdp-input">
              <el-input v-model="size" placeholder :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form :inline="true">
            <el-form-item label="商品颜色:" class="pdp-input">
              <el-input v-model="color" placeholder :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="pdp-tag-box">
      <div class="row">
        <label>Product Tag:&nbsp;&nbsp;</label>
        <el-tag
          class="pdp-tag-margin"
          :key="index"
          v-for="(tag, index) in tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{getTagName(tag)}}</el-tag>
      </div>
      <div class="row">
        <div class="col-2">
          <div class="pdp-tag-row" v-for="(tag, index) in getTagPairs()" :key="index">
            <el-button type="primary" plain @click="addTag(2*index)">{{tag.first.name}}</el-button>
            <el-button
              v-if="tag.second!==null"
              type="primary"
              plain
              @click="addTag(2*index+1)"
            >{{tag.second.name}}</el-button>
          </div>
        </div>
        <div class="col-6">
          <div>
            <el-button type="primary" class="pdp-tag-save" @click="saveTags">保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <div style="padding-bottom:20px;">
      <div style="text-align:center">
        <el-button type="primary" style="margin-top: 20px;" @click="next">下一步, 修改信息</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="expandImg" alt>
    </el-dialog>
  </div>
</template>

<script>
import ProductManager from "../../manager/ProductManager";

export default {
  data() {
    return {
      first: "",
      second: "",
      chooseType: "",
      secondTypeList: [],
      updateItem: {},
      firstLabel: "",
      secondLabel: "",
      productManager: new ProductManager(),
      name: "",
      no: "",
      brand: "",
      color: "",
      status: "",
      price: "",
      size: "",
      images: [],
      tags: [],
      typeError: true,
      tagError: true,
      expandImg: "",
      dialogVisible: false
    };
  },
  methods: {
    expandEvent(image) {
      this.expandImg = image;
      this.dialogVisible = true;
    },
    saveType() {
      this.typeError = false;
      if (this.firstLabel === "") {
        this.typeError = true;
      }
      if (this.secondLabel === "") {
        this.typeError = true;
      }
      if (this.firstLabel === "其他") {
        this.typeError = false;
      }
      if (this.typeError) {
        this.$message({
          message: "请补全商品类型!",
          type: "error"
        });
      }
    },
    saveTags() {
      this.updateItem.features.tags = this.tags;
      this.tagError = false;
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    addTag(id) {
      let index = 0;

      for (let i in this.tags) {
        if (this.tagList[id].id === this.tags[i]) {
          break;
        }
        index++;
      }
      if (index === this.tags.length) {
        this.tags.push(this.tagList[id].id);
      }
    },
    getTagPairs() {
      let pairs = [];

      for (let i = 0; i < this.tagList.length / 2 - 0.5; i++) {
        pairs.push({
          first: this.tagList[2 * i],
          second: this.tagList[2 * i + 1]
        });
      }
      if (this.tagList.length % 2 === 1) {
        pairs.push({
          first: this.tagList[this.tagList.length - 1],
          second: null
        });
      }
      return pairs;
    },
    getTagName(id) {
      let res = "";

      for (let i in this.tagList) {
        if (id === this.tagList[i].id) {
          res = this.tagList[i].name;
          break;
        }
      }
      return res;
    },
    async setSecondTypeList(id) {
      await this.$store.dispatch("Item/getSubTypeList", id);
      this.secondTypeList = this.$store.getters["Item/subTypeList"];
    },
    async firstChange(val) {
      this.firstLabel = "";
      this.secondLabel = "";
      this.second = "";
      this.updateItem.features.kind = val;
      await this.setSecondTypeList(val);
      await this.$store.dispatch("AllItemList/getItemTypeById", this.first);
      let str1 = this.$store.getters["AllItemList/itemTypeById"];

      if (str1 === undefined) {
        str1 = "";
      }
      this.firstLabel = str1;
      this.chooseType = this.firstLabel;
    },
    async secondChange(val) {
      this.secondLabel = "";

      this.updateItem.features.subKind = val;
      let idList = [this.first, val];

      await this.$store.dispatch("Item/getSubTypeById", idList);

      let str2 = this.$store.getters["Item/subTypeById"].name;

      if (str2 === undefined) {
        str2 = "";
      }
      this.secondLabel = str2;
      this.chooseType = this.firstLabel + " > " + this.secondLabel;
    },

    next() {
      if (this.typeError) {
        this.$message({
          message: "请保存商品类型!",
          type: "error"
        });
      } else if (this.tagError) {
        this.$message({
          message: "请保存商品tags!",
          type: "error"
        });
      } else {
        this.$store.commit("Item/setUpdateItem", this.updateItem);
        this.$store.commit("Item/setChooseType", this.chooseType);
        this.$emit("next", 1);
      }
    },
    getSize(id) {
      let res = "";

      for (let i in this.sizeList) {
        if (id === this.sizeList[i].id) {
          res = this.sizeList[i].name;
          break;
        }
      }
      return res;
    }
  },
  computed: {
    firstTypes: function() {
      return this.$store.getters["AllItemList/itemType"];
    },
    item: function() {
      return this.$store.getters["AllItemList/itemById"];
    },
    sizeList: function() {
      return this.$store.getters["Item/sizeList"];
    },
    tagList: function() {
      return this.$store.getters["Item/tagList"];
    }
  },
  async created() {
    await this.$store.dispatch("AllItemList/getItemType");
    await this.$store.dispatch(
      "AllItemList/getItemById",
      this.$store.getters["Item/id"]
    );
    if (this.item !== null) {
      this.updateItem = this.item;
      this.first = this.item.features.kind;
      await this.firstChange(this.first);
      this.second = this.item.features.subKind;
      await this.secondChange(this.second);
      if (this.firstLabel === "其他") {
        this.second = "";
      }
      this.name = this.item.features.name;
      this.no = this.item.no;
      this.brand = this.item.features.brand;
      this.color = this.item.attributes.color;
      this.status = this.productManager.getAuditStatus(this.item.status);
      this.price = "$" + this.item.features.price;
      this.images = this.item.attributes.restPhotos;
      await this.$store.dispatch("Item/getSizeList", this.item.features.kind);
      this.size = this.getSize(this.item.attributes.size);
      this.tags = this.item.features.tags;
    }
    await this.$store.dispatch("Item/getTagList");
  }
};
</script>
<style>
.pdp-image {
  width: 100%;
  height: 100%;
}
.pdp-images {
  margin: auto;
}
.pdp-img-box {
  padding-top: 10px;
}
.pdp-input .el-input.is-disabled .el-input__inner {
  color: black;
  background-color: white;
  width: 300px;
}
.pdp-type-box {
  padding-left: 20px;
  padding-top: 40px;
}
.pdp-typ-input .el-input__inner {
  width: 150px;
}
.pdp-type-save {
  padding-top: 20px;
}
.pdp-type-button {
  width: 90%;
}
.pdp-tag-box {
  padding-left: 20px;
}
.pdp-tag-row {
  padding-top: 20px;
}
.pdp-tag-margin {
  margin-left: 10px;
  margin-right: 10px;
}
.pdp-tag-save {
  width: 90%;
  height: 150px;
  margin-top: 50px;
}
</style>
