export class Order {
    _id: string;
    clientName: string;
    orderNo: string;
    productCost: number;
    productName: string;
    productPaymentMode: 'Credit Card' | 'Debit Card' | 'Cash on delivered' | 'Online Payment';
    startDate: string;
    paymentStatus: 'Pending' | 'Completed' | 'Failed';

    constructor() {
        this._id = '';
        this.clientName = '';
        this.orderNo = '';
        this.productCost = 0;
        this.productName = '';
        this.productPaymentMode = 'Credit Card';
        this.startDate = '';
        this.paymentStatus = 'Pending';
    }
}
