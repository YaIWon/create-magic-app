export interface GacContract {
  address: string;
  abi: any[];
  balanceOf: (address: string) => Promise<string>;
}

export interface Wallet {
  address: string;
  privateKey: string;
}