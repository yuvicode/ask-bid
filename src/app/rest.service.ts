import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgRedux} from '@angular-redux/store';
import {APP_ORDERS_LOADED, APP_RESET, APP_TRADING_CYCLE_END,  AppState} from './app.redux';
import {OutstandingOrder, Transaction} from './app.model';

@Injectable()
export class RestService {

  constructor(private http: HttpClient, private ngRedux: NgRedux<AppState>) { }
  init() {
    let start;
    this.ngRedux.select('lastOrderIndex').subscribe((index) => {start = index; } );
    setInterval(() => {this.getOrders(start); }, 3000);
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
