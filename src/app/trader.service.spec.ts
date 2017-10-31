import {TestBed, async, inject} from '@angular/core/testing';
import {OrderService} from './trader.service';
import {OutstandingOrder, Transaction} from './app.model';
import {HttpClientModule} from '@angular/common/http';
import {NgReduxModule} from '@angular-redux/store';



beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [OrderService],
    imports: [
      HttpClientModule,
      NgReduxModule
    ],
  });
});

it('testing performTransactions!!!', inject([OrderService], (service: OrderService) => {
  const sell: OutstandingOrder[]  = [{id: 2, type: 'sell', price: 3, quantity: 8, outstanding: 8},
    {id: 1, type: 'sell', price: 3, quantity: 7, outstanding: 7}, {
    id: 7,
    type: 'sell',
    price: 1,
    quantity: 5,
    outstanding: 5
  }];
  const buy: OutstandingOrder[] = [{id: 5, type: 'buy', price: 4, quantity: 7, outstanding: 7},
    {id: 4, type: 'buy',  price: 3, quantity: 5, outstanding: 5}, {
    id: 6,
      type: 'buy',
    price: 6,
    quantity: 6,
    outstanding: 6
  }];


  const trn: Transaction[] = service.performTransactions(sell, buy);

  // orders
  expect(buy[0].outstanding).toBe(0);
  expect(buy[1].outstanding).toBe(0);
  expect(buy[2].outstanding).toBe(0);

  expect(sell[0].outstanding).toBe(2);
  expect(sell[1].outstanding).toBe(0);
  expect(sell[2].outstanding).toBe(0);

  // transactions
  expect(trn.length).toBe(5);

  expect(trn[0].price).toBe((6 + 1) / 2);
  expect(trn[0].buyId).toBe(6);
  expect(trn[0].saleId).toBe(7);
  expect(trn[0].quantity).toBe(5);

  expect(trn[1].price).toBe((6 + 3) / 2);
  expect(trn[1].buyId).toBe(6);
  expect(trn[1].saleId).toBe(1);
  expect(trn[1].quantity).toBe(1);

  expect(trn[2].price).toBe((4 + 3) / 2);
  expect(trn[2].buyId).toBe(5);
  expect(trn[2].saleId).toBe(1);
  expect(trn[2].quantity).toBe(6);

  expect(trn[3].price).toBe((4 + 3) / 2);
  expect(trn[3].buyId).toBe(5);
  expect(trn[3].saleId).toBe(2);
  expect(trn[3].quantity).toBe(1);

  expect(trn[4].price).toBe((3 + 3) / 2);
  expect(trn[4].buyId).toBe(4);
  expect(trn[4].saleId).toBe(2);
  expect(trn[4].quantity).toBe(5);

}));

