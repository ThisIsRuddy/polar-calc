import PolarNode from './PolarNode';
import getCurrentPolarPrice from "../lib/getCurrentPolarPrice";

class PolarNodeManager {
  polarPrice;
  nodes;

  constructor(polarPrice, nodeParams) {
    this.polarPrice = polarPrice;
    this.setNodeParams(nodeParams);
  }

  setNodeParams(nodeParams) {
    this.nodes = new Map();
    nodeParams.forEach(np => {
      const nodeData = {...np, polarPrice: this.polarPrice, count: 0};
      return this.nodes.set(np.id, new PolarNode(nodeData));
    });
  }

  setCurrentPolarPrice(updateLocalPrice) {
    getCurrentPolarPrice()
      .then(price => {
        this.setPolarPrice(price);
        updateLocalPrice(price);
      })
      .catch(err => {
        console.error("Error while fetching POLAR price:", err.message);
      })
  }

  setPolarPrice(price) {
    this.polarPrice = price;
    const nodes = this.getNodes();
    nodes.forEach(n => n.setPolarPrice(price));
  }

  setNodeCount(id, count) {
    const node = this.nodes.get(id);
    node.setCount(count);
  }

  setAllNodeCounts(count) {
    const nodes = Array.from(this.nodes.values());
    nodes.forEach(n => n.setCount(count));
  }

  getTotals() {
    const nodes = Array.from(this.nodes.values());
    const results = {
      count: 0,
      cost: 0,
      reward: 0,
      totalPreRoiPolar: 0,
      totalPreRoiUSD: 0,
      totalPostRoiPolar: 0,
      totalPostRoiUSD: 0,
    };

    nodes.forEach(n => {
      results.count += n.count;
      results.cost += n.cost * n.count;
      results.reward += n.reward * n.count;
      results.totalPreRoiPolar += n.totalPreRoiPolar;
      results.totalPreRoiUSD += n.totalPreRoiUSD;
      results.totalPostRoiPolar += n.totalPostRoiPolar;
      results.totalPostRoiUSD += n.totalPostRoiUSD;
    });

    return results;
  }

  getNodes() {
    return Array.from(this.nodes.values());
  }

  getPolarPrice(){
    return this.polarPrice;
  }
}

export default PolarNodeManager;
