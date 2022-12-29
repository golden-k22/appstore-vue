class ProductManager {
  getAuditStatusList() {
    return [
      '未审核',
      '已通过',
      '未通过',
      '已下架',
      '已售出',
      '已删除',
      '已下架(未审核)',
      '已售出'
    ];
  }
  getAuditStatus(status) {
    let list = this.getAuditStatusList();

    return list[status];
  }
  getDate(time) {
    let date = new Date(time);

    return (
      Number(date.getMonth() + 1) +
      '-' +
      (date.getDate() + 1) +
      '-' +
      date.getFullYear()
    );
  }
}
export default ProductManager;
