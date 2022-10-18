import React, { useMemo, useState } from "react";
import { Disclosure, Tab } from "@headlessui/react";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  CovalentTransactionItem,
  GenericChainInfoDisplay,
  useGetTransactions,
} from "queries";
import Skeleton from "components/Skeleton";
import classNames from "classnames";
import {
  ChevronUpIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { ethers } from "ethers";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);
const skeletonItems: JSX.Element[] = Array.from(Array(8).keys()).map((_, i) => (
  <Skeleton key={i} />
));

export default function Table({
  networks,
  selectedWallets,
  onRemoveWallet,
}: {
  selectedWallets: string[];
  isLoading: boolean;
  networks: GenericChainInfoDisplay[];
  onRemoveWallet: (wallet: string) => void;
}) {
  return (
    <div className="container mx-auto h-fit w-full text-white p-4 bg-[#1C1C1C]/60 rounded-2xl mb-6">
      {!!networks && networks?.length > 0 ? (
        <div className="flex flex-col gap-4">
          <Tab.Group>
            <Tab.List className="flex space-x-1 gap-4 rounded-xl bg-blue-900/20 p-1 overflow-x-auto">
              {networks?.map((network) => (
                <Tab
                  key={network.chain_id}
                  className={({ selected }) =>
                    classNames(
                      "w-fit rounded-lg py-2.5 px-4 text-sm font-medium leading-5 text-blue-700",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
                    )
                  }
                >
                  {network.label}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {networks?.map((network) => {
                return (
                  <Tab.Panel
                    key={network?.chain_id}
                    className={classNames(
                      "rounded-xl text-white p-3",
                      "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 bg-transparent",
                    )}
                  >
                    <div className="min-h-[600px] h-fit overflow-y-auto w-full flex flex-col place-items-center">
                      {selectedWallets.length === 1 ? (
                        <TransactionList
                          chainId={network.chain_id}
                          address={selectedWallets[0]}
                        />
                      ) : null}
                      {selectedWallets?.length > 1 ? (
                        <div className="flex flex-col gap-2 text-white w-full">
                          {selectedWallets.map((wallet) => {
                            return (
                              <Disclosure>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 items-center">
                                      <span>{wallet}</span>
                                      <div className="flex items-center gap-4 justify-start">
                                        <button
                                          className="text-red-500  py-2 px-4 rounded-lg z-30"
                                          onClick={(
                                            e: React.MouseEvent<HTMLButtonElement>,
                                          ) => {
                                            e.stopPropagation();
                                            onRemoveWallet(wallet as string);
                                          }}
                                        >
                                          Remove from List
                                        </button>
                                        <ChevronUpIcon
                                          className={`${
                                            open ? "rotate-180 transform" : ""
                                          } h-5 w-5 text-purple-500`}
                                        />
                                      </div>
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                      <TransactionList
                                        chainId={network.chain_id}
                                        address={wallet}
                                      />
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </Tab.Panel>
                );
              })}
            </Tab.Panels>
          </Tab.Group>
        </div>
      ) : null}
    </div>
  );
}

const columnHelper = createColumnHelper<CovalentTransactionItem>();
function TransactionList({
  chainId,
  address,
}: {
  chainId: number;
  address: string;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: transactions, isLoading } = useGetTransactions(
    address as string,
    chainId,
    page,
    20,
  );
  const pagination = transactions?.pagination;
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("successful", {
        cell: (info) => (
          <span>
            {!info.getValue() ? (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            ) : null}
          </span>
        ),
        header: () => <span></span>,
      }),
      columnHelper.accessor("tx_hash", {
        cell: (info) => (
          <p
            className="truncate max-w-[171px] text-blue-500 cursor-pointer mb-0"
            onClick={() =>
              router.push(`/tx/${info.getValue()}?chainId=${chainId}`)
            }
          >
            {info.getValue()}
          </p>
        ),
        header: () => <span>Txn Hash</span>,
      }),
      columnHelper.accessor("block_height", {
        cell: (info) => info.getValue(),
        header: () => <span>Block</span>,
      }),
      columnHelper.accessor("block_signed_at", {
        cell: (info) => (
          <p className="w-[100px]">{dayjs(info.getValue()).fromNow()}</p>
        ),
        header: () => <span>Age</span>,
      }),
      columnHelper.accessor("from_address", {
        cell: (info) => (
          <p className="truncate max-w-[171px] cursor-pointer mb-0">
            {info.getValue()}
          </p>
        ),
        header: (info) => <span>From</span>,
      }),
      columnHelper.accessor("from_address", {
        id: `in-out-status`,
        cell: (info) => {
          const isOut =
            info.getValue().toLowerCase() === address?.toLowerCase();
          return (
            <span
              className={classNames(
                "block w-[50px] text-center font-semibold p-2 rounded-lg",
                {
                  ["bg-[rgba(219,154,4,.2)] text-[#b47d00]"]: isOut,
                  ["bg-[rgba(0,201,167,.2)] text-[#02977e]"]: !isOut,
                },
              )}
            >
              {isOut ? "OUT" : "IN"}
            </span>
          );
        },
        header: (info) => <span className="hidden">INOUT</span>,
      }),
      columnHelper.accessor("to_address", {
        cell: (info) => (
          <p className="truncate max-w-[171px] cursor-pointer mb-0">
            {info.getValue()}
          </p>
        ),
        header: () => <span>To</span>,
      }),
      columnHelper.accessor("value", {
        cell: (info) => (
          <span>
            {parseFloat(ethers.utils.formatEther(info.getValue())).toFixed(6)}
          </span>
        ),
        header: () => <span>Value</span>,
      }),
      columnHelper.accessor("fees_paid", {
        cell: (info) => ethers.utils.formatEther(info.getValue()),
        header: () => <span>Txn Fee</span>,
      }),
    ];
  }, [transactions?.items, chainId]);

  const table = useReactTable({
    data: transactions?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!isLoading && !!transactions && transactions?.items?.length === 0) {
    return (
      <div className="p4 text-white/60 h-full">
        <p>No transactions available</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-white relative w-full bg-transparent">
      {isLoading && !transactions ? (
        <div className="w-full h-full flex flex-col gap-4">{skeletonItems}</div>
      ) : null}
      {!isLoading && !!transactions && transactions?.items.length > 0 ? (
        <table className="bg-transparent">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={`${row.id}-${index}`}
                className="border-b border-black/10 py-2"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-[.625rem]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <div className="flex justify-end w-full items-center gap-2 mt-2">
        <button
          className="disabled:text-gray-400"
          disabled={pagination?.page_number === 1}
          onClick={() => setPage((old) => old - 1)}
        >
          Previous
        </button>
        <span className="mx-2 font-bold text-gray-500">{page}</span>
        <button
          className="disabled:text-gray-400"
          disabled={!pagination?.has_more}
          onClick={() => setPage((old) => old + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
