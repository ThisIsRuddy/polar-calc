import CurrencyConverter from 'currency-converter-lt';

const converter = new CurrencyConverter();

const getCurrencyRate = async (from, to) => await converter.from(from).to(to).amount(1).convert();

export default getCurrencyRate;
