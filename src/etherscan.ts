import * as queryString from "query-string";

export const getTransactionListParams = (
  address: string,
  apiKey: string
): string => {
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
