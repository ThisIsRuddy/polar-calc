import fs from 'fs';
import util from 'util';
import axios from 'axios';

import minutesBetween from '../../lib/minutesBetween';
import addMinutes from '../../lib/addMinutes';

const readFile = util.promisify(fs.readFile);
const statFile = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);

console.log("process.env.APILAYER_API_KEY", process.env.APILAYER_API_KEY);

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

const readCachedRates = async () => {
  const data = await readFile(__dirname + '/currencyRates.json');
  return JSON.parse(data);
}

const statCachedRates = async () => await statFile(__dirname + '/currencyRates.json');

const cacheRates = async (rates) => await writeFile(__dirname + '/currencyRates.json', JSON.stringify(rates, null, 2));

const updateRates = async () => {
  const {data} = await fetchCurrencyRates('USD', [
    "AUD", "GBP", "CAD", "EUR", "HKD", "NZD", "CHF", "AED"
  ])
  console.info("[currencyRates:updateRates] Fetch rates: OK");

  const now = new Date();
  const rates = {
    ...data['rates'],
    tlu: now,
    ttu: addMinutes(now, 180),
    mtu: "180 min"
  }
  console.info("[currencyRates:rates]", rates);


  console.info("[currencyRates:updateRates:path]", __dirname + '/currencyRates.json');
  await cacheRates(rates);
  console.info("[currencyRates:updateRates] Write rates: OK");

  return rates;
}

const getRates = async () => {
  let rates;

  try {
    rates = await readCachedRates();
    console.info("[currencyRates:getRates] Read cached rates: OK");
  } catch (e) {
    console.error("[currencyRates:getRates] Read cached rates: FAIL");
    return await updateRates();
  }

  const stats = await statCachedRates();
  console.info("[currencyRates:getRates] Stat cached rates: OK");
  const now = new Date();
  const diff = minutesBetween(stats.mtime, now);

  if (diff > 180)
    rates = await updateRates();

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
