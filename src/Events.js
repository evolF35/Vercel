
import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './SimpleStorageABI.json'
import Event_abi from './Pool.json'


const Event = () => {

	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x40b8Af977B85201937972d2707E3edC44C45007a';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [tb, setTb] = useState(null);
	const [tb2,setTb2] = useState(null);

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
		setTb(tb);

		let z = poolInfo(tb[0].args[8]);
		console.log(z);

		console.log(tb[0].args[8]);

		const modifiedTb = tb.map(async (element, index) => {
			const zPOSBal = await getPoolInfo(tb[index].args[8]);

			let zPOSADD = zPOSBal[0].args[0];
			let zNEGADD = zPOSBal[0].args[1];

			let depPOS = await getpoolPOSDEP(tb[index].args[8]);
			let depNEG = await getpoolNEGDEP(tb[index].args[8]);
			let totBal = await getpoolTOTDEP(tb[index].args[8]);

			return {
			  ...element, // Spread the existing properties of element
			  zPOSBal: depPOS.toString(),
			  zNEGBal: depNEG.toString(),
			  zPOSADD: zPOSADD,
			  zNEGADD: zNEGADD,
			  zTOTBAL: totBal.toString()
			}
		  });
		  
		console.log(modifiedTb);

		let done = await Promise.all(modifiedTb);
		console.log(done);

		setTb(done);
	}
	  
	  const getPoolInfo = async (pool) => {
		try {
		  const result = await poolInfo(pool);
		  return result;
		} catch (error) {
		  console.error(error);
		}
	  };

	  const poolInfo = async (pool) => {

		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);
		const bfor4 = await tempContract3.queryFilter("*");
		return(bfor4);
	}

	const getpoolPOSDEP = async (pool) => {
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		let depPOS = await tempContract3.getDepNumPOS();
		return(depPOS);
	}

	const getpoolNEGDEP = async (pool) => {
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		let depNEG = await tempContract3.getDepNumNEG();
		return(depNEG);
	}

	const getpoolTOTDEP = async (pool) => {

		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		const balance = await tempProvider2.getBalance(pool);
		return(balance);

	}

	const depositToPOS = async (event) => {
		event.preventDefault();
		console.log("memes");

		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		//let tempContract3 = new ethers.Contract(tb[event], Event_abi, tempProvider2);


	}

	const depositToNEG = async (event) => {
		event.preventDefault();
		console.log("Looney");
	}


	return (
		<div>
		<h4> Current Pools </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>User_Address: {defaultAccount}</h3>
			</div>
      <div>
        <p>Deployer Contract: {contractAddress}</p>
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
			  <th> Settlement Date </th>
			  <th> Decay Rate  </th>
			  <th> Minimum Ratio </th>
			  <th> Minimum Ratio Date </th>
			  <th> name </th>
			  <th> acronym </th>
				
			  <th> POS address </th>
			  <th> NEG address </th>

			  <th> Deposit POS </th>
			  <th> Deposit NEG </th>

            </tr>
          </thead>
          <tbody>
            {tb.map((event, index) => (
              <tr key={index}>

				<td>{event.zTOTBAL}</td>
				<td>{event.zPOSBal}</td>
				<td>{event.zNEGBal}</td>

                <td>{event.args[8].toString()}</td>
                <td>{event.args[0].toString()}</td>
                <td>{event.args[1].toString()}</td>
                <td>{event.args[2].toString()}</td>
                <td>{event.args[3].toString()}</td>
				<td>{event.args[4].toString()}</td>
                <td>{event.args[5].toString()}</td>
                <td>{event.args[6].toString()}</td>
				<td>{event.args[7].toString()}</td>

				<td>{event.zPOSADD}</td>
				<td>{event.zNEGADD}</td>

				<td> <form onSubmit={depositToPOS} > <input id={"POS"+index} type="text" ></input> <button type="submit" >POS</button> </form> </td>
				<td> <form onSubmit={depositToNEG} > <input id={"NEG"+index} type="text" ></input> <button type="submit">NEG</button> </form> </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
	  
		</div>
	);
}

export default Event;