import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/487e87a62b4543529a6fd0bbaef2020f'));
const contractAddress = '0x0C9516703F0B8E6d90F83d596e74C4888701C8fc';

export async function createWallet() {
  const newWallet = web3.eth.accounts.create();
  const newWalletAddress = newWallet.address;
  const newWalletPrivateKey = newWallet.privateKey;

  // Send 1 ETH to the new wallet from the GAC contract address
  const txHash = await sendTransaction(contractAddress, newWalletAddress, web3.utils.toWei('1', 'ether'));

  // Set up the auto-convert function to run every hour
  setInterval(async () => {
    await autoConvertGacToEth(newWalletAddress);
  }, 3600000); // 1 hour in milliseconds

  return {
    address: newWalletAddress,
    privateKey: newWalletPrivateKey,
  };
}

export async function getWalletBalance(walletAddress: string) {
  const balance = await web3.eth.getBalance(walletAddress);
  return web3.utils.fromWei(balance, 'ether');
}

export async function autoConvertGacToEth(walletAddress: string) {
  // Get the GAC balance from the contract
  const gacBalance = await getGacBalance(contractAddress, walletAddress);

  // Convert 1000 GAC to ETH
  const amountToConvert = web3.utils.toWei('1000', 'ether');
  if (gacBalance >= amountToConvert) {
    // Perform the conversion and send the ETH to the wallet
    const txHash = await sendTransaction(contractAddress, walletAddress, amountToConvert);
    console.log(`Converted 1000 GAC to ETH and sent to wallet: ${txHash}`);
  } else {
    console.log('Insufficient GAC balance for conversion');
  }
}

async function getGacBalance(contractAddress: string, walletAddress: string) {
  // Call the contract's balanceOf function to get the GAC balance
  const contract = new web3.eth.Contract([...], contractAddress);
  const balance = await contract.methods.balanceOf(walletAddress).call();
  return balance;
}

export async function sendTransaction(fromAddress: string, toAddress: string, amount: string) {
  const txCount = await web3.eth.getTransactionCount(fromAddress);
  const tx = {
    from: fromAddress,
    to: toAddress,
    value: amount,
    nonce: txCount,
  };
  const signedTx = await web3.eth.accounts.signTransaction(tx, fromAddress);
  const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return txHash;
}
