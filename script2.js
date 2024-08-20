import bs58 from 'bs58';

// The Solana address in Base58 format
const solanaAddress = 'Fty7h4FYAN7z8yjqaJExMHXbUoJYMcRjWYmggSxLbHp8';

// Decode the Base58 address to a Uint8Array
const decodedBytes = bs58.decode(solanaAddress);

// Convert the Uint8Array to a hex string
// Each byte is converted to a 2-character hexadecimal value, and joined together
const hexString = Array.from(decodedBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

// Ensure the hex string is 32 bytes long (64 characters)
const bytes32HexString = '0x' + hexString;

console.log("Bytes32 Hex String:", bytes32HexString);