import { Store, createStore } from 'redux';
import { OutstandingOrder, Transaction } from './app.model';

/**
 * the application base state of bid/sell order
 */
export interface AppState {
  bidQueue: OutstandingOrder[];
  askQueue: OutstandingOrder[];
  transactions: Transaction[];
  lastOrderIndex: number;
  isTrading: boolean;
}

/**
 * app actions
 */

export const APP_ORDERS_LOADED = 'APP_ORDER_LOADED';
export const APP_TRADING_CYCLE_END = 'APP_TRADING_CYCLE_END';
export const APP_START_TRADING = 'APP_START_TRADING';
export const APP_STOP_TRADING = 'APP_STOP_TRADING';
export const APP_RESET = 'APP_RESET';
/**
 * Redux Action
 */
export interface Action {
  type: string;
  payload: any;
}

const initState = {bidQueue: [] , askQueue: [], transactions: [], lastOrderIndex: 0, isTrading: false};

function rootReducer(appState: AppState = initState,
                     action: Action): AppState {

  if (action.type === APP_STOP_TRADING) {
    return {...appState, isTrading: false};
  }
  if (action.type === APP_START_TRADING) {
    return {...appState, isTrading: true};
  }
    if (action.type === APP_ORDERS_LOADED) { // this happen whenever new bulk of orders is retrived
    action.payload.forEach(item => {item.outstanding = item.quantity; });

    const askQueue = appState.askQueue.concat(action.payload.filter((item) => item.type === 'sell')).sort((a, b) => a.price - b.price);
    const bidQueue = appState.bidQueue.concat(action.payload.filter((item) => item.type === 'buy')).sort((b, a) => a.price - b.price)
    const lastOrderIndex = appState.lastOrderIndex + action.payload.length;
    return{
      ...appState,
      askQueue,
      bidQueue,
      lastOrderIndex
    };
  }
  if (action.type === APP_RESET) {
    return initState;
  }
  if (action.type === APP_TRADING_CYCLE_END) {
    const transactions = appState.transactions.concat(action.payload);
    return{
      ...appState,
      transactions
    };
  }
  return appState;
}

export const store: Store<AppState | undefined> = createStore(rootReducer);

