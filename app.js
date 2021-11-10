
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
})


// Use web3 for transactions
var web3 = new Web3(window.ethereum)

//Reference to BTN ID that will connect to Metamask to load wallet/address 
const ethereumBTN = document.getElementById('mm-connect')
//Reference to Label ID that will display the account address
const mmCurrentAccount = document.getElementById('mm-connected-account')

const mmBlockChainNetwork = document.getElementById('mm-connected-network')

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
    mmBlockChainNetwork.innerHTML = blockchainNetwork
    // Can also use this
    // console.log(`Current Network Version: ${ethereum.networkVersion}`)
}

// ethereum.on('accountsChanged', function(accounts){
//     console.log(`New Account connected: ${ethereum.selectedAddress}`)
// })
// ethereum.on('chainChanged', (chainId) => {
//     // Handle the new chain.
//     // Correctly handling chain changes can be complicated.
//     // We recommend reloading the page unless you have good reason not to.
//     window.location.reload();
// });

