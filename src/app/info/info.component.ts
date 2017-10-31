import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {AppState} from '../app.redux';
import {Transaction, OutstandingOrder} from '../app.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  transaction: Transaction
  ask: OutstandingOrder
  bid: OutstandingOrder
  constructor(private activatedRoute: ActivatedRoute, private ngRedux: NgRedux<AppState> ) { }

  ngOnInit() {
    const tid  = this.activatedRoute.snapshot.params.id;
    this.ngRedux.select('transactions').map( (a: Transaction[]) =>
            a.filter( (t: Transaction) => t.id === tid)).
    subscribe( (tr: Transaction[]) => {(this.transaction) = tr[0]; this.loadOrders(tr[0].buyId, tr[0].saleId); });
  }

  loadOrders(buyId, saleId) {
    this.ngRedux.select('askQueue').map( (a: OutstandingOrder[]) =>
      a.filter( (t: OutstandingOrder) => t.id === saleId)).subscribe( (tr: OutstandingOrder[]) => {(this.ask) = tr[0]; });

    this.ngRedux.select('bidQueue').map( (a: OutstandingOrder[]) =>
      a.filter( (t: OutstandingOrder) => t.id === buyId)).subscribe( (tr: OutstandingOrder[]) => {(this.bid) = tr[0]; });
  }
}
