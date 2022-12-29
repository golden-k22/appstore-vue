class Item {
  constructor(
    item = {
      id: 0,
      proNum: '',
      itemLogo: '',
      itemPhotos: [],
      itemName: '',
      brandName: '',
      auditStatus: 0,
      price: '',
      categId: 0,
      subcategId: 0,
      keyWord: '',
      itemSize: 0,
      itemColor: ''
    }
  ) {
    this.id = item.id;
    this.proNum = item.proNum;
    this.itemLogo = item.itemLogo;
    this.itemPhotos = item.itemPhotos;
    this.itemName = item.itemName;
    this.brandName = item.brandName;
    this.auditStatus = item.auditStatus;
    this.price = item.price;
    this.categId = item.categId;
    this.subcategId = item.subcategId;
    this.keyWord = item.keyWord;
    this.itemSize = item.itemSize;
    this.itemColor = item.itemColor;
  }
}

export default Item;
