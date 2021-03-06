import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {TradeComponent} from './trade/trade.component';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import {AppState, store} from './app.redux';
import {RouterModule, Routes} from '@angular/router';
import { InfoComponent } from './info/info.component';
import {HttpClientModule} from '@angular/common/http';
import {TradingService} from './trader.service';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { PageComponent } from './page/page.component';
import {RestService} from './rest.service';


export function init(trader: TradingService, rest: RestService) {
  return () => {
    trader.init();
    rest.init();
  };
}
@NgModule({
  declarations: [
    TradeComponent,
    InfoComponent,
    PageComponent
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    NgReduxModule,
    HttpClientModule,
    RouterModule.forRoot([
        {
          path: '',
          redirectTo: '/trade',
          pathMatch: 'full'
        }, {
          path: 'trade',
          component: TradeComponent
        }, {
        path: 'info/:id',
        component: InfoComponent
      }])
  ],
  providers: [{
    'provide': APP_INITIALIZER,
    'useFactory': init,
    'deps': [TradingService, RestService],
    'multi': true
  }, TradingService, RestService ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [PageComponent]
})
export class AppModule {  constructor(ngRedux: NgRedux<AppState | undefined>) {
  ngRedux.provideStore(store);
  }
}
