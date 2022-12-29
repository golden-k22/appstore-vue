<template>
  <div class="prp-box">
    <div class="prp-title">
      <label class="prp-point">&#9679;</label>
      <label class="prp-title-text">商品评论列表</label>
    </div>
    <div class="prp-serch-box">
      <el-form :inline="true" :model="search">
        <el-form-item label="ID:">
          <el-input v-model="search.id" placeholder="商品ID"></el-input>
        </el-form-item>
        <el-form-item label="Date:">
          <el-date-picker
            v-model="search.date"
            type="date"
            placeholder="选择日期"
            default-value="2010-10-01"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" round>查找</el-button>
          <el-button type="info" round>刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="prp-table-box">
      <el-table :data="tableList" stripe>
        <el-table-column label="用户昵称" prop="name"></el-table-column>
        <el-table-column label="用户等级" prop="sellLevel"></el-table-column>
        <el-table-column label="编辑日期" prop="writeDate"></el-table-column>
        <el-table-column label="最新评论" prop="commentAndReview"></el-table-column>
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button type="primary" round @click="checkAll" size="small">查看所有评论</el-button>
            <el-button type="danger" round @click="deleteItem(scope.row.id)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        id: "",
        date: ""
      },
      tableList: [
        {
          id: "",
          name: "",
          sellLevel: "",
          commentAndWrite: "",
          writeDate: ""
        }
      ]
    };
  },
  methods: {
    checkAll() {},
    // eslint-disable-next-line no-unused-vars
    delleteItem(id) {}
  }
};
</script>

<style>
.prp-box {
  margin: auto;
  margin-left: 10px;
  margin-right: 10px;
  background-color: white;
  margin-bottom: 10px;
}
.prp-title {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
}
.prp-point {
  color: blue;
}
.prp-title-text {
  font-size: 28px;
  font-weight: bold;
}
.prp-serch-box {
  padding-left: 20px;
}
.prp-table-box {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
}
</style>
