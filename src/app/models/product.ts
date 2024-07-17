export class Product {
  _id: string;
  name: string;
  category: string;
  inventory: number;
  price: number;
  discount: number;
  sold: number;
  description: string;
  rating: number;

  constructor() {
    this._id = '';
    this.name = '';
    this.category = '';
    this.inventory = 0;
    this.price = 0;
    this.discount = 0;
    this.sold = 0;
    this.description = '';
    this.rating = 0;
  }
}
