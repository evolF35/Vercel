
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";

import './App.css';
import abi from "./utils/GenPool.json";

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
      <div className="dataContainer">
        <div className="header">

        Fixed Pie Games

        </div>
<div>
      <form onSubmit={deployContract}>
        <label>
          Oracle:
          <input
            type="number"
            value={num}
            onChange={(event) => setNum(event.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={num}
            onChange={(event) => setNum(event.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="number"
            value={num}
            onChange={(event) => setNum(event.target.value)}
          />
        </label>
        <button type="submit">Deploy Contract</button>
      </form>
    </div>

        </div>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

</div>
  );
};

export default App;