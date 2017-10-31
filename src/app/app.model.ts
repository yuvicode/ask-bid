// this represent a bid/ask order
export interface  Order {
  id: number;
  type: string; // 'buy' 'sell'
  quantity: number;
  price: number;
}
export interface OutstandingOrder extends Order {
  outstanding: number;
}
export interface Transaction {
  id: string;
  buyId: number;
  saleId: number;
  quantity: number;
  price: number;
  timeStamp: number;
}
