class Collection {
  constructor(
    collection = {
      id: 0,
      colId: '',
      colTitle: '',
      colType: 0,
      category: 0,
      intro: '',
      onUse: 0,
      productId: [],
      pic: '',
      allPic: ''
    }
  ) {
    this.id = collection.id;
    this.colId = collection.colId;
    this.colTitle = collection.colTitle;
    this.colType = collection.colType;
    this.category = collection.category;
    this.intro = collection.intro;
    this.onUse = collection.onUse;
    this.productId = collection.productId;
    this.pic = collection.pic;
    this.allPic = collection.allPic;
  }
}

export default Collection;
