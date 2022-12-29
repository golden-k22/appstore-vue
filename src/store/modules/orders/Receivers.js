class Receivers {
  constructor(
    receiver = {
      id: 0,
      orderId: 0,
      name: '',
      phone: '',
      postCode: '',
      address: ''
    }
  ) {
    this.id = receiver.id;
    this.orderId = receiver.orderId;
    this.name = receiver.name;
    this.phone = receiver.phone;
    this.postCode = receiver.postCode;
    this.address = receiver.address;
  }
}

export default Receivers;
