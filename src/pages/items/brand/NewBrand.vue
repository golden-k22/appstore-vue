<template>
  <div
    v-loading="loading"
    element-loading-text="上线中..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="new-brand"
  >
    <h2 class="new-brand-title">新品牌</h2>
    <el-form ref="brandList" :model="brand" status-icon :rules="inputErrorRules">
      <div class="newbrand-brandName">
        <el-form-item label-width="120px" prop="brandName" label="品牌名称:">
          <el-input size="medium" v-model="brand.brandName"></el-input>
        </el-form-item>
      </div>
      <!--  <div class="newbrand-brandName">
        <el-form-item label-width="120px" prop="firstLetter" label="首字母:">
          <el-input size="medium" v-model="brand.firstLetter"></el-input>
        </el-form-item>
      </div>-->
      <div class="newbrand-image">
        <el-form-item label-width="120px" prop="logoUrl" label="LOGO:">
          <el-upload
            drag
            action="/"
            :accept="type"
            :show-file-list="false"
            :on-change="logoUpload"
            :auto-upload="false"
            class="newbrand"
          >
            <img v-if="brand.logoUrl" :src="brand.logoUrl" style="width: 150px;">
            <i v-else class="el-icon-upload brand-name-upload"></i>
          </el-upload>
        </el-form-item>
      </div>
      <div class="newbrand-image">
        <el-form-item label-width="120px" prop="pictureUrl" label="品牌图片:">
          <el-upload
            drag
            action="/"
            :accept="type"
            :show-file-list="false"
            :on-change="pictureUpload"
            :auto-upload="false"
            class="newbrand"
          >
            <img v-if="brand.pictureUrl" :src="brand.pictureUrl" style="width: 150px;">
            <i class="el-icon-upload brand-name-upload"></i>
          </el-upload>
        </el-form-item>
      </div>
      <div class="newbrand-brandName">
        <el-form-item label-width="120px" prop="brandStory" label="品牌介绍:">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 20}"
            v-model="brand.brandStory"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="newbrand-button">
      <el-button type="success" @click="submit" style="margin-left: 400px;">确认</el-button>
    </div>
    <el-dialog
      :visible.sync="progressVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-progress :percentage="progressPercent"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
import BrandMainInfo from "./../../../dto/BrandMainInfo";
import HttpHandler from "./../../../util/HttpHandler";
import { BRAND_ADD } from "./../../../store/api";

export default {
  data() {
    return {
      loading: false,
      progressPercent: 0,
      httpHandler: {},
      progressVisible: false,
      brandName: "",
      firstLetter: "",
      type: "image/png, image/jpeg",
      brandStory: "",
      brandMainInfo: {},
      logoFile: {},
      pictureFile: {},
      formData: {},
      fileResponse: "",
      brand: {
        brandName: "",
        firstLetter: "",
        logoUrl: "",
        pictureUrl: "",
        brandStory: ""
      },
      inputErrorRules: {
        brandName: [
          {
            required: true,
            message: "Please input brandName!",
            trigger: "change"
          }
        ],
        firstLetter: [
          {
            required: true,
            message: "Please input firstLetter!",
            trigger: "change"
          }
        ],
        brandStory: [
          {
            required: true,
            message: "Please input brandStory!",
            trigger: "change"
          }
        ],
        logoUrl: [
          {
            required: true,
            message: "only jpeg/png, file can not larger than 50kb!",
            trigger: "change"
          }
        ],
        pictureUrl: [
          {
            required: true,
            message: "only jpeg/png, file can not larger than 50kb!",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    /**
     *If "logoupload" icon clicked, this method is called.
     */
    logoUpload(file) {
      const isJPG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";

      if (isJPG && file.size < 50000) {
        this.brand.logoUrl = URL.createObjectURL(file.raw);
        this.logoFile = file.raw;
      } else {
        this.$message.error("Image of size must be smaller than 50kb!");
      }
    },
    /**
     *If "pictureupload" icon clicked, this method is called.
     */
    pictureUpload(file) {
      const isJPG =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";

      if (isJPG && file.size < 50000) {
        this.brand.pictureUrl = URL.createObjectURL(file.raw);
        this.pictureFile = file.raw;
      } else {
        this.$message.error("Image of size must be smaller than 50kb!");
      }
    },
    /**
     * Save New Brand.
     * If user is clicked "Submit" button, this method is invoked.
     */
    async submit() {
      this.$refs.brandList.validate(async valid => {
        if (valid) {
          //this.progressVisible = true;
          this.loading = true;

          this.fileResponse = await this.httpHandler.uploadFile(
            `tag/brand/`,
            this.logoFile,
            this.showProgress
          );

          this.brandMainInfo.logo = this.fileResponse;
          //this.progressVisible = true;
          this.loading = true;

          this.fileResponse = await this.httpHandler.uploadFile(
            `tag/brand/`,
            this.pictureFile,
            this.showProgress
          );
          this.brandMainInfo.picture = this.fileResponse;

          this.setBrandPath();
        }
      });
    },
    /***
     * set files path when save new Brand
     */
    setBrandPath() {
      this.brandMainInfo.name = this.brand.brandName;
      //this.brandMainInfo.brandFirstLetter = this.brand.firstLetter;
      this.brandMainInfo.story = this.brand.brandStory;
      this.addBrandMainInfo();
    },
    /***
     * add Brand detail information to the server
     */
    async addBrandMainInfo() {
      let responseBrand = await this.httpHandler.sendRequest(
        `${BRAND_ADD}`,
        "POST",
        this.brandMainInfo
      );

      if (responseBrand.status === 201) {
        this.$notify({
          title: "Success",
          message: "Successfully created !",
          type: "success"
        });
        this.$router.push({ path: "/items/brands" });
      } else {
        this.$notify({
          title: "Error",
          message: "Unable to created !",
          type: "error"
        });
      }
    },
    /***
     * show progress bar.
     */
    showProgress(percent) {
      this.progressPercent = Math.floor(percent);
      if (percent === 100) {
        //this.progressVisible = false;
        this.loading = false;
      }
    }
  },
  created() {
    this.brandMainInfo = new BrandMainInfo();
    this.formData = new FormData();
    this.httpHandler = new HttpHandler();
  }
};
</script>

<style>
.new-brand {
  width: calc(100% - 30px);
  margin: auto;
}
.new-brand-title {
  margin-top: 50px;
  margin-left: 350px;
  margin-bottom: 50px;
}
.newbrand-brandName {
  margin-left: 200px;
  width: 600px;
}
.newbrand-image {
  margin-left: 200px;
  width: 150px;
  margin-bottom: 40px;
}
.el-form-item__error {
  width: 150px;
  height: 34px;
}
.newbrand .el-upload-dragger {
  width: 150px;
  height: 150px;
}
.newbrand-button {
  margin-bottom: 10px;
  margin-right: 500px;
}
.box-card {
  width: 100%;
  position: relative;
  margin: auto;
}
</style>
