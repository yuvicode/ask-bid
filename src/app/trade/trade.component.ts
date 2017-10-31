import { Component } from '@angular/core';
import {NgRedux, select$} from '@angular-redux/store';
import {AppState} from '../app.redux';
import {Observable} from 'rxjs/Observable';
import {OutstandingOrder, Transaction} from '../app.model';
import {Router} from '@angular/router';

export const top20OutstandingOrders = data => data.map( q => q.filter(item => item.outstanding > 0)).map( x => x.slice(0, 20));
export const last30 = data => data.map(a => a.sort((x , y) => y.timeStamp - x.timeStamp )).map( c => c.slice(0, 30));
export const length = obs$ => obs$.map( item => item.length);
@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent {
  columns = [
    { name: 'Type' },
    { name: 'Quantity' },
    { name: 'Price' }
  ];
  transCol = [
    {name: 'Buy', prop: 'buyId'},
    {name: 'Sale', prop: 'saleId'},
    { name: 'Quantity' },
    { name: 'Price' }
  ];
  @select$(['askQueue'], top20OutstandingOrders )
  sellOrders: Observable<OutstandingOrder>;
  @select$(['bidQueue'], top20OutstandingOrders)
  buyOrders: Observable<OutstandingOrder>;
  @select$(['transactions'], last30)
  transactions: Observable<Transaction>;

  @select$(['transactions'], length)
  transNum: Observable<Number>;
  @select$(['bidQueue'], length)
  buyNum: Observable<Number>;
  @select$(['askQueue'], length)
  sellNum: Observable<Number>;
  constructor(private ngRedux: NgRedux<AppState>, private router: Router) { }
  transctionSelect(e: any) {
    if (e.type === 'mouseenter') {
      return;
    }
    this.router.navigateByUrl(this.router.createUrlTree(['info', e.row.id]));
  }
}
