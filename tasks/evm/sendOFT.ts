import { task } from 'hardhat/config'
import { SendParam } from "../common/types";
import { Options } from '@layerzerolabs/lz-v2-utilities';
import { types } from '@layerzerolabs/devtools-evm-hardhat'
import bs58 from 'bs58';

// send tokens from a contract on one network to another
task('lz:oft:send-to-solana', 'Sends tokens from either OFT or OFTAdapter')
    .addParam('to', 'solana receiver address, eg. Fty7h4FYAN7z8yjqaJExMHXbUoJYMcRjWYmggSxLbHp8')
    .addParam('toEid', 'The destination endpoint ID', undefined, types.eid)
    .addParam('amount', 'amount to transfer in token decimals, eg. 1 is 1 ether')
    .setAction(async (taskArgs, { ethers, deployments }) => {
        const eidB = taskArgs.toEid;

        // address conversion
        // Decode the Base58 address to a Uint8Array
        const decodedBytes = bs58.decode(taskArgs.to);

        // Convert the Uint8Array to a hex string
        // Each byte is converted to a 2-character hexadecimal value, and joined together
        const hexString = Array.from(decodedBytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');

        // Ensure the hex string is 32 bytes long (64 characters)
        const toAddressHexString = '0x' + hexString;

        // Get the contract factories
        const oftDeployment = await deployments.get('MyOFT');

        const [signer] = await ethers.getSigners();

        // Create contract instances
        const oftContract = new ethers.Contract(oftDeployment.address, oftDeployment.abi, signer);

        const decimals = await oftContract.decimals();
        const amount = ethers.utils.parseUnits(taskArgs.amount, decimals);
        let options = Options.newOptions().addExecutorLzReceiveOption(0, 0).toBytes();

        // Now you can interact with the correct contract
        const oft = oftContract;

        const sendParam: SendParam = {
            dstEid: eidB,
            to: toAddressHexString,
            amountLD: amount!,
            minAmountLD: amount!,
            extraOptions: options,
            composeMsg: ethers.utils.arrayify('0x'), // Assuming no composed message
            oftCmd: ethers.utils.arrayify('0x') // Assuming no OFT command is needed
        };
        // Get the quote for the send operation
        const feeQuote = await oft.quoteSend(sendParam, false);
        const nativeFee = feeQuote.nativeFee;

        console.log(
            `sending ${taskArgs.amount} token(s) to Solana network with eid (${eidB})`
        )

        const r = await oft.send(
            sendParam, 
            { nativeFee: nativeFee, lzTokenFee: 0},
            signer.address,
            { value: nativeFee }
        );
        console.log(`Send tx initiated. See: https://layerzeroscan.com/tx/${r.hash}`)
    })

export default 'sendOFT'