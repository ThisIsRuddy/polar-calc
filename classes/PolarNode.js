class PolarNode {
  id;
  tier;
  name;
  cost;
  reward;
  preRoiTax;
  postRoiTax;

  isDiamond;
  isEmerald;
  isOlympus;

  count;

  totalCost;
  totalReward;
  roiPercentage;
  roiDays;
  totalPreRoiPolar;
  totalPostRoiPolar;
  totalPreRoiUSD;
  totalPostRoiUSD;

  constructor({id, tier, name, cost, reward, preRoiTax, postRoiTax, polarPrice, count}) {
    this.id = id;
    this.tier = tier;
    this.name = name;
    this.cost = cost;
    this.reward = reward;
    this.preRoiTax = preRoiTax;
    this.postRoiTax = postRoiTax;
    this.polarPrice = polarPrice;
    this.count = count;

    this.isSilver = name.includes('Silver');
    this.isGold = name.includes('Gold');
    this.isDiamond = name.includes('Diamond');
    this.isEmerald = name.includes('Emerald');
    this.isOlympus = name === 'Olympus';
    this.isRuby = name.includes('Ruby');

    this.isSpecial = [this.isSilver, this.isGold, this.isDiamond, this.isEmerald, this.isRuby, this.isOlympus].some(i => i === true);

    this.updateTotals();
  }

  setPolarPrice(price) {
    this.polarPrice = price;
    this.updateTotals();
  }

  setCount(count) {
    this.count = count;
    this.updateTotals();
  }

  updateTotals() {
    this.totalCost = this.cost * this.count;
    this.totalReward = this.reward * this.count;
    this.roiPercentage = this.reward / this.cost * 100;
    this.roiDays = (this.cost / this.reward);
    this.totalPreRoiPolar = this.totalReward * (1 - (this.preRoiTax / 100));
    this.totalPostRoiPolar = this.totalReward * (1 - (this.postRoiTax / 100));
    this.totalPreRoiUSD = this.totalPreRoiPolar * this.polarPrice;
    this.totalPostRoiUSD = this.totalPostRoiPolar * this.polarPrice;
  }
}

export default PolarNode;
