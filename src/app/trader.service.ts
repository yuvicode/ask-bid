import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgRedux} from '@angular-redux/store';
import {APP_ORDERS_LOADED, APP_RESET, APP_TRADING_CYCLE_END,  AppState} from './app.redux';
import {OutstandingOrder, Transaction} from './app.model';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient, private ngRedux: NgRedux<AppState>) { }
  init() {
    let start;
    this.ngRedux.select('lastOrderIndex').subscribe((index) => {start = index; } );
    setInterval(() => {this.getOrders(start); }, 3000);

    let sell;
    let buy;
    this.ngRedux.select('bidQueue').subscribe((q) => {buy = q; } );
    this.ngRedux.select('askQueue').subscribe((q) => {sell = q; } );
    setInterval(() => {this.updateTransactions(sell, buy); }, 3000);
  }

  updateTransactions(sellOrders: OutstandingOrder[] , buyOrders: OutstandingOrder[]) {
    const transactions: Transaction[] = this.performTransactions(sellOrders, buyOrders);
    this.ngRedux.dispatch({type: APP_TRADING_CYCLE_END, payload: transactions});
  }
  performTransactions(sell: OutstandingOrder[] , buy: OutstandingOrder[]): Transaction[] {
    const transactions: Transaction[] = [];
    // filter outstanding ,sort price DESC
    buy = buy.map( item => item).filter(item => item.outstanding > 0).sort((a, b ) => (b.price - a.price) * 10 + (a.id > b.id ? 1 : -1));
    // filter outstanding ,sort price ASC
    sell = sell.map( item => item).filter(item => item.outstanding > 0).sort((a , b) => (a.price - b.price) * 10 + (a.id > b.id ? 1 : -1))

    const sellNum = sell.length;
    const buyNum = buy.length;

    sellLoop:
      for (let sellIndex = 0; sellIndex < sellNum; sellIndex++) {
        const sellOrder = sell[sellIndex];
        buyLoop:
          for (let buyIndex = 0; buyIndex < buyNum; buyIndex++) {
            const buyOrder = buy[buyIndex];
            // no more possible transactions
            if (buyOrder.price < sellOrder.price) {
              return transactions;
            }
            if (sellOrder.outstanding === 0) { // go to next sell order
              continue sellLoop;
            }
            if (buyOrder.outstanding === 0) { // go to next buy order
              continue buyLoop;
            }
            const amount  = Math.min(buyOrder.outstanding , sellOrder.outstanding);

            // create transaction
            transactions.push({id: sellOrder.id + '-' + buyOrder.id, saleId: sellOrder.id, buyId: buyOrder.id,
                  quantity: amount, price: (buyOrder.price + sellOrder.price) / 2
                  , timeStamp: (new Date()).getTime()});
            // update orders
            sellOrder.outstanding -= amount;
            buyOrder.outstanding -= amount;
            if (sellOrder.outstanding === 0) { // go to next sell order
              continue sellLoop;
            }
          }
      }

    return transactions;
  }
  getOrders(start: number) {
    this.http.get(`/listOrders?start=${start}&size=10`).subscribe(
      data => {
        this.ngRedux.dispatch({type: APP_ORDERS_LOADED, payload: data});
      }
    );
  }
  resetOrders(start: number) {
    this.http.get(`/reset`).subscribe(
      data => {
        this.ngRedux.dispatch({type: APP_RESET, payload: data});
      }
    );
  }


}
