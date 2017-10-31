import { Component, OnInit } from '@angular/core';
import {NgRedux, select, select$} from '@angular-redux/store';
import {AppState} from '../app.redux';
import {Observable} from 'rxjs/Observable';
import {OutstandingOrder, Transaction} from '../app.model';
import {Router} from '@angular/router';

const top20OutstandingOrdersAsc = data => data.map( q => q.filter(item => item.outstanding > 0)).map( x => x.slice(0, 20));
const top20OutstandingOrdersDesc = data => data.map( q => q.filter(item => item.outstanding > 0)).map( x => x.slice(0, 20));

const last30 = data => data.map(a => a.sort((x , y) => y.timeStamp - x.timeStamp )).map( c => c.slice(0, 30));

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
  ]
  @select$(['askQueue'], top20OutstandingOrdersAsc )
  sellOrders: Observable<OutstandingOrder>;
  @select$(['bidQueue'], top20OutstandingOrdersDesc)
  buyOrders: Observable<OutstandingOrder>;
  @select$(['transactions'], last30)
  transactions: Observable<Transaction>;

  @select$(['transactions'], obs$ => obs$.map( item => item.length))
  transNum: Observable<Number>;
  @select$(['bidQueue'], obs$ => obs$.map( item => item.length))
  buyNum: Observable<Number>;
  @select$(['askQueue'], obs$ => obs$.map( item => item.length))
  sellNum: Observable<Number>;
  constructor(private ngRedux: NgRedux<AppState>, private router: Router) { }
  transctionSelect(e: any) {
    if (e.type === 'mouseenter') {
      return;
    }
    this.router.navigateByUrl(this.router.createUrlTree(['info', e.row.id]));
  }
}
