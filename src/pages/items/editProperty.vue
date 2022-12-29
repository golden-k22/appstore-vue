<template>
  <div style="margin:30px;">
    <el-form ref="itemProperty" :model="item" class="items-property-form-size items-error-property">
      <el-form-item label="尺码: " label-width="80px" prop="size">
        <el-radio-group v-model="size">
          <el-radio
            :label="item.name"
            v-for="(item, index) in sizeList"
            :key="index"
            :value="item.name"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="颜色: " label-width="80px" prop="color">
        <el-radio-group v-model="color">
          <el-radio
            :label="colorUnit"
            :value="colorUnit"
            v-for="(colorUnit, index) in colorUnits"
            :key="index"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="text-align:center">
        <span>
          <el-input v-model="addSizeItem" style="width:120px; margin-right:10px"></el-input>
        </span>
        <span>
          <el-button type="info" @click="addSize">新增尺码</el-button>
        </span>
      </el-form-item>
      <el-form-item class="items-photos" prop="photoSet">
        <el-col
          :span="4"
          v-for="(url, index) in photos"
          :key="index"
          style="border-right: solid;
         border-color: gainsboro;
         border-width: 1px;
         text-align:center"
        >
          <img :src="url" style="max-width:80%;min-width:50%" @click="expandEvent(url)">

          <el-button v-if="photo===url" type="text" style="color:red;">展示图片</el-button>
          <el-button v-else type="text" style="font-size:15px;" @click="setphoto(url)">设为展示图片</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button @click="back">上一步, 修改</el-button>
      <el-button type="primary" style="margin-top: 50px; margin-left:40px;" @click="save">保存</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="expandImg" alt>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {},
      colorUnits: ["black", "red", "write", "pink"],
      photos: [],
      photo: "",
      color: "",
      size: "",
      addSizeItem: "",
      expandImg: false,
      dialogVisible: false
    };
  },
  methods: {
    expandEvent(image) {
      this.expandImg = image;
      this.dialogVisible = true;
    },
    async addSize() {
      let info = [
        this.item.features.kind,
        {
          name: this.addSizeItem,
          kind: this.item.features.kind
        }
      ];

      let res = await this.$store.dispatch("Item/updateSize", info);

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
        await this.$store.dispatch("Item/getSizeList", this.item.features.kind);
      }
      if (res === 2) {
        this.$message({
          message: "错误请求!",
          type: "error"
        });
      }
      if (res === 3) {
        this.$message({
          message: "已存在!",
          type: "error"
        });
      }
    },
    back() {
      this.$emit("back", 3);
    },
    save() {
      this.item.attributes.headPhoto = this.photo;
      this.item.attributes.size = this.getSizeId(this.size);
      this.item.attributes.color = this.color;
      this.$store.commit("Item/setUpdateItem", this.item);
      this.$emit("save");
    },
    getSizeId(size) {
      let id = "";

      for (let i in this.sizeList) {
        if (size === this.sizeList[i].name) {
          id = this.sizeList[i].id;
          break;
        }
      }
      return id;
    },
    setphoto(url) {
      this.photo = url;
    },
    getInitSize(id) {
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
    sizeList: function() {
      return this.$store.getters["Item/sizeList"];
    }
  },
  async created() {
    this.item = this.$store.getters["Item/updateItem"];
    this.photos = this.item.attributes.restPhotos;
    this.photo = this.item.attributes.headPhoto;
    this.color = this.item.attributes.color;
    await this.$store.dispatch("Item/getSizeList", this.item.features.kind);
    this.size = this.getInitSize(this.item.attributes.size);
  }
};
</script>

<style>
.items-photos {
  margin-left: 0px;
  margin-bottom: 0px;
  border-top: solid;
  border-color: gainsboro;
  border-width: 1px;
}
.items-property-form-size {
  width: 60%;
  margin-top: 50px;
  margin-left: 250px;
  border: solid;
  border-color: gainsboro;
  border-radius: 2%;
  border-width: 1px;
  padding-top: 30px;
}
.items-error-property .el-form-item__error {
  margin-left: 224px;
}
.items_photo_alert {
  display: none;
}
</style>
