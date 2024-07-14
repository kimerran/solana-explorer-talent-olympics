import { useEffect, useState } from "react";
import { rpcRequestFetch } from "./useSolana";

export type AccountInfoType = {
    value: any;
}

const prepareGetAccountInfoBody = (pubkey: string) => {
  return {
    jsonrpc: "2.0",
    id: 1,
    method: "getAccountInfo",
    params: [
      pubkey,
      {
        encoding: "jsonParsed",
      },
    ],
  };
};

export function useAccount(pubkey: string) {
    const [accountInfo, setAccountInfo] = useState<AccountInfoType>();

    function getAccountInfo() {
        rpcRequestFetch(prepareGetAccountInfoBody(pubkey), (data) => {
            setAccountInfo(data.result);
          });
    }

    useEffect(() => {
        getAccountInfo()
    }, [pubkey])

    return { accountInfo }
}
