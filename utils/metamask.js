export const getEthNetWork = chainId => {
  if (chainId === 1 || chainId === 0x1) {
    return "Ethereum Main Network (Mainnet)";
  } else if (chainId === 3 || chainId === 0x3) {
    return "Ropsten Test Network";
  } else if (chainId === 4 || chainId === 0x4) {
    return "Rinkeby Test Network";
  } else if (chainId === 5 || chainId === 0x5) {
    return "Goerli Test Network";
  } else if (chainId === 42 || chainId === 0x2a) {
    return "Kovan Test Network";
  }
};
