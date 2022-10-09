import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  low_bound:number,
  high_bound:number,
  trigger_alert:number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceabc = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    const pricedef = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    const ratio = priceabc/pricedef;
    const lowbound = 1 + 0.10; // +- 10%
    const highbound = 1 + 0.10;
      return {
      price_abc : priceabc,
      price_def : pricedef,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp:serverRespond[1].timestamp,
      low_bound: lowbound,
      high_bound: highbound,
      trigger_alert: (ratio > highbound || ratio < lowbound) ? ratio : undefined,
       // if the ratio is above highbound then we will return the ratio or return undefined
       // trigger alert lets the user know when the correlation between the stocks crossed the threshold
       // this helps user to know when the stock should be sold and when the stock should be bought to maximize profit
    };
 }
}
