import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './SimpleStorageABI.json'

const SimpleStorage = () => {

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
	}

    const setHandler2 = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setText1.value + ' to the contract');
		contract.createPool(
            event.target.setText1.value,
            event.target.setText2.value,
            event.target.setText3.value,
            event.target.setText4.value,
            event.target.setText5.value,
            event.target.setText6.value,
            event.target.setText7.value,
            event.target.setText8.value,
            );
	}

	return (
		<div>
		<h4> {"Get/Set Contract interaction"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>User_Address: {defaultAccount}</h3>
			</div>
      <div>
        <p>Deployer Contract: 0x7bDeD041832b5722927994443d69c87a0450b1E1</p>
        <p> On : Goerli Testnet </p>
      </div>

            <form onSubmit={setHandler2}>
      <label>
        Oracle Address
        <input id="setText1"
          type="text"
          placeholder='0x0000000000000000000000000000000000000000'
        />
      </label>
      <br />
      <label>
        Settlement Price
        <input id="setText2"
          type="text"
          placeholder='2000'
        />
      </label>
      <br />
      <label>
      Settlement Date in Unix Time
        <input id="setText3"
          type="text"
            placeholder='1671842154'
        />
      </label>
      <br />
      <label>
        Decay Rate
        <input id="setText4"
          type="text"
          placeholder='2'
        />
        Percent decrease of inputs per day. 2 = 2% decrease per day
      </label>
      <br />
      <label>
        Min Ratio of Pool
        <input id="setText5"
          type="text"
          placeholder='2'
        />
        2 = 2:1 . So 2 eth in POS vs 1 eth in NEG side of Pool
      </label>
      <br />
      <label>
        Min Ratio Date in Unix Time
        <input id="setText6"
          type="text"
            placeholder='1671842154'
        />
      </label>
      <br />
      <label>
        Name
        <input id="setText7"
          type="text"
          placeholder='lolcats'
        />
      </label>
      <br />
      <label>
        Acronym 
        <input id="setText8"
          type="text"
          placeholder='lol'
        />
      </label>
        <br />
        <button type="submit">Deploy Pool</button>
  </form>

			{errorMessage}
		</div>
	);
}

export default SimpleStorage;