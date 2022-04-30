import axios from 'axios';

const fetchCurrencyRates = async (baseCurrency, symbols) => await axios.get('https://api.apilayer.com/exchangerates_data/latest', {
  timeout: 5000,
  redirect: 'follow',
  headers: {
    apikey: process.env.APILAYER_API_KEY //TODO API Key
  },
  params: {
    base: baseCurrency,
    symbols: symbols.join(',')
  }
});

export default fetchCurrencyRates;
