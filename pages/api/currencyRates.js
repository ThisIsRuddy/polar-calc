import axios from 'axios';
import cache from 'memory-cache';

import minutesBetween from '../../lib/minutesBetween';
import addMinutes from '../../lib/addMinutes';

const fetchCurrencyRates = async (baseCurrency, symbols) => await axios.get('https://api.apilayer.com/exchangerates_data/latest', {
  timeout: 5000,
  redirect: 'follow',
  headers: {
    apikey: process.env.APILAYER_API_KEY
  },
  params: {
    base: baseCurrency,
    symbols: symbols.join(',')
  }
});

const updateRates = async () => {
  const {data} = await fetchCurrencyRates('USD', [
    "AUD", "GBP", "CAD", "EUR", "HKD", "NZD", "CHF", "AED"
  ])
  console.info("[currencyRates:updateRates] Fetch rates: OK");

  const now = new Date();
  const rates = {
    ...data['rates'],
    tlu: now,
    ttu: addMinutes(now, 180)
  }
  console.info("[currencyRates:rates]", rates);
  cache.put('currencyRates', rates);

  return {
    ...rates,
    mtu: 180 + " min"
  };
}

const getRates = async () => {
  let rates;

  rates = cache.get('currencyRates');
  if (!rates) {
    console.error("[currencyRates:getRates] Read cached rates: FAIL");
    return await updateRates();
  }
  console.info("[currencyRates:getRates] Read cached rates: OK");

  const now = new Date();
  const diff = minutesBetween(rates.tlu, now);
  if (diff > 180)
    try {
      rates = await updateRates();
      console.info("Successfully updated currency rates.");
    } catch (e) {
      console.error("Failed to update currency rates:", e.message);
    }

  return {
    ...rates,
    mtu: 180 - diff + " min"
  };
}

export default async function handler(req, res) {
  try {
    const rates = await getRates();
    console.info("[currencyRates:handler] Get rates: OK");
    res.status(200).json(rates);
  } catch (err) {
    console.error("[currencyRates:handler] Get rates: FAIL");
    res.status(500).json({error: "Failed to retrieve currency rates: " + err.message});
  }
}
