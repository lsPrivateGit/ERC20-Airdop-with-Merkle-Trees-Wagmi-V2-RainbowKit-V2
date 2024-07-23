'use client'
import Layout from "@/components/Layout";
import Mint from "@/components/Mint";
import Transfer from "@/components/Transfer";

import { useAccount } from "wagmi";

import NotConnected from "@/components/NotConnected";

export default function Home() {

  const { address, isConnected } = useAccount();

  return (
    <Layout>
      {isConnected ? (
          <Transfer />
      ) : (
        <NotConnected />
      )}
    </Layout>
  );
}
