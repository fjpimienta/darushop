import { Injectable } from '@angular/core';
import { Config } from '@core/models/config.models';
import { ConfigsService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {
  exchangeRate = 1;

  constructor(private configsService: ConfigsService) { }

  async convertPrice(price: number): Promise<number> {
    const configs = await this.configsService.getConfig('1');
    const exchangeRate = parseFloat(configs.exchange_rate);
    const newPrice = price * exchangeRate;
    return parseFloat(newPrice.toFixed(2));
  }
}
