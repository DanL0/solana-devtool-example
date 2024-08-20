import { decode } from '@coral-xyz/anchor/dist/cjs/utils/bytes/bs58'
import { Keypair, PublicKey } from '@solana/web3.js'
import { CLIArgumentType } from 'hardhat/types'
import { BigNumberish, BytesLike } from "ethers"

export const keyPair: CLIArgumentType<Keypair> = {
    name: 'keyPair',
    parse(name: string, value: string) {
        return Keypair.fromSecretKey(decode(value))
    },
    validate() {},
}

export const publicKey: CLIArgumentType<PublicKey> = {
    name: 'keyPair',
    parse(name: string, value: string) {
        return new PublicKey(value)
    },
    validate() {},
}

/**
 * Represents token parameters for the OFT send() operation.
 */
export interface SendParam {
    dstEid: BigNumberish; // Destination endpoint ID, represented as a number.
    to: BytesLike; // Recipient address, represented as bytes.
    amountLD: BigNumberish; // Amount to send in local decimals.
    minAmountLD: BigNumberish; // Minimum amount to send in local decimals.
    extraOptions: BytesLike; // Additional options supplied by the caller to be used in the LayerZero message.
    composeMsg: BytesLike; // The composed message for the send() operation.
    oftCmd: BytesLike; // The OFT command to be executed, unused in default OFT implementations.
}
/**
 * Represents the messaging fee structure returned by the quoteSend function.
 */
export interface MessagingFee {
    nativeFee: BigNumberish; // The native fee.
    lzTokenFee: BigNumberish; // The lzToken fee.
}