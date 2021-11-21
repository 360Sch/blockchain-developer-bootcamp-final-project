
var web3 = new Web3(window.ethereum)

//Contract Address:
const escrowContractAdd = "0x68dc0c4D3Bc722A69977Ef67c2aa137218887E46"
var escrowContractABI = []
$.getJSON('/huatescrow/build/contracts/Escrow.json', function(data) {
  escrowContractABI = data.abi
  // console.log(data.abi)  
})

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

  
  const escrowContract = new web3.eth.Contract(escrowContractABI,escrowContractAdd)
  escrowContract.setProvider(window.ethereum)
  
  async function loadProperties() {
    const propertiesCount = await escrowContract.methods.totalProperties().call()
    console.log(`Total properties ${propertiesCount}`)
 
    var propertyRow = $('#propertyRow');
    var propertyTemplate = $('#propertyTemplate');

    for ( var i = 1; i <= propertiesCount; i++) {
        const property = await escrowContract.methods.properties(i).call()
        // console.log('inside')
        propertyTemplate.find('.property-title').text('Unit ' + i);

        if (property[0] == 1) {
          propertyTemplate.find('img').attr('src', 'img/type1.jpg')
        } else if (property[0] == 2) {
          propertyTemplate.find('img').attr('src', 'img/type2.jpg')
        } else if (property[0] == 3) {
          propertyTemplate.find('img').attr('src', 'img/type3.jpg')
        } else {
          propertyTemplate.find('img').attr('src', 'img/type3.jpg')
        }
       
        propertyTemplate.find('.property-description').text(property[0] + ' bedroom');
        propertyTemplate.find('.property-price').text(property[1]) ;
        // propertyTemplate.find('.property-address').text(data[i].location)

        if (property[3] == 0 ){
          propertyTemplate.find('.purchase-btn').html('Book now')
        } else if (property[3] == 1 ){
          propertyTemplate.find('.purchase-btn').html('Booked')
        } else if (property[3] == 2 ) {
          propertyTemplate.find('.purchase-btn').html('Solded!')
        } else {
          propertyTemplate.find('.purchase-btn').attr("disbled", true)
          propertyTemplate.find('.purchase-btn').html('Not Available')
        }
        
        propertyTemplate.find('.purchase-btn').attr('data-id', i);

        propertyRow.append(propertyTemplate.html());
      
    }
  }
  loadProperties()

 

    
    $(document).on('click', '.purchase-btn', async(event) => {
       event.preventDefault()
       var propertyId = parseInt($(event.target).data('id'));
       console.log(`click property ${propertyId}`)

       const result = await escrowContract.methods.payDeposit(propertyId).send({from:ethereum.selectedAddress, value: web3.utils.toWei('1', 'wei') })
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

    $('#create-property-btn').click( async (event)=>{
      event.preventDefault()
      await escrowContract.methods.createProperty($('#roomType').val(), $('#priceProperty').val()).send({from: ethereum.selectedAddress})
      
      // Remove properties listed
      $('#propertyRow').empty();
      // Display properties - Not the most efficient way to do this
      loadProperties()

      //test results
      // for (const x in result){
      //   console.log(`Purchased ${x} : ${result[x]}`)
      //  }
      //  for (const x in result['events']){
      //   console.log(`Purchased ${x} : ${result['events'][x]}`)
      //  }
    })

     // May fail to load sometimes
    // const createPropertyEvent = escrowContract.events;
    // createPropertyEvent.PropertyCreated({
    //  //  fromBlock: 0,
    //  //  toBlock: 'latest'
    // },function(error, result){
    //   if (error)
    //   {
    //    console.log(error)
    //   } else {
    //     console.log(`property ${result['returnValues']} `)  
    //     for (const x in result['returnValues']){
    //     console.log(`event result ${x} : ${result['returnValues'][x]}`)
    //     }
    //   }
    // })

    // Test to read events
    $(document).on('click', '#get-past-events-btn', async(event)=>{
      event.preventDefault()
      const pastEvents = await escrowContract.getPastEvents(
        'PropertyCreated',
        {
          fromBlock:94
        }
      )
      console.log(`Past events: ${JSON.stringify(pastEvents)}`)
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
    const escrowBalance = await web3.eth.getBalance(escrowContractAdd)
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

 


//  createPropertyBTH.onclick = async () => {
//     const ownerAccounts = await ethereum.request({method: 'eth_requestAccounts'})
//     console.log(`Owner account: ${ownerAccounts}`)
//     const ownerAccount = ethereum.selectedAddress

    

//  }