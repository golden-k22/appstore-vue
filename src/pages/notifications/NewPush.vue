<template>
  <div class="new-push-box">
    <div class="new-push-body">
      <!-- ================= header ==================-->
      <el-row>
        <div class="new-push-header">
          <label class="new-push-point">&#9679;</label>
          <label class="new-push-title">发布推送</label>
        </div>
      </el-row>
      <!-- =========== end header =================== -->
      <!-- ==============  body ===================== -->
      <el-row>
        <div style="padding:50px" class="block-inside bg-white">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="new-push-form">
            <div class="row">
              <div class="col-sm-4">
                <el-form-item label="推送人:" style="text-align:left" prop="publisher">
                  <!-- <el-select v-model="value3" filterable placeholder="请选择推送人">
                    <el-option
                      v-for="state in pushState"
                      :key="state.type"
                      :label="state.value"
                      :value="state.value"
                    ></el-option>
                  </el-select>-->
                  <el-input v-model="ruleForm.publisher" style="width: 70%" placeholder="请选择推送人"></el-input>
                </el-form-item>
              </div>
              <div class="col-sm-4">
                <el-form-item label="推送设备:" style="text-align:left">
                  <el-select v-model="pushType" filterable placeholder="请选择推送设备">
                    <el-option
                      v-for="item in pushTypes"
                      :key="item.type"
                      :label="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="col-sm-4">
                <el-form-item label="推送时间:" style="text-align:left">
                  <el-select v-model="sendType" filterable placeholder="请选择推发布时间">
                    <el-option
                      v-for="item in sendTypes"
                      :key="item.type"
                      :label="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <!-- ==================== title ====================== -->
            <el-form-item label="推送标颢:" prop="title">
              <el-input v-model="ruleForm.title" style="width: 50%" placeholder="请输入特辑名称"></el-input>
            </el-form-item>

            <!-- =================== type ========================= -->
            <el-form-item label="跳转链接:" style="text-align:left" prop="forwardURL">
              <!--  <el-select v-model="typeValue" filterable placeholder="添加链接">
                <el-option
                  v-for="state in pushState"
                  :key="state.type"
                  :label="state.value"
                  :value="state.value"
                ></el-option>
              </el-select>-->
              <el-input v-model="ruleForm.forwardURL" style="width: 70%" placeholder="添加链接"></el-input>
            </el-form-item>

            <!--  ============== nduction editor ============== -->
            <div class="new-push-height-200" style="width:100% height:100%">
              <ckeditor :editor="editor" v-model="content" :config="editorConfig"></ckeditor>
            </div>

            <!-- ================= submit ===========================-->
            <div class="collect-text-align-center margin-top-40">
              <el-button
                type="primary"
                @click="submit"
                class="new-push-btn-primary pull-right"
                round
              >发布</el-button>
              <el-button
                type="danger"
                @click="refresh"
                class="new-push-btn-danger pull-right"
                round
              >清空</el-button>
            </div>
          </el-form>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  watch: {},
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      ruleForm: {
        publisher: "",
        title: "",
        forwardURL: ""
      },

      content: "",

      rules: {
        publisher: [
          {
            required: true,
            message: "请输入特辑题目",
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: "请输入特辑题目",
            trigger: "blur"
          }
        ],
        forwardURL: [
          {
            required: true,
            message: "请输入特辑题目",
            trigger: "blur"
          }
        ]
      },

      sendTypes: [
        {
          type: 1,
          value: "立即发出"
        },
        {
          type: 2,
          value: "01:00:00"
        },
        {
          type: 3,
          value: "02:00:00"
        },
        {
          type: 4,
          value: "03:00:00"
        }
      ],

      sendType: "",

      pushTypes: [
        {
          type: 1,
          value: "全局"
        },
        {
          type: 2,
          value: "组队"
        },
        {
          type: 3,
          value: "个人"
        }
      ],

      pushType: "",

      notifications: {
        publisher: "",
        pushType: 1,
        deviceType: 1,
        sendType: 1,
        sendTime: "",
        title: "",
        content: "",
        forwardURL: ""
      }
    };
  },

  computed: {
    result: function() {
      return this.$store.getters["Notification/getStatus"];
    }
  },

  async created() {},

  methods: {
    refresh() {
      this.ruleForm = {};
      this.sendType = "";
      this.pushType = "";
      this.content = "";
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitPush();
        } else {
          this.$notify.error({
            title: "错误",
            message: "提出失败了, 请输入集聚题目！"
          });
          return false;
        }
      });
    },
    async submitPush() {
      this.notifications.publisher = this.ruleForm.publisher;
      this.notifications.deviceType = 1;
      if (this.senType === "立即发出") {
        this.notifications.sendType = 1;
        this.notifications.sendTime = "00:00:00";
      } else {
        this.notifications.sendType = 2;
        this.notifications.sendTime = this.sendType;
      }

      if (this.pushType === "全局") {
        this.notifications.pushType = 1;
      }
      if (this.pushType === "组队") {
        this.notifications.pushType = 2;
      }
      if (this.pushType === "个人") {
        this.notifications.pushType = 3;
      }

      this.notifications.title = this.ruleForm.title;
      this.notifications.content = this.content;
      this.notifications.forwardURL = this.ruleForm.forwardURL;
      await this.$store.dispatch("Notification/addList", this.notifications);

      if (this.result) {
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
    goBack() {
      this.$router.push({ path: "/businesses/systempush" });
    }
  }
};
</script>

<style>
.new-push-btn-primary {
  width: 130px;
}

.margin-top-40 {
  margin-top: 40px;
}

.new-push-header {
  color: black;
  height: 70px;
}

.new-push-point {
  float: left;
  padding-left: 20px;
  color: blue;
  margin-top: 10px;
}

.new-push-title {
  font-size: 30px;
  font-weight: bold;
  color: black;
}

.new-push-box {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}
.new-push-body {
  width: 97%;
  margin: auto;
  background-color: white;
  padding-top: 15px;
}

.new-push-height-200 .ck.ck-editor__editable_inline {
  height: 300px;
}

.new-push-btn-danger {
  width: 130px;
  margin-right: 20px;
}
.new-push-form .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: relative;
  top: 100%;
  left: 0;
}
</style>

