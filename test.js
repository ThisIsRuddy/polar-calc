const axios = require('axios');

const _encodeIntToHex = (num) => Number(num).toString(16).padStart(64, '0');

const _decodeHexToASCII = (hex) => {
  const hexString = hex.toString();//force conversion
  let str = '';
  for (let i = 0; i < hexString.length; i += 2)
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  return _stripNonASCII(str);
}

const _stripNonASCII = (str) => {
  if ((str===null) || (str===''))
    return false;
  else
    str = str.toString();

  return str.replace(/[^\x20-\x7E]/g, '');
}

const getWalletNFTsTxs = async (walletAddr) => {
  const url = `https://api.snowtrace.io/api?module=account&action=tokennfttx&address=${walletAddr}&startblock=0&endblock=999999999&sort=asc`;
  const {data: {result: allTxs}} = await axios.get(url);

  const polarTxs = allTxs.filter(tx => tx.tokenName === 'Polar Node');

  const outTxs = polarTxs.filter(tx => tx.to !== walletAddr.toLowerCase());
  const inTxs = polarTxs.filter(tx => tx.to === walletAddr.toLowerCase());

  const outIds = outTxs.map(tx => tx.tokenID);
  const inIds = inTxs.map(tx => tx.tokenID);

  const nodeIds = inIds.filter(id => !outIds.includes(id));
  return nodeIds;
}

const getNodeType = async (id) => {
  const url = `https://api.avax.network/ext/bc/C/rpc`;
  const {data: {result: resHex}} = await axios.post(url, {
    "jsonrpc": "2.0",
    "id": 4,
    "method": "eth_call",
    "params": [
      {
        "from": "0x0000000000000000000000000000000000000000",
        "data": "0xb3ad18e2" + _encodeIntToHex(id),
        "to": "0x0217485eb50bbd886b14f7ba5ecd0f03d3069779"
      },
      "latest"
    ]
  });

  const resString = _decodeHexToASCII(resHex);
  const type = _stripNonASCII(resString).trim();
  return type;
}

const getNodesByWalletAddress = async (walletAddr) => {
  const nftIds = await getWalletNFTsTxs(walletAddr);
  const getTypeJobs = nftIds.map(async (id) => {
    const type = await getNodeType(id);
    return {
      id,
      type
    }
  })

  const nodes = await Promise.all(getTypeJobs);
  return nodes;
}

const execute = async () => {
  const nodes = await getNodesByWalletAddress('0x86aF7c86aC356749CeC3DA81D93f8C0a7dA673f9')
  console.log("nodes:", nodes);
}

execute()
  .catch(err => console.error(err.message))
  .finally(() => process.exit(0));
