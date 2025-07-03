import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./wallet/turbin3-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { OperationCanceledException } from "typescript";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

//
// // define decimals
const TOKEN_DECIMALS = 6;
function toTokenAmount(tokens: number): bigint {
  return BigInt(tokens * Math.pow(10, TOKEN_DECIMALS));
}
// Mint address
const mint = new PublicKey("8XTbWy3htpaGwVvkEF6Us9y2vJX63QaFap8xFJp4N1fF");

// Recipient address
const to = new PublicKey("deiyvXCabxck1UYaAWH4PT5mTPGhhkmLRcFhRGdWBJq");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromWallet = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
    );
    console.log(`Send from Wallet:  ${fromWallet.address}`);
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toWallet = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
    );
    console.log(`Send to Wallet:  ${toWallet.address}`);
    // Transfer the new token to the "toTokenAccount" we just created
    const tranferTx = await transfer(
      connection,
      keypair,
      fromWallet.address,
      toWallet.address,
      keypair,
      toTokenAmount(1),
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
