<template>
  <div class="collection-box">
    <div class="collection-body">
      <!-- ================= header ==================-->
      <el-row>
        <div class="collection-header">
          <label class="collection-point">&#9679;</label>
          <label class="collection-title">发布编辑特辑</label>
        </div>
      </el-row>
      <!-- =========== end header =================== -->
      <!-- ==============  body ===================== -->
      <el-row>
        <div style="padding:50px" class="block-inside bg-white">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <!-- ==================== title ====================== -->
            <el-form-item label="Collection Title" prop="colTitle">
              <el-input v-model="ruleForm.colTitle" style="width: 50%" placeholder="请输入特辑名称"></el-input>
            </el-form-item>

            <!-- =================== type ========================= -->
            <el-form-item label="Collection Type" prop="c_type" style="text-align:left">
              <el-select v-model="typeValue" filterable placeholder="Choose type">
                <el-option
                  v-for="state in colTypeState"
                  :key="state.type"
                  :label="state.value"
                  :value="state.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- ================== onUse ====================== -->
            <el-row>
              <el-form-item label="Show in App">
                <el-switch v-model="onUse"></el-switch>
              </el-form-item>
            </el-row>

            <!--  ============== nduction editor ============== -->
            <div class="collection-height-200" style="width:80%;">
              <!-- <ckeditor :editor="editor" v-model="collections.intro" :config="editorConfig"></ckeditor> -->
              <el-input
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 50}"
                placeholder="Please input introduction of collection"
                v-model="collections.intro"
              ></el-input>
            </div>

            <!-- =============== image Group ========================-->
            <div style=" margin-top:30px">
              <el-row>
                <el-col
                  style="float:left;  width:20%"
                  class="radio-custom"
                  v-for="iter in 4"
                  :key="iter"
                >
                  <el-radio
                    v-model="selectedImage"
                    :label="iter"
                    border
                    class="radio-custom"
                    @change="imgchange"
                  >
                    <span class="avatar-uploader">
                      <el-upload
                        :on-change="handleImageChange"
                        action="#"
                        accept="image/jpeg, image/png"
                        :auto-upload="false"
                      >
                        <img
                          v-if="imagesUrl[iter - 1] !== ''"
                          :src.sync="imagesUrl[iter - 1]"
                          class="avatar"
                        >
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </span>
                  </el-radio>
                  <div style="padding-bottom: 20px; text-align: center;">
                    <el-button
                      type="danger"
                      v-if="imagesUrl[iter - 1] !== ''"
                      round
                      @click="deleteImage(iter)"
                    >消除</el-button>
                  </div>
                </el-col>
                <!-- ============ upload ===============-->
                <el-col :span="3" class="m-3">
                  <el-button
                    type="primary"
                    @click="submitUpload"
                    round
                    class="collection-margin-top-150 collection-btn-width-100"
                  >上传图片</el-button>
                </el-col>
              </el-row>
            </div>

            <div class="new-collection-upload">
              <el-upload
                drag
                :on-change="handleVideoChange"
                action="#"
                accept="video/mp4, video/avi, video/wmv"
                :auto-upload="false"
              >
                <video width="100%" height="400" controls v-if="videoUrl !== ''" :src="videoUrl"></video>
                <i
                  v-else
                  class="el-icon-plus avatar-video-uploader-icon"
                  style="padding-top: 50px;"
                ></i>
              </el-upload>
            </div>

            <div style="padding-bottom: 20px; padding-left: 200px;">
              <el-button type="danger" v-if="videoUrl !== ''" round @click="deleteVideo">消除</el-button>
              <el-button
                type="success"
                @click="submitVideo"
                round
                class="collection-btn-width-100"
                v-if="videoFile.name !== undefined"
              >镜头传送</el-button>
            </div>

            <!-- ================= add item ======================= -->
            <el-form-item class="collect-Item-form" label="Add Item" prop="name">
              <el-select v-model="selectedItem" filterable placeholder="Choose Item" collapse-tags>
                <el-option
                  v-for="(item, index) in items"
                  :key="item.id"
                  :label="item.itemName"
                  :value="index"
                ></el-option>
              </el-select>
              <!-- <el-button class="collect-btm-plus" v-on:click="addItem" icon="el-icon-plus"></el-button> -->
            </el-form-item>

            <!-- ============ display selected items =============== -->
            <el-form-item prop="region">
              <el-table :data="allSelectedItems" stripe class="collection-table-size">
                <el-table-column prop="itemName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="id" label="商品ID" width="200" align="center"></el-table-column>
                <el-table-column label="Operation" align="center">
                  <el-button
                    slot-scope="scope"
                    @click.native.prevent="deleteRow(scope.$index,allSelectedItems)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </el-table-column>
              </el-table>
            </el-form-item>

            <!-- ================ pagination ========================-->
            <!--             <el-form-item class="collect-pagination">
              <pagination
                v-on:pageInfoChanged="getPaginationInfo"
                v-bind:totals="this.totalAddedItems"
                v-bind:pages="this.pageSizes"
              ></pagination>
            </el-form-item>-->
            <!-- ================= submit ===========================-->
            <el-row class="collect-text-align-center margin-top-40">
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
                class="collection-btn-width-100 pull-right"
                round
              >发布</el-button>
            </el-row>
          </el-form>
        </div>

        <!-- ================= process dialog ================= -->
        <el-dialog
          :visible.sync="progressVisible"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <el-progress :percentage="progressPercent"></el-progress>
        </el-dialog>
      </el-row>
    </div>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Pagination from "./Pagination";
