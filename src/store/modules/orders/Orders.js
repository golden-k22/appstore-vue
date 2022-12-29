class Orders {
  constructor(
    order = {
      id: 0,
      orderNo: 0,
      submittedTime: '',
      userId: '',
      totalAmount: 0,
      payMode: '',
      status: ''
    }
  ) {
    this.id = order.id;
    this.orderNo = order.orderNo;
    this.submittedTime = order.submittedTime;
    this.userId = order.userId;
    this.totalAmount = order.totalAmount;
    this.payMode = order.payMode;
    this.status = order.status;
  }
}

export default Orders;
