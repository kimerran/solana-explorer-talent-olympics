import { useEffect, useState } from "react";
import { rpcRequestFetch } from "./useSolana";

const prepareGetTransactionInfoBody = (signature: string) => {
  return {
    jsonrpc: "2.0",
    id: 1,
    method: "getTransaction",
    params: [
      signature,
      {
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
      },
    ],
  };
};

export function useTransaction(signature: string) {
  const [txInfo, setTxInfo] = useState();

  function getTransactionInfo() {

    if (signature) {
        rpcRequestFetch(prepareGetTransactionInfoBody(signature), (data) =>
            setTxInfo(data)
          );
      
    }
  }

  useEffect(() => {
    getTransactionInfo()
  }, [signature])

  return [txInfo];
}
