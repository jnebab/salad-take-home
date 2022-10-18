import { Tab } from "@headlessui/react";
import classNames from "classnames";
import Header from "components/Header";
import { useRouter } from "next/router";
import {
  BlockTransactionWithLogEvents,
  useGetTransactionDetails,
} from "queries";
import { useCallback } from "react";
import { useConnect } from "wagmi";

enum TransactionLabels {
  "tx_hash" = "Transaction Hash",
  "successful" = "Status",
  "block_height" = "Block",
  "block_signed_at" = "Timestamp",
  "from_address" = "From",
  "to_address" = "To",
  "value" = "Value",
  "fees_paid" = "Transaction Fee",
}

const transactionKeys = [
  "tx_hash",
  "successful",
  "block_height",
  "block_signed_at",
  "from_address",
  "to_address",
  "value",
  "fees_paid",
];

export default function Transaction() {
  const router = useRouter();
  const txnHash = router?.query?.txnHash;
  const chainId = router?.query?.chainId;
  const { data: details } = useGetTransactionDetails(
    txnHash as string,
    Number(chainId),
  );

  const transaction = details?.items[0] as BlockTransactionWithLogEvents;
  return (
    <div>
      <Header />
      <div className="container mx-auto h-fit w-full text-white py-4 px-6 bg-[#1C1C1C]/60 rounded-2xl mb-6">
        <h2 className="mb-6">Overview</h2>
        <div className="flex flex-col gap-2">
          {transactionKeys.map((key) => {
            if (key === "successful") {
              return (
                <div
                  key={key}
                  className="py-2 border-b border-white/10 w-full flex gap-28 items-center"
                >
                  <p className="w-[200px]">{TransactionLabels[key]}</p>
                  <p>{transaction?.[key] ? "Success" : "Failed"}</p>
                </div>
              );
            }
            return (
              <div
                key={key}
                className="py-2 border-b border-white/10 w-full flex gap-28 items-center"
              >
                <p className="w-[200px]">{(TransactionLabels as any)[key]}</p>
                <p>{(transaction as any)?.[key]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
