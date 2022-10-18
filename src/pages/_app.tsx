import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default MyApp;
