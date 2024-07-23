'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  hardhat, sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { ChakraProvider } from '@chakra-ui/react'

const WALLET_CONNECT = process.env.NEXT_PUBLIC_WALLET_CONNECT || "0x670d19A567ae472A19eA3623cC1f19B2a6465Cb2";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: WALLET_CONNECT,
  chains: [hardhat, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ChakraProvider>
                {children}
              </ChakraProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