import { UPLOAD_FILE } from "./../../store/api";
import HttpHandler from "../../util/HttpHandler";

export default {
  components: {
    Pagination
  },
  watch: {
    selectedItem: function(value) {
      this.addItem(value);
    }
  },
  data() {
    return {
      collectionType: "",
      totalAddedItems: 0,
      pageSizes: [4],
      paginationInfo: {},
      imgsel: 1,
      files: [],
      selectedImage: 1,
      images: [],
      imagesUrl: [],
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      collections: {
        allPic: [],
        category: "",
        colTitle: "",
        colType: 0,
        id: 0,
        intro: "",
        onUse: 0,
        pic: "",
        productId: []
      },
      videoUrl: "",
      categ: "",
      httpHandler: new HttpHandler(),
      delivery: false,
      tableData: [],
      progressPercent: 0,
      progressVisible: false,
      allSelectedItems: [],
      /*      ruleForm: {
        colTitle: ""
      },*/
      rules: {
        colTitle: [
          {
            required: true,
            message: "请输入特辑题目",
            trigger: "blur"
          }
        ]
      },
      ruleForm: {
        colTitle: ""
      },

      videoFile: {},

      currentDate: new Date(),

      selectedItem: "",
      productId: [],
      onUse: false,
      colTypeState: [
        {
          type: 1,
          value: "精"
        },
        {
          type: 2,
          value: "其他"
        },
        {
          type: 3,
          value: "列表外1"
        },
        {
          type: 4,
          value: "列表外2"
        },
        {
          type: 5,
          value: "商品流"
        },
        {
          type: 6,
          value: "首页"
        }
      ],
      typeValue: "",
      colId: -1
    };
  },

  computed: {
    items: function() {
      return this.$store.getters["Collections/getItems"];
    }
  },

  async created() {
    console.log(this.videoFile.name);
    this.images = [];
    this.imagesUrl = [];
    for (let i = 0; i < 4; i++) {
      this.imagesUrl.push("");
      this.images.push("");
    }

    await this.$store.dispatch("Collections/getItemsFromDB");

    this.paginationInfo = {
      capacity: this.pageSizes[0],
      page: 1
    };
  },

  methods: {
    deleteVideo() {
      this.videoUrl = "";
    },
    /* init Table */
    initTableData() {
      let tmp = this.productId;
      let tmpTable = [];

      for (const i in tmp) {
        let item = {};

        item.id = this.items[Number(tmp[i])].id;
        item.itemName = this.items[Number(tmp[i])].itemName;
        tmpTable.push(item);
      }

      this.allSelectedItems = tmpTable;

      //this.displayList();
    },
    /* initialize images */
    initImages() {
      this.imgsel = 1;
      this.imagesUrl[0] = this.collections.pic;
      for (let i = 0; i < this.collections.allPic.length; i++) {
        if (this.collections.allPic[i] !== null) {
          this.imagesUrl[i] = this.collections.allPic[i];
        }
        if (this.collections.allPic[i] === this.collections.pic) {
          this.imgsel = i + 1;
        }
      }

      this.collections.allPic.forEach(element => {
        this.imagesUrl.push(element);
      });
    },

    /* select image */
    imgchange(val) {
      this.imgsel = val;
    },

    /* choose image from computer */
    handleImageChange(file, fileList) {
      const isValidFormat =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";

      if (!isValidFormat) {
        this.$message.error("picture must be JPG or PNG format!");
      } else {
        let tmp = this.selectedImage;

        this.images[this.selectedImage - 1] = fileList;
        this.imagesUrl[this.selectedImage - 1] = URL.createObjectURL(file.raw);
        this.selectedImage = -1;
        this.selectedImage = tmp;
        this.files[this.selectedImage - 1] = file.raw;
      }
    },

    handleVideoChange(file) {
      const isValidFormat =
        file.raw.type === "video/avi" ||
        file.raw.type === "video/mp4" ||
        file.raw.type === "video/wmv";

      if (!isValidFormat) {
        this.$message.error("video must be avi or mp4 or wmv format!");
      } else {
        this.videoUrl = URL.createObjectURL(file.raw);
        this.videoFile = file.raw;
      }
    },
    /* delete selected items */
    deleteRow(index, rows) {
      rows.splice(index, 1);
      let id = 0;

      id = this.pageSizes[0] * (this.paginationInfo.page - 1) + index;

      this.productId.splice(id, 1);

      if (this.productId.length % this.paginationInfo.capacity === 0) {
        this.paginationInfo.page -= 1;
      }
      this.initTableData();
    },
    /* submit form data */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitCollection();
        } else {
          this.$notify.error({
            title: "错误",
            message: "提出失败了, 请输入集聚题目！"
          });
          return false;
        }
      });
    },
    async submitCollection() {
      this.collections.colTitle = this.ruleForm.colTitle;
      if (this.imagesUrl[this.imgsel - 1].includes("blob:http")) {
        this.$notify.warning({
          title: "错误",
          message: '按钮"上传图片"'
        });
        return;
      }
      this.collections.pic = this.imagesUrl[this.imgsel - 1];
      this.collections.onUse = this.onUse ? 1 : 0;
      this.collections.colType = 0;
      this.collections.productId = this.productId;

      for (let i = 0; i < this.colTypeState.length; i++) {
        if (this.colTypeState[i].value === this.typeValue) {
          this.collections.colType = i + 1;
        }
      }

      /* this.collections.allPic=[];
      for (let i = 0; i < this.imagesUrl.length; i++) {
        if (this.imagesUrl[i] === "") {
          break;
        } else {
          this.collections.allPic.push(this.imagesUrl[i]);
        }
      } */

      let res = await this.$store.dispatch(
        "Collections/addCollection",
        this.collections
      );

      if (res) {
        this.$notify({
          title: "成功",
          message: "提出成功",
          type: "success"
        });
        this.goBack();
      } else {
        this.$notify.error({
          title: "错误",
          message: "提出失败了"
        });
      }
    },

    /* go back */
    goBack() {
      this.$router.push({ path: "/collections" });
    },

    /* submitUpload */
    async submitUpload() {
      this.progressVisible = true;
      for (let i = 0; i < this.files.length; i++) {
        let formData = new FormData();

        formData.append("file", this.files[i]);
        let fileResponse = await this.httpHandler.uploadFile(
          `${UPLOAD_FILE}`,
          "POST",
          formData,
          this.showProgress
        );

        if (fileResponse.status === 200) {
          this.imagesUrl[i] = fileResponse.data.fileDownloadUri;
        }
      }
    },

    async submitVideo() {
      this.progressVisible = true;

      let formData = new FormData();

      formData.append("file", this.videoFile);
      let fileResponse = await this.httpHandler.uploadFile(
        `${UPLOAD_FILE}`,
        "POST",
        formData,
        this.showProgress
      );

      if (fileResponse.status === 200) {
        this.videoUrl = fileResponse.data.fileDownloadUri;
      }
    },

    /* delete Image */
    deleteImage(iter) {
      let tmp = this.selectedImage;

      this.images[iter - 1] = {};
      this.imagesUrl[iter - 1] = require("../../assets/tmp_main_img.png");
      this.imagesUrl[iter - 1] = "";
      this.selectedImage = -1;
      this.selectedImage = tmp;
    },

    /* show progress bar  */
    showProgress(percent) {
      this.progressPercent = Math.floor(percent);
      if (percent === 100) {
        this.progressVisible = false;
      }
    },

    /* add Item */
    addItem(value) {
      if (value !== "") {
        let num = 0;

        for (let i in this.productId) {
          if (Number(this.productId[i]) === value) {
            break;
          }
          num++;
        }

        if (num === this.productId.length) {
          this.productId.push(value);
        }

        let tmp = this.productId;
        let tmpTable = [];

        for (const i in tmp) {
          let item = {
            id: this.items[Number(tmp[i])].id,
            itemName: this.items[Number(tmp[i])].itemName
          };

          tmpTable.push(item);
        }

        this.allSelectedItems = tmpTable;

        //this.displayList();
      }
    },

    /**
     *  pagination information change handle
     */
    async getPaginationInfo(capacity, currentPage) {
      this.paginationInfo = {
        capacity: capacity,
        page: currentPage
      };

      //this.displayList();
    },

    /* orders list displaying including loding process(dialog) */
    displayList() {
      this.tableData = this.allSelectedItems;
    }
  }
};
</script>

