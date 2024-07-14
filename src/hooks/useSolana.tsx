import { useEffect, useState } from "react";
import { v7 as newId } from "uuid";

export type EpochInfo = {
  absoluteSlot: number;
  blockHeight: number;
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  transactionCount: number;
};

export type TransactionInfoType = {
  meta: {
    computeUnitsConsumed: number;
    fee: number;
  };
  id: string;
  transaction: {
    message: any;
    signatures: String[];
  };
};

export type EpochInfoParams = {
  epochInfo: EpochInfo;
};
export type TransactionTableParams = {
  transactions: TransactionInfoType[] | undefined;
};

const prepareGetEpochInfoBody = () => {
  return {
    id: newId(),
    jsonrpc: "2.0",
    method: "getEpochInfo",
    params: [],
  };
};

const prepareGetBlockInfoBody = (blockHeight: number) => {
  return {
    method: "getBlock",
    jsonrpc: "2.0",
    id: 1,
    params: [
      blockHeight,
      {
        encoding: "json",
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
        transactionDetails: "accounts",
        rewards: false,
      },
    ],
  };
};

export const rpcRequestFetch = (
  body: any,
  callbackFunction: (value: any) => any
) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch("https://api.devnet.solana.com/", options)
    .then((response) => response.json())
    .then(callbackFunction)
    .catch((err) => console.error(err));
};

type BlockInfo = {
  transactions: TransactionInfoType[];
};

export function useSolanaBlockchain() {
  const [epochInfo, setEpochInfo] = useState<EpochInfo>();
  const [blockInfo, setBlockInfo] = useState<BlockInfo>();

  function getEpochInfo() {
    rpcRequestFetch(prepareGetEpochInfoBody(), (data) =>
      setEpochInfo(data.result)
    );
  }

  function getBlockInfo(blockHeight: number) {
    rpcRequestFetch(prepareGetBlockInfoBody(blockHeight), (data) =>
      setBlockInfo(data.result)
    );
  }

  useEffect(() => {
    getEpochInfo();
  }, []);

  useEffect(() => {
    if (epochInfo) {
      const { blockHeight } = epochInfo;
      getBlockInfo(blockHeight);
    }
  }, [epochInfo]);

  return { epochInfo, blockInfo };
}
