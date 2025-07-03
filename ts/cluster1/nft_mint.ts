import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/turbin3-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT =
  "https://solana-devnet.api.syndica.io/api-key/3nwfWkMbDcGpUrAFQYofpGgaKUK8LJAb3pZrvfmxm5UEZwsu7BYrkHytmK5BYttGtPh9cVw9EH665TstXvc6VoAMLdo8tpKsNVn";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());
//https://gateway.irys.xyz/8jWvfS8ExY5SEsvS8SWuxfaj3CeraVrSYkMYyX2NhAzg
const mint = generateSigner(umi);

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "Turbin3Bottle",
    symbol: "TB3B",
    uri: "https://gateway.irys.xyz/8jWvfS8ExY5SEsvS8SWuxfaj3CeraVrSYkMYyX2NhAzg",
    sellerFeeBasisPoints: percentAmount(1),
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );
  //https://explorer.solana.com/tx/5pm1mZCbE9awiz1y9edUBKT9BkXAF98AGNB8yreUbRSb5VKUzC9eCzKeHrSkehqjmxtJPvp8Bub4CjdZsaGAtFqE?cluster=devnet
  //Mint Address:  BhB18AjnAT9HHRXrS2khTUyDXthrazfwhwyAtkv3Xhp5
  console.log("Mint Address: ", mint.publicKey);
})();
