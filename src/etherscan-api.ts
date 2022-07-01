import { Wretcher } from "wretch";
import * as queryString from "query-string";
import { EtherscanTransactionListResult } from "./types/etherscan";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import { pluginName } from "./constants";

const getTransactionListParams = (address: string, apiKey: string): string => {
  return queryString.stringify({
    address,
    page: "1",
    offset: "1",
    sort: "asc",
    apikey: apiKey,
    action: "txlist",
    module: "account",
  });
};

export const getContractAddressStartBlock = async (
  api: Wretcher,
  address: string,
  apiKey: string | Record<string, string>
): Promise<string> => {
  try {
    // fetch tx list from  (ether|polygon)scan
    const transactionListParams = getTransactionListParams(
      address,
      apiKey as string
    );
    const { result: transactionListResult } = await api
      .url(`/api?${transactionListParams}`)
      .get()
      .json<EtherscanTransactionListResult>();

    // get start block
    const [transactionResult] = transactionListResult;
    const { blockNumber } = transactionResult;

    return blockNumber;
  } catch (error) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Error retrieving contracts information from etherscan.`
    );
  }
};
