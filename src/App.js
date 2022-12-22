
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";

import './App.css';
import abi from "./utils/GenPool.json";
import Fomo from './form.js';

const getEthereumObject = () => window.ethereum;
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }
    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [input5, setInput5] = useState('');
  const [input6, setInput6] = useState('');
  const [input7, setInput7] = useState('');
  const [input8, setInput8] = useState('');
  const [input9, setInput9] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()



    const daiAddress = "0x7bDeD041832b5722927994443d69c87a0450b1E1";

    const daiAbi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oracle","type":"address"},{"indexed":false,"internalType":"int256","name":"_price","type":"int256"},{"indexed":false,"internalType":"uint256","name":"_settlementDate","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"decay","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minRatio","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minRatioDate","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"acronym","type":"string"},{"indexed":false,"internalType":"address","name":"poolAddress","type":"address"}],"name":"PoolCreated","type":"event"},{"inputs":[{"internalType":"address","name":"oracle","type":"address"},{"internalType":"int256","name":"price","type":"int256"},{"internalType":"uint256","name":"settlementDate","type":"uint256"},{"internalType":"uint256","name":"decay","type":"uint256"},{"internalType":"uint256","name":"minRatio","type":"uint256"},{"internalType":"uint256","name":"minRatioDate","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"acronym","type":"string"}],"name":"createPool","outputs":[{"internalType":"address","name":"newPool","type":"address"}],"stateMutability":"nonpayable","type":"function"}]

    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
    console.log("donuts");

    const daiWithSigner = daiContract.connect(signer);
    const dai = ethers.utils.parseUnits("1.0", 18);

    if (!daiWithSigner) {
      console.error("daiWithSigner is undefined");
    } else if (!daiWithSigner.interface) {
      console.error("daiWithSigner.interface is undefined");
    } else if (!daiWithSigner.interface.functions) {
      console.error("daiWithSigner.interface.functions is undefined");
    } else if (!daiContract.createPool) {
      console.error("daiWithSigner.interface.functions.createPool is undefined");
    } else if (!daiWithSigner.interface.functions.createPool.encode) {
      console.error("daiWithSigner.interface.functions.createPool.encode is undefined");
    } else {
    const tx = {
      gasLimit: 1000000,
      to: daiAddress,
      value: 0,
      data: daiContract.createPool.encode(
        "0x7bDeD041832b5722927994443d69c87a0450b1E1",
        10000,
        10000,
        10000,
        10000,
        10000,
        "lol",
        "heyt"
      )
    };
    
    const signedTx = await signer.sign(tx);
    const txReceipt = await signer.sendTransaction(signedTx);
  }
    


  };

  const [num, setNum] = useState(0);
  
  const contractABI = abi.abi;

  const deployContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Connect to the Ethereum network
    const contract = new ethers.Contract(contractABI, provider.getSigner()); // Create a new contract instance
    const deployedContract = await contract.deploy(num); 
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);
  

  return (
    <div className="mainContainer">
 <form onSubmit={handleSubmit}>
      <label>
        Oracle Address:
        <input
          type="text"
          value={input1}
          onChange={(event) => setInput1(event.target.value)}
        />
      </label>
      <br />
      <label>
        Settlement Price:
        <input
          type="text"
          value={input2}
          onChange={(event) => setInput2(event.target.value)}
        />
      </label>
      <br />
      <label>
        Settlement Date:
        <input
          type="text"
          value={input3}
          onChange={(event) => setInput3(event.target.value)}
        />
      </label>
      <br />
      <label>
        Decay:
        <input
          type="text"
          value={input4}
          onChange={(event) => setInput4(event.target.value)}
        />
      </label>
      <br />
      <label>
        Min Ratio:
        <input
          type="text"
          value={input5}
          onChange={(event) => setInput5(event.target.value)}
        />
      </label>
      <br />
      <label>
        Min Ratio Date:
        <input
          type="text"
          value={input6}
          onChange={(event) => setInput6(event.target.value)}
        />
      </label>
      <br />
      <label>
        Name:
        <input
          type="text"
          value={input7}
          onChange={(event) => setInput7(event.target.value)}
        />
      </label>
      <br />
      <label>
        String:
        <input
          type="text"
          value={input8}
          onChange={(event) => setInput8(event.target.value)}
        />
      </label>
      <br />
      <label>
        Input 9:
        <input
          type="text"
          value={input9}
          onChange={(event) => setInput9(event.target.value)}
        />
      </label>
      <br />
        <button type="submit">Deploy Pool</button>
  </form>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

</div>
  );
};

export default App;