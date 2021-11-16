
var web3 = new Web3(window.ethereum)

//Contract Address:
const escrowContractAdd = "0xb35Ae76afd6B31eb51F5e64bc753a259a5390740"
const escrowContractABI = [ {
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "unit",
      "type": "uint256"
    }
  ],
  "name": "unitPurchased",
  "type": "event"
},
{
  "stateMutability": "payable",
  "type": "fallback",
  "payable": true
},
{
  "inputs": [],
  "name": "buyer",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "currentStatus",
  "outputs": [
    {
      "internalType": "enum Escrow.Status",
      "name": "",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "owners",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "seller",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "stateMutability": "payable",
  "type": "receive",
  "payable": true
},
{
  "inputs": [],
  "name": "getBalance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_unit",
      "type": "uint256"
    }
  ],
  "name": "makePayment",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "purchasedUnit",
      "type": "uint256"
    }
  ],
  "stateMutability": "payable",
  "type": "function",
  "payable": true
},
{
  "inputs": [],
  "name": "completePurchase",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function",
  "payable": true
}]

const contractBalance = document.getElementById('buy-btn')


window.addEventListener('load', function(){
    console.log('Windows load running')
    // Check if browser supports Ethereum
    if (typeof window.ethereum !== 'undefined'){
        console.log('Windows Ethereum is found.')
        // Check if Metamask is installed
        if( window.ethereum.isMetaMask == true) {
            console.log('MetaMask is found')
        } else {
            console.log('Please install or restart MetaMask')
        }
    }
    else {
        console.log('Windows Ethereum is not found. Try to install MetaMask')
    }

    
  $.getJSON('../property.json', function(data) {
      var propertyRow = $('#propertyRow');
      var propertyTemplate = $('#propertyTemplate');

      for (i = 0; i < data.length; i ++) {
        propertyTemplate.find('.property-title').text(data[i].name);
        propertyTemplate.find('img').attr('src', data[i].picture);
        propertyTemplate.find('.property-description').text(data[i].description);
        propertyTemplate.find('.property-price').text(data[i].price + " ETH") ;
        // propertyTemplate.find('.property-address').text(data[i].location);
        propertyTemplate.find('.purchase-btn').attr('data-id', data[i].id);

        propertyRow.append(propertyTemplate.html());
      }
    });

    
    $(document).on('click', '.purchase-btn', async(event) => {
       event.preventDefault()
       var propertyId = parseInt($(event.target).data('id'));
       console.log(`click property ${propertyId}`)

       const buyConnector = new web3.eth.Contract(escrowContractABI,escrowContractAdd)
       buyConnector.setProvider(window.ethereum)

       const result = await buyConnector.methods.makePayment(propertyId).send({from:ethereum.selectedAddress, value: web3.utils.toWei('1', 'ether') })
       for (const x in result){
        console.log(`Purchased ${x} : ${result[x]}`)
       }
       for (const x in result['events']){
        console.log(`Purchased ${x} : ${result['events'][x]}`)
       }
       for (const x in result['events']['unitPurchased']){
        console.log(`Purchased ${x} : ${result['events']['unitPurchased'][x]}`)
       }
    })
})




// Use web3 for transactions

//Reference to BTN ID that will connect to Metamask to load wallet/address 
const ethereumBTN = document.getElementById('mm-connect-btn')
//Reference to Label ID that will display the account address
const mmCurrentAccount = document.getElementById('mm-connected-account')

const mmBlockChainNetwork = document.getElementById('mm-connected-network')

const mmAccountBalance = document.getElementById('mm-account-balance-eth')

const escrowContractBalance = document.getElementById('escrow-balance-eth')

// Give permission for our app to connect to MetaMask
ethereumBTN.onclick = async () => {
    //Currently, we can connect to only one account address
    const accounts = await ethereum.request({method: 'eth_requestAccounts'})
    console.log(`List of accounts: ${accounts}`)
    // Display the account address
    // Can use ethereum.selectedAddress as well
    const account = accounts[0]
    mmCurrentAccount.innerHTML = account

    //Show current network
    const blockchainNetwork = await web3.eth.net.getNetworkType()
    mmBlockChainNetwork.innerHTML= blockchainNetwork
    // Can also use this
    // console.log(`Current Network Version: ${ethereum.networkVersion}`)

    //Show account balance
    const accountBalance = await web3.eth.getBalance(account)
    mmAccountBalance.innerHTML = web3.utils.fromWei(accountBalance) + " ETH"

    //Show Escrow Contract Balanace
    const escrowBalance = await web3.eth.getBalance("0x931ec913C33B358DA85Ead3f4C65Cc64b0e449f6")
    escrowContractBalance.innerHTML = web3.utils.fromWei(escrowBalance) + " ETH"
// ethereum.on('accountsChanged', function(accounts){
//     console.log(`New Account connected: ${ethereum.selectedAddress}`)
// })
// ethereum.on('chainChanged', (chainId) => {
//     // Handle the new chain.
//     // Correctly handling chain changes can be complicated.
//     // We recommend reloading the page unless you have good reason not to.
//     window.location.reload();
// });
}    




// contractBalance.onclick = async () => {
//     var web3 = new Web3(window.ethereum)
//     const escrowContract = new web3.eth.Contract(escrowContractABI, escrowContractAdd)
//     // escrowContract.setProvider(window.ethereum)

//     // await escrowContract.methods.retrieve().call()

//     console.log(escrowContractBal)
// }