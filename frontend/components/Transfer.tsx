'use client'
// ReactJS
import { useState, useEffect } from "react"

// ChakraUI
import { Flex, Text, Button, Spinner, useToast, Alert, AlertIcon ,Input} from "@chakra-ui/react"

// Wagmi
import {
  useAccount,
  useReadContract,
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance
} from "wagmi"

// Contract informations
import {OpenBuildToken,Web3FrontendToken, Web3FrontendTokenAbi, whitelisted, OpenBuildTokenAbi} from "@/constants"

// Viem
import { formatEther } from "viem"

// Merkle Tree by OZ
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

// Layout
import Layout from "./Layout"

const Transfer = () => {

  const { address } = useAccount();
  const toast = useToast();
  const  bal    = useBalance({'address': address});

  const [merkleProof, setMerkleProof] = useState<string[]>([]);
  const [merkleError, setMerkleError] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>(''); // State to hold recipient address input
  const [amount, setAmount] = useState<number>(0); // State to hold amount input
  const [balance, setBalance] = useState<number>(0); // State to ho
  const [recipientMintAddress, setRecipientMintAddress] = useState<string>(''); // State to hold recipient address input

  // Get the total amount of the BBK tokens airdroppped
  const { data: totalSupply, isLoading: totalSupplyLoading, refetch: refetchTotalSupply } = useReadContract({
    address: OpenBuildToken,
    abi: OpenBuildTokenAbi,
    functionName: 'totalSupply',
    account: address
  })

  const formatTotalSupply = (supply: bigint | undefined) => {
    if (supply !== undefined) {
      return formatEther(supply);
    }
    return "0";
  };

  const { data: hash, error: airdropError, isPending, writeContract } = useWriteContract()

  const getAirdrop = async() => {
    console.log("recipientAddress = " + recipientAddress);
    console.log("amount = "+amount)
    console.log("address = "+address)
    console.log("totalSupply = "+totalSupply)
    let res = amount * 1000000;
    console.log("res = "+res)
    writeContract({
      address: OpenBuildToken,
      abi: OpenBuildTokenAbi,
      functionName: 'transfer',
      account: address,
      args: [recipientAddress,res]
    });
  }

  const getAirdropMint = async() => {
    console.log("mintAddress = " + recipientMintAddress);
    writeContract({
      address: Web3FrontendToken,
      abi: Web3FrontendTokenAbi,
      functionName: 'mint',
      args: [recipientMintAddress]
    });
  }

  const getAirdropGetBalance = async() => {
    console.log("getAirdropGetBalanceAddr = " + address);
    console.log("balance = "+bal.data.value);
    setBalance(Number(bal.data.value));
    // const balance = useReadContract({
    //   address: OpenBuildToken,
    //   abi: OpenBuildTokenAbi,
    //   functionName: 'balanceOf',
    //   args:[address]
    // });

    // const balance = writeContract({
    //   address: OpenBuildToken,
    //   abi: OpenBuildToken,
    //   functionName: 'balanceOf',
    //   args: [address]
    // });
  }
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    isConfirmed && refetchTotalSupply();
  }, [isConfirmed])

  useEffect(() => {
    if(address) {
      try {
        const tree = StandardMerkleTree.of(whitelisted, ["address"], { sortLeaves: true });
        const proof = tree.getProof([address]);
        setMerkleProof(proof);
      }
      catch {
        setMerkleError('You are not eligible to an airdrop.');
      }
    }
  }, [])

  return (
    <Flex
      direction="column"
      width={['100%', '100%', '50%', '50%']}
    >
      {totalSupplyLoading ? (
        <Flex justifyContent="center">
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Flex>
      ) : (
        <>
          <Flex justifyContent="center">
            <Text mt="1rem">Amount Airdrop given : <Text as='b'>{formatTotalSupply(balance as bigint | undefined)} PENGYONG</Text></Text>
          </Flex>
          {merkleError ? (
            <Alert status='error' mt="1rem">
              <AlertIcon />
              You are not eligible for an airdrop.
            </Alert>
          ) : (
            <>
              {hash && (
                <Alert status='success' mt="1rem">
                  <AlertIcon />
                  Hash : {hash}
                </Alert>
              )}
              {isConfirming && (
                <Alert status='success' mt="1rem">
                  <AlertIcon />
                  Waiting for confirmation...
                </Alert>
              )}
              {isConfirmed && (
                <Alert status='success' mt="1rem">
                  <AlertIcon />
                  Check your wallet, you have received 1 PENGYONG!
                </Alert>
              )}
              {airdropError && (
                <Alert status='error' mt="1rem">
                  <AlertIcon />
                  Error: {(airdropError as BaseError).shortMessage || airdropError.message}
                </Alert>
              )}
              <Flex alignItems="center" mt="1rem">
                <Input
                    placeholder="Recipient Address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    mr="1rem"
                />
                <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    mr="1rem"
                />
                <Button onClick={getAirdrop}>{isPending ? 'Transfering...' : 'Transfer'}</Button>

              </Flex>
              <Flex alignItems="center" mt="1rem">
                <Input
                    placeholder="Recipient Address"
                    value={recipientMintAddress}
                    onChange={(e) => setRecipientMintAddress(e.target.value)}
                    mr="1rem"
                />
                <Button onClick={() => getAirdropMint()} mt="1rem">{isPending ? 'Minting...' : 'Mint'}</Button>
              </Flex>
              <Flex alignItems="center" mt="1rem">
                <Button onClick={() => getAirdropGetBalance()} mt="1rem">{isPending ? 'GetBalanceing...' : 'GetBalance'}</Button>
              </Flex>
            </>
          )}
        </>
      )}
    </Flex>
  )
}

export default Transfer
