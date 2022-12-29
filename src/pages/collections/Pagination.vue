<template>
  <div>
    <el-pagination
      id="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.currentPage"
      :page-sizes="pages"
      :page-size="pagination.pageSize"
      layout="prev, pager, next"
      :total="totals"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: ["totals", "pages"],
  methods: {
    /*  Be handled according to changes of page count per page */
    handleSizeChange(val) {
      let oldSize = this.pagination.pageSize;

      this.pagination.pageSize = val;
      this.displayCurrentPage(oldSize, val);
    },
    /* Be handled according to changes of current page number */
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.$emit(
        "pageInfoChanged",
        this.pagination.pageSize,
        this.pagination.currentPage
      );
    },

    /* refresh page selection for every time to be changed item count per page */
    displayCurrentPage(oldValue, newValue) {
      let firstProductId = oldValue * (this.pagination.currentPage - 1) + 1;

      this.pagination.currentPage = Math.ceil(firstProductId / newValue);
      this.$emit(
        "pageInfoChanged",
        this.pagination.pageSize,
        this.pagination.currentPage
      );
    }
  },
  data() {
    return {
      //base data considering
      pagination: { currentPage: 1, pageSize: this.pages[0] }
    };
  }
};
</script>
