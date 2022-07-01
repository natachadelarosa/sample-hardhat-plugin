// types
export type EtherscanApi<T> = {
  status: string;
  message: string;
  result: T;
};

export type EtherscanSourceCodeResult = EtherscanApi<
  {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
  }[]
>;

export type EtherscanTransactionListResult = EtherscanApi<
  {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
  }[]
>;

export type EtherscanProxyContractResult = EtherscanApi<string>;
