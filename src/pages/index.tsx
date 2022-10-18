import Header from "components/Header";
import Table from "components/Table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useGetAllChains } from "queries";
import { useRouter } from "next/router";
import useIsMounted from "hooks/useIsMounted";

export default function Home() {
  const isMounted = useIsMounted();
  const router = useRouter();
  const { w } = router?.query;
  const { address, isConnected, isDisconnected } = useAccount();
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [selectedWallets, setSelectedWallets] =
    useState<string[]>(walletAddresses);
  const { data: networks, isLoading: isLoadingNetworks } = useGetAllChains(
    isMounted,
  );

  useEffect(() => {
    if (isConnected && !!address && !w) {
      router?.push(`/?w=${address}`);
    }
  }, [address, isConnected, w]);

  useEffect(() => {
    if (!!w && walletAddresses?.length === 0 && selectedWallets?.length === 0) {
      setWalletAddresses([w as string]);
      setSelectedWallets([w as string]);
    }
  }, [w]);

  useEffect(() => {
    if (isDisconnected && walletAddresses?.length > 0) {
      setWalletAddresses([]);
      setSelectedWallets([]);
    }
  }, [isDisconnected]);

  const mainnetNetworks = useMemo(() => {
    if (!!networks && networks?.items?.length > 0) {
      const allMainnet = networks.items.filter(
        (network) => !network.is_testnet,
      );
      return allMainnet.slice(0, 5);
    }
    return [];
  }, [networks]);

  const handleSelectWalletChange = useCallback((newAddresses: string[]) => {
    setSelectedWallets(newAddresses);
    router.push(`/?wallets=${newAddresses}`);
  }, []);

  const handleAddNewWallet = useCallback(
    (newWalletAddress: string) => {
      if (walletAddresses.includes(newWalletAddress)) return;
      setWalletAddresses((old) => [...old, newWalletAddress]);
      setSelectedWallets((old) => [...old, newWalletAddress]);
    },
    [walletAddresses],
  );

  const handleRemoveWallet = useCallback(
    (wallet: string) => {
      const filteredWallets = walletAddresses.filter(
        (address) => address !== wallet,
      );
      const filteredSelectedWallets = selectedWallets.filter(
        (address) => address !== wallet,
      );
      setSelectedWallets(filteredWallets);
      setWalletAddresses(filteredSelectedWallets);
    },
    [walletAddresses, selectedWallets],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header
        wallets={walletAddresses as string[]}
        selectedWallets={selectedWallets as string[]}
        onSelectChange={handleSelectWalletChange}
        onAddNewWallet={handleAddNewWallet}
        enableAddWallet
      />
      <Table
        isLoading={isLoadingNetworks}
        networks={mainnetNetworks}
        selectedWallets={selectedWallets as string[]}
        onRemoveWallet={handleRemoveWallet}
      />
    </>
  );
}
