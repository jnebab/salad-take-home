import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://api.covalenthq.com/v1";
const API_KEY = "ckey_b6695f98e8ae4634b654bbe4593";

type CovalentPagination = {
  has_more: boolean;
  page_number: number;
  page_size: number;
  total_count: number;
};

export type GenericChainInfoDisplay = {
  name: string;
  chain_id: number;
  is_testnet: boolean;
  db_schema_name: string;
  label: string;
  logo_url: string;
};

export type CovalentAllChainInfoData = {
  updated_at: string;
  items: GenericChainInfoDisplay[];
  pagination: CovalentPagination;
};

type CovalentAllChainInfoResponse = {
  data: CovalentAllChainInfoData;
  error: boolean;
  error_code: number | null;
  error_message: string | null;
};

async function getAllChains() {
  try {
    const response = await fetch(`${BASE_URL}/chains/?key=${API_KEY}`);
    const jsonData = (await response.json()) as CovalentAllChainInfoResponse;
    return jsonData?.data;
  } catch (error: any) {
    console.log("getAllChains error", error);
  }
}

export function useGetAllChains(enabled: boolean) {
  return useQuery(["useGetAllChains"], getAllChains, {
    enabled,
  });
}

export type LogEvent = {
  block_signed_at: string;
  block_signed: string;
  tx_offset: number;
  log_offset: number;
  tx_hash: string;
  raw_log_topics: any[];
  sender_contract_decimals: number;
  sender_name: string;
  sender_contract_ticker_symbol: string;
  sender_address: string;
  sender_address_label: string;
  sender_logo_url: string;
  raw_log_data: string;
};

export type CovalentTransactionItem = {
  block_signed_at: string | Date;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: number;
  from_address: string;
  from_address_label: string;
  to_address: string;
  to_address_label: string;
  value: number;
  value_quote: number;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  fees_paid: number;
  gas_quote: number;
  gas_quote_rate: number;
  log_events: LogEvent[];
};

export type CovalentTransactionInfoData = {
  address: string;
  chain_id: number;
  items: CovalentTransactionItem[];
  next_update_at: string;
  pagination: CovalentPagination;
  quote_currency: string;
  updated_at: string;
};

type CovalentTransactionsResponse = {
  data: CovalentTransactionInfoData;
  error: boolean;
  error_code: number | null;
  error_message: string | null;
};

async function fetchTransactions(
  address: string,
  chainId: number,
  page: number,
  pageSize: number,
) {
  try {
    const response = await fetch(
      `${BASE_URL}/${chainId}/address/${address}/transactions_v2/?page-number=${page}&page-size=${pageSize}&key=${API_KEY}`,
    );
    const json = (await response.json()) as CovalentTransactionsResponse;
    return json.data;
  } catch (error: any) {
    console.log("getAllTransactions error", error);
  }
}

export function useGetTransactions(
  address: string,
  chainId: number | undefined,
  page: number,
  pageSize: number,
) {
  return useQuery(
    ["useGetAllTransactions", address, page, pageSize, chainId],
    () => fetchTransactions(address, chainId as number, page, pageSize),
    {
      enabled: !!chainId,
    },
  );
}

export type BlockTransactionWithLogEvents = {
  block_signed_at: string | Date;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label: string;
  to_address: string;
  to_address_label: string;
  value: number;
  value_quote: number;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  fees_paid: number;
  gas_quote: number;
  gas_quote_rate: number;
  log_events: LogEvent[];
};

export type TransactionDetailsData = {
  updated_at: string;
  items: BlockTransactionWithLogEvents[];
  pagination: CovalentPagination;
};

async function fetchTransactionDetails(txnHash: string, chainId: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/${chainId}/transaction_v2/${txnHash}/?key=${API_KEY}`,
    );
    const json = await response.json();
    return json.data as TransactionDetailsData;
  } catch (error: any) {
    console.log("getAllTransactions error", error);
  }
}

export function useGetTransactionDetails(txnHash: string, chainId: number) {
  return useQuery(
    ["useGetTransactionDetails", txnHash, chainId],
    () => fetchTransactionDetails(txnHash, chainId),
    {
      enabled: !!txnHash && !!chainId,
    },
  );
}
