
import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './SimpleStorageABI.json'
import Event_abi from './Pool.json'
import Claim_abi from './Claim.json'


const Event = () => {

	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0xFf408125bf10064a4518f9aDa10b0E2124FAA807';

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

			let condition = await getpoolCondition(tb[index].args[8]);
			let withdrawON = await getpoolWithdrawOn(tb[index].args[8]);
			let dValue = await getpoolDiscountedValue(tb[index].args[8]);
			let pastSettleDate = await getpoolPastSettlementDate(tb[index].args[8]);


			return {
			  ...element, // Spread the existing properties of element
			  zPOSBal: (ethers.utils.formatEther(depPOS)).toString(),
			  zNEGBal: (ethers.utils.formatEther(depNEG)).toString(),
			  zPOSADD: zPOSADD,
			  zNEGADD: zNEGADD,
			  zTOTBAL: (ethers.utils.formatEther(totBal)).toString(),
			  zCONDITION: condition.toString(),
			  zWITHDRAW: withdrawON.toString(),
			  zDVALUE: dValue.toString(),
			  zPSDATE: pastSettleDate.toString(),
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

	const getpoolCondition = async (pool) => {
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		let depNEG = await tempContract3.getCondition();
		return(depNEG);
	}

	const getpoolCurrentRatio = async (pool) => {
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		let depNEG = await tempContract3.getCurrentRatio();
		return(depNEG);
	}

	const getpoolWithdrawOn = async (pool) => {
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		let depNEG = await tempContract3.withdrawOn();
		return(depNEG);
	}

	const getpoolDiscountedValue = async (pool) => {
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		let depNEG = await tempContract3.getDiscountedValue();
		return(depNEG);
	}

	const getpoolPastSettlementDate = async (pool) => {
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(pool, Event_abi, tempProvider2);

		let depNEG = await tempContract3.pastSettlementDate();
		return(depNEG);
	}




	const depToPOS = async (event,Addr1) => {
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		const lockedAmount = ethers.utils.parseEther("0.01");

		let stringNum = (event.target[0].value).toString();
		let deus = ethers.utils.parseEther(stringNum);

		await tempContract3.depositToPOS({value:deus});
	}

	const depToNEG = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		const lockedAmount = ethers.utils.parseEther("0.01");

		let stringNum = (event.target[0].value).toString();
		let deus = ethers.utils.parseEther(stringNum);

		await tempContract3.depositToNEG({value:deus});
	}

	const approveNEG = async (event,Addr1,Addr2) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract44 = new ethers.Contract(Addr1, Claim_abi, tempProvider2);
		let tempContract3 = new ethers.Contract(Addr1, Claim_abi, tempSigner2);

		let balance = await tempContract44.balanceOf(defaultAccount);

		await tempContract3.approve(Addr2,balance);
	}

	const approvePOS = async (event,Addr1,Addr2) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract44 = new ethers.Contract(Addr1, Claim_abi, tempProvider2);
		let tempContract3 = new ethers.Contract(Addr1, Claim_abi, tempSigner2);

		let balance = await tempContract44.balanceOf(defaultAccount);

		await tempContract3.approve(Addr2,balance);
	}

	const redeemwithPOS = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		await tempContract3.redeemWithPOS();
	}

	const redeemwithNEG = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		await tempContract3.redeemWithNEG();
	}

	const withdrawNEG = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		await tempContract3.withdrawWithNEG();
	}

	const withdrawPOS = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		await tempContract3.withdrawWithPOS();
	}

	const settleClaims = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		await tempContract3.settle();
	}

	const makeWithdrawable = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		await tempContract3.turnWithdrawOn();
	}

	const deZtruction = async (event,Addr1) => {
		
		event.preventDefault();
		
		let tempProvider2 = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner2 = tempProvider2.getSigner();

		let tempContract3 = new ethers.Contract(Addr1, Event_abi, tempSigner2);

		await tempContract3.turnToDust();
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

			<th> Past Settlement Date </th>
			<th> Condition </th>
			<th> Discount Rate </th>
			<th> Withdraw </th>


			<th> Contract Address </th>
              <th>Oracle Address</th>
              <th> Settlement Price </th>
			  <th> Settlement Date </th>
			  <th> Decay Rate  </th>
			  <th> Max Ratio </th>
			  <th> Max Ratio Date </th>
			  <th> name </th>
			  <th> acronym </th>
			  <th> DestructionDate </th>

				
			  <th> POS address </th>
			  <th> NEG address </th>

			  <th> Deposit POS </th>
			  <th> Deposit NEG </th>

			  <th> Approve POS </th>
			  <th> Approve NEG </th>

			  <th> Redeem POS </th>
			  <th> Redeem NEG </th>

			  <th> Withdraw POS </th>
			  <th> Withdraw NEG </th>

			  <th> settle </th>
			  <th> turnWithdrawOn </th>
			  <th> SELF DESTRUCTION!</th>

            </tr>
          </thead>
          <tbody>
            {tb.map((event, index) => (
              <tr key={index}>

				<td>{event.zTOTBAL}</td>
				<td>{event.zPOSBal}</td>
				<td>{event.zNEGBal}</td>

				<td> {event.zPSDATE} </td>
				<td> {event.zCONDITION} </td>
				<td> {event.zDVALUE} </td>
				<td> {event.zWITHDRAW} </td>


                <td className='address'>{event.args[8].toString()}</td>
                <td className='address'>{event.args[0].toString()}</td>
                <td>{event.args[1].toString()}</td>
                <td>{event.args[2].toString()}</td>
                <td>{event.args[3].toString()}</td>
				<td>{event.args[4].toString()}</td>
                <td>{event.args[5].toString()}</td>
                <td>{event.args[6].toString()}</td>
				<td>{event.args[7].toString()}</td>
				<td>{event.args[9].toString()}</td>

				<td className='address'>{event.zPOSADD}</td>
				<td className='address'>{event.zNEGADD}</td>

				<td> <form className='deposit' onSubmit={(e) => depToPOS(e, event.args[8].toString())}> <input id={"POSd"+index} type="text" ></input> <button type="submit" >POS</button> </form> </td>
				<td> <form className='deposit' onSubmit={(e) => depToNEG(e, event.args[8].toString())}> <input id={"NEGd"+index} type="text" ></input> <button type="submit" >NEG</button> </form> </td>

				<td> <form className='approvePOS' onSubmit={(e) => approvePOS(e, event.zPOSADD, event.args[8].toString())}> <button type="submit" >approvePOS</button> </form> </td>
				<td> <form className='approveNEG' onSubmit={(e) => approveNEG(e, event.zNEGADD, event.args[8].toString())}> <button type="submit" >approveNEG</button> </form> </td>

				<td> <form className='redeemPOS' onSubmit={(e) => redeemwithPOS(e, event.args[8].toString())}> <button type="submit" >redeemPOS</button> </form> </td>
				<td> <form className='redeemNEG' onSubmit={(e) => redeemwithNEG(e, event.args[8].toString())}> <button type="submit" >redeemNEG</button> </form> </td>

				<td> <form className='withdrawPOS' onSubmit={(e) => withdrawPOS(e, event.args[8].toString())}> <button type="submit" >withdrawPOS</button> </form> </td>
				<td> <form className='withdrawNEG' onSubmit={(e) => withdrawNEG(e, event.args[8].toString())}> <button type="submit" >withdrawNEG</button> </form> </td>

				<td> <form className='settle' onSubmit={(e) => settleClaims(e, event.args[8].toString())}>  <button type="submit" >settle</button> </form> </td>
				<td> <form className='turnwithdrawon' onSubmit={(e) => makeWithdrawable(e, event.args[8].toString())}>  <button type="submit" >turnwithdrawOn</button> </form> </td>
				<td> <form className='turnwithdrawon' onSubmit={(e) => deZtruction(e, event.args[8].toString())}>  <button type="submit" >DESTRUCTION</button> </form> </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
	  
		</div>
	);
}

export default Event;