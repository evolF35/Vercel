
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

	const [tb, setTb] = useState(null)

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

		const tb = await contract.queryFilter("*");
		console.log(tb);

		console.log(tb[0].args[0]);
		setTb(tb);

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

			{tb && (
        <table>
          <thead>
            <tr>
			<th> Total Balance </th>
			<th> POS Balance </th>
			<th> NEG Balance </th>
			<th> Contract Address </th>
              <th>Oracle Address</th>
              <th> Settlement Price </th>
			  <th> Settlement Data </th>
			  <th> Decay Rate  </th>
			  <th> Minimum Ratio </th>
			  <th> Minimum Ratio Date </th>
			  <th> name </th>
			  <th> acronym </th>

			  <th> Deposit POS </th>
			  <th> Deposit NEG </th>
            </tr>
          </thead>
          <tbody>
            {tb.map((event, index) => (
              <tr key={index}>

				<td>{event.args[8].toString()}</td>
				<td>{event.args[8].toString()}</td>
				<td>{event.args[8].toString()}</td>


                <td>{event.args[8].toString()}</td>
                <td>{event.args[0].toString()}</td>
                <td>{event.args[1].toString()}</td>
                <td>{event.args[2].toString()}</td>
                <td>{event.args[3].toString()}</td>
				<td>{event.args[4].toString()}</td>
                <td>{event.args[5].toString()}</td>
                <td>{event.args[6].toString()}</td>
				<td>{event.args[7].toString()}</td>

				<td>{event.args[7].toString()}</td>
				<td>{event.args[7].toString()}</td>


              </tr>
            ))}
          </tbody>
        </table>
      )}
	  
		</div>
	);
}

export default Event;