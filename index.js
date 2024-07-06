import { ethers } from "./ether-import.js";

import {abi, contractAddress} from "./constant.js"
const connectButton = document.getElementById("connect");
const fundButton = document.getElementById("fund");
const balanceButton = document.getElementById("balance");
const withdraw = document.getElementById("withdraw");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdraw.onclick = Withdraw;

async function connect(){
    if(typeof window.ethereum !== "undefined"){
        await ethereum.request({method:"eth_requestAccounts"});
        connectButton.innerHTML = "Connected";
        console.log("yeeee boidddd")
    }
    else{
        console.log("NO Metamask!");
        fundButton.innerHTML = "Undefind";
    }
}


async function getBalance(){
    if(typeof window.ethereum != "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}


// fund me 
async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding: ${ethAmount} eth.....`);
    if(typeof window.ethereum !==    "undefined"){
         // provider -> to connect to the blockchain
         //signer -> to authenticate your request(who is having some gas)
         // contract that we are interecting
         // for which we need ABI & Address
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();
         const contract = new ethers.Contract(contractAddress,abi,signer )
         try {
            const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
            })
            // here we have to wait for tx to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("done");
         } catch (error) {
            console.log(error);
         }
         
    }
}


function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}.....`);
    // return new Promise

    return new Promise ((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt)=>{
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations `
            )
            resolve();
        })
    })
    
}

// withdraw

async function Withdraw(){
    if(typeof window.ethereum != "undefined"){
        console.log("withdrawing......")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer )
         
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine (transactionResponse,provider)
        } catch (error) {
            console.log(error)
        }
    }
}