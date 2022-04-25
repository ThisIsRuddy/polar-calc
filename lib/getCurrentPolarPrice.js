import axios from 'axios';

const CONTRACT = '0x6c1c0319d8ddcb0ffe1a68c5b3829fd361587db4';
const URL = `https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=${CONTRACT}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;

const getCurrentPolarPrice = async () => {
  const {data} = await axios.get(URL);
  return data[CONTRACT] ? data[CONTRACT].usd : 0;
}

export default getCurrentPolarPrice;