<style>
.collect-text-align-left {
  text-align: left;
}

.collect-text-align-center {
  text-align: center;
}

.margin-top-40 {
  margin-top: 40px;
}

.col-9 {
  padding: 30px;
}

.collection-header {
  color: black;
  height: 70px;
}

.collect-content-background {
  background-color: rgb(249, 249, 249);
}

.content-padding {
  padding: 20px 40px 20px 40px;
}

.block-inside {
  border: 1px solid #eee;
  background-color: white;
  width: 100%;
}

.block-inside-left {
  border-right: 1px solid #eee;
  background-color: rgb(252, 252, 252);
  width: 100%;
}

.block-inside-right {
  border-left: 1px solid #eee;
  background-color: rgb(252, 252, 252);
  width: 100%;
  height: 397px;
}

.mark-icon {
  width: 10px;
  height: 30px;
  background-color: cadetblue;
}
.el-switch.is-checked .el-switch__core {
  border-color: rgb(26, 188, 156);
  background-color: rgb(26, 188, 156);
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  margin: 0 5px;
  background-color: white;
  color: #606266;
  min-width: 30px;
  border: 1px solid #eee;
  border-radius: 2px;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: rgb(26, 188, 156);
  color: #fff;
}

.collect-pagination {
  text-align: center;
}

