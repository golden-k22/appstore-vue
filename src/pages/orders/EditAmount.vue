<template>
  <div>
    <el-form>
      <el-form-item label="收货人">
        <el-input v-model="itemList.name" placeholder></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="itemList.phone" placeholder></el-input>
      </el-form-item>
      <el-form-item label="邮政编码">
        <el-input v-model="itemList.postCode" placeholder></el-input>
      </el-form-item>
      <el-form-item label="收货地址">
        <el-input v-model="itemList.address" placeholder></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="success" @click="updateReceiver">修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Object,
      default: function() {
        return {
          orderId: 0,
          name: "",
          phone: "",
          postCode: "",
          address: ""
        };
      }
    }
  },

  data() {
    return {
      update: {
        name: this.itemList.name,
        phone: this.itemList.phone,
        postCode: this.itemList.postCode,
        address: this.itemList.address
      }
    };
  },
  methods: {
    updateReceiver() {
      this.update.name = this.itemList.name;
      this.update.phone = this.itemList.phone;
      this.update.postCode = this.itemList.postCode;
      this.update.address = this.itemList.address;
    }
  }
};
</script>

<style>
</style>
