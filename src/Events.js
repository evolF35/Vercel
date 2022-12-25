
import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './SimpleStorageABI.json'

const Event = () => {

	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x7bDeD041832b5722927994443d69c87a0450b1E1';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
		setContract(tempContract);	
        console.log("contract set");
	}

    const getEvents = async () => {
        contract.on("createPool", 
        (oracle, price, date,
            decay, minratio, minratiodate,
            nme,acronym, event) => {
            console.log(`Oracle: ${oracle} Price: ${price} Date: ${date} Decay: ${decay} MinRatio: ${minratio} MinRatioDate: ${minratiodate} Name: ${nme} Acronym: ${acronym} Event: ${event} `);
        });
      };
      
          

	return (
		<div>
		<h4> Current Pools </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>User_Address: {defaultAccount}</h3>
			</div>
      <div>
        <p>Deployer Contract: 0x7bDeD041832b5722927994443d69c87a0450b1E1</p>
        <p> On : Goerli Testnet </p>
      </div>
            <button onClick={getEvents}>Get Events</button>

			{errorMessage}
		</div>
	);
}

export default Event;