import bs58 from "bs58";
import fs from "fs";

// Load the keypair JSON file
const keypairArray = JSON.parse(fs.readFileSync("/Users/danielkmak/.config/solana/id.json", "utf-8"));

// Create a Uint8Array from the keypair array
const keypairUint8Array = Uint8Array.from(keypairArray);

// Encode the Uint8Array to Base58
const base58PrivateKey = bs58.encode(keypairUint8Array);

// Output the Base58 encoded private key
console.log("Base58 Private Key:", base58PrivateKey);
