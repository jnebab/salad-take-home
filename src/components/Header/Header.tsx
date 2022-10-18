import Listbox from "components/Listbox";
import { useRouter } from "next/router";
import React, { startTransition, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

interface HeaderProps {
  wallets?: string[];
  selectedWallets?: string[];
  onSelectChange?: (value: string[]) => void;
  onAddNewWallet?: (value: string) => void;
  enableAddWallet?: boolean;
}

export default function Header({
  wallets,
  selectedWallets,
  onSelectChange,
  onAddNewWallet,
  enableAddWallet,
}: HeaderProps) {
  const [address, setAddress] = useState<string>("");
  const { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      !!onAddNewWallet && onAddNewWallet(address);
      setAddress("");
    }
  };
  const handleConnect = () => {
    if (isConnected) {
      disconnect();
      router?.push("/");
      return;
    }
    connect();
    startTransition(() => {
      router.push(`/?w=${address}`);
    });
  };
  return (
    <div className="container mx-auto w-full flex justify-between items-center py-10 text-white">
      <div className="flex items-center gap-4">
        <h1 className="text-white font-[900] text-3xl">SaladScan</h1>
        {enableAddWallet ? (
          <>
            <div className="mb-4 w-[200px]">
              <Listbox
                list={wallets as string[]}
                selected={selectedWallets as string[]}
                onChange={onSelectChange as (value: string[]) => void}
                disabled={wallets?.length === 0}
              />
            </div>
            <div className="mb-4 w-[200px] relative top-2">
              <input
                type="text"
                placeholder="Add new account"
                value={address}
                onChange={handleAddressChange}
                onKeyDown={handleOnEnter}
                className="w-[300px] text-black px-2 rounded-lg h-[38px] outline-none border border-black/60"
              />
            </div>
          </>
        ) : null}
      </div>
      <p className="cursor-pointer text-lg font-medium" onClick={handleConnect}>
        {isConnected ? "Disconnect" : "Connect Wallet"}
      </p>
    </div>
  );
}
