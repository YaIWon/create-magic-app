import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID'));

async function createWallet() {
  const newWallet = web3.eth.accounts.create();
  const newWalletAddress = newWallet.address;
  const newWalletPrivateKey = newWallet.privateKey;

  // Fund the new wallet with Ether (optional)
  const fundingAmount = '1000000000000000000000000'; // 10 ETH in wei
  web3.eth.sendTransaction({
    from: '0x...', // Replace with the sender address
    to: newWalletAddress,
    value: fundingAmount,
  });

  return { newWalletAddress, newWalletPrivateKey };
}

export { createWallet };