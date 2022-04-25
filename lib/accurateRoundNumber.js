const accurateRoundNumber = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export default accurateRoundNumber;