.el-col-offset-5 {
  margin-left: 4%;
}

.collect-tag-size {
  width: 10px;
  height: 40px;
  color: rgb(26, 188, 156);
}
.collect-align-right {
  text-align: right;
}
.collect-align-left {
  text-align: left;
}
.collect-align-center {
  text-align: center;
}
.collect-float-left {
  float: left;
}

.collect-bg-primary {
  background-color: #1abc9c;
}

.el-button--primary {
  color: #fff;
  background-color: rgb(26, 188, 156);
}

.img-ctrl-back {
  padding: 1px 5px 10px 5px;
  background-color: #eee;
}
.el-button + .el-button {
  margin-left: 0px;
}

.button:hover {
  color: red;
  border-color: transparent;
}

.el tab {
  text-align: center;
}

.collect-Item-form {
  margin-top: 40px;
  margin-right: 300px;
}
.demo-form-inline {
  margin-left: 130px;
}

.collect-btm-plus {
  text-align: center;
  background-color: rgb(242, 242, 242);
}
.el-icon-plus {
  margin-left: 0px;
}

.collect-category-select {
  margin-right: 570px;
}

.radio-custom {
  height: 100% !important;
  border-radius: 0% !important;
  padding: 12px 12px 0px 10px !important;
  width: 100%;
}
.radio-custom .el-radio__input {
  display: none !important;
}

.collection-table-size {
  width: 98%;
  text-align: left;
}

.collection-point {
  float: left;
  padding-left: 10px;
  color: blue;
  margin-top: 10px;
}

.collection-title {
  font-size: 30px;
  font-weight: bold;
  color: black;
}

.collection-box {
  width: 100%;
  background-color: lightgray;
  padding-top: 20px;
  padding-bottom: 20px;
}
.collection-body {
  width: 97%;
  margin: auto;
  background-color: white;
  padding-top: 15px;
}

.avatar-uploader .el-upload {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: 0;
  width: 100%;
}
.avatar-uploader .el-upload:hover {
  border-color: #8c939d;
}
.avatar-uploader-icon {
  position: relative;
  font-size: 50px;
  font-weight: bold;
  color: #8c939d;
  width: 100%;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 178px;
  display: block;
}

.radio-custom .el-radio.is-bordered.is-checked {
  border-color: #8c939d;
}
.radio-custom .el-radio.is-bordered {
  border: 1px dashed #dcdfe6;
}
.el-upload-list {
  height: 0px !important;
  display: none !important;
}

.collection-margin-top-150 {
  margin-top: 170px;
}

.collection-height-200 .ck.ck-editor__editable_inline {
  height: 300px;
}

.collection-btn-width-100 {
  width: 130px;
  background-color: #7997fe;
}

.new-collection-upload {
  margin-bottom: 20px;
  height: 400px;
}
.new-collection-upload .el-upload {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: 0;
  width: 40%;
}
.new-collection-upload .el-upload-dragger {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.new-collection-video-button {
  padding-left: 30px;
}

.avatar-video-uploader-icon {
  position: relative;
  font-size: 50px;
  font-weight: bold;
  color: #8c939d;
  width: 100%;
  line-height: 300px;
  text-align: center;
}
</style>
