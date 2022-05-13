const axios = require('axios');
const abiDecoder = require('abi-decoder');

const decodeHexToASCII = (hex) => {
  const hexString = hex.toString();//force conversion
  let str = '';
  for (let i = 0; i < hexString.length; i += 2)
    str += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  return str;
}

const decodeHexABI = async (abi, hex) => {
  abiDecoder.addABI(abi);
  return abiDecoder.decodeMethod(hex);
}

const stripNonASCII = (str) => {
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
        "data": "0xb3ad18e2" + Number(id).toString(16).padStart(64, '0'),
        "to": "0x0217485eb50bbd886b14f7ba5ecd0f03d3069779"
      },
      "latest"
    ]
  });

  const resString = decodeHexToASCII(resHex);
  const type = stripNonASCII(resString).trim();

  return type;
}


const transferFrom = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const tokenIdsToType = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokenIdsToType",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const execute = async () => {
  /*const createNodeResponse = '0x23b872dd0000000000000000000000001b67617ac250c99c6a1c27e7f690d1fbedffa57a000000000000000000000000eb16958efca3f6a61509c541f02729aff275331c000000000000000000000000000000000000000000000000000000000000888e';
  const createNodeResult = await decodeHexABI(transferFrom, createNodeResponse);
  console.info('createNode:', createNodeResult);

  const nodeTypeResponse = '0xb3ad18e200000000000000000000000000000000000000000000000000000000000006a3';
  const nodeTypeResult = await decodeHexABI(tokenIdsToType, nodeTypeResponse);
  console.info('nodeType:', nodeTypeResult);*/


  const nftIds = await getWalletNFTsTxs('0x86aF7c86aC356749CeC3DA81D93f8C0a7dA673f9');
  const getTypeJobs = nftIds.map(async (id) => {
    const type = await getNodeType(id);
    return {
      id,
      type
    }
  })

  const nodes = await Promise.all(getTypeJobs);
  console.log("nodes:", nodes);
}

execute()
  .catch(err => console.error(err.message))
  .finally(() => process.exit(0));
