/*
    - Based on
        - Code a Crypto Whale Tracker Step-by-Step with Ethers.js
        - https://www.youtube.com/watch?v=u_lwNJobmAI&t=507s&ab_channel=DappUniversity
        - https://github.com/dappuniversity/whale_tracker/blob/master/solution.js
*/


const { ethers, Contract } = require('ethers')
const player = require('play-sound')(opts = {})

const rpcURL = 'https://cloudflare-eth.com/'
const provider = new ethers.providers.JsonRpcProvider(rpcURL)

const CONTRACT_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

const playSound = () => {
    player.play('ding.mp3', (err) => { if (err) throw err })
}

const main = async () => {

    const TRANSFER_THRESHOLD = 100000 * 1000000 // 100,000 USDC (in WEI)

    const block = await provider.getBlockNumber()
    const name = await contract.symbol()

    console.log(`The block number ${block} of the most recently mined block for ${name}`)

    contract.on("Transfer", async (from, to, amount, event) => {
        
        if(amount.toNumber() >= TRANSFER_THRESHOLD) {
            console.log(`New whale transfert for ${name}: https://etherscan.io/tx/${event.transactionHash}`)

            console.log(`from: ${from}`)
            console.log(`to: ${to}`)
            console.log(`amount: ${amount.toNumber()}`)
            console.log(`event.transactionHash: ${event.transactionHash}`)
            console.log("\n")

            event.removeListener()
        }
    })
}

main()