import { useEffect, useState } from "react";
import { rpcRequestFetch } from "./useSolana";

export type InstructionType = {
  id?: string;
  program?: string;
  programId: string;
  info?: {
    amount: string;
    authority: string;
    destination: string;
    source: string;
  };
  parsed?: {
    type: string;
    info: any;
  };
  accounts: any[];
  data: string;
  instructions?: InstructionType[];
};

export type TxInfoType = {
  transaction: {
    message: {
      instructions: InstructionType[];
    };
    signatures: string[];
  };
  meta: {
    fee: number;
    innerInstructions: InstructionType[];
  };
  blockTime: string;
  slot: string;
};

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
  const [txInfo, setTxInfo] = useState<TxInfoType>();

  function getTransactionInfo() {
    if (signature) {
      rpcRequestFetch(prepareGetTransactionInfoBody(signature), (data) => {
        setTxInfo(data.result);
      });
    }
  }

  useEffect(() => {
    getTransactionInfo();
  }, [signature]);

  return [txInfo];
}
