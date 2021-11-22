
App = {
    contracts: {},
    propertiesCount: 0,
    account: null,
      load: async () => {
        await App.initConfig()
        await App.loadAccount()
        // await App.loadSmartContract()
        // await App.renderUI()
    },
    initConfig: async () => {
        console.log('loadweb3')
        if(typeof window.ethereum !== 'undefined'){
            console.log('Windows Ethereum is found.')
         
            if(window.ethereum.isMetaMask == true) {
                console.log('MetaMask is found')
            } else {
                console.log('Please install or restart MetaMask')
            }
        } else {
            console.log('Windows Ethereum is not found. Try to install MetaMask')
            return;
        }
    },
    loadAccount: async () => {
        console.log('loadAccount')
        try {
            const accounts = await ethereum.request({method: 'eth_requestAccounts'})
            console.log(`List of accounts: ${accounts} ${ethereum.selectedAddress}`)
            App.account = accounts[0]
            console.log(`account: ${App.account}`)
           $('#mm-connected-account').text(App.account)
        
            // TODO: refactor
            const web3 = new Web3(window.ethereum)
            //Show current network
            const blockchainNetwork = await web3.eth.net.getNetworkType()
            $('#mm-connected-network').text(blockchainNetwork)
            //Show account balance
            const accountBalance = await web3.eth.getBalance(App.account)
            $('#mm-account-balance-eth').text(web3.utils.fromWei(accountBalance) + " ETH")

        } catch (error) {
            if (error.code === 4001) {
              // User rejected request
              console.log('User reject request to connect to Metamask')
            }
            console.log(error)
            return;
        }

        //Reload page if user change or disconnect Metamask
        ethereum.on('accountsChanged', function(accounts){
            console.log(`New Account connected: ${ethereum.selectedAddress}`)
            window.location.reload();
        })
        //Reload page if user change network
        ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
            window.location.reload();
        });
  
        App.loadSmartContract()
           // web3.currentProvider.publicConfigStore.on('update', callback);
    },
    loadSmartContract: async () => {

        console.log('loadSmartContract')
        // Create instance of Web3
        const web3 = new Web3(window.ethereum)
        // Contract Address:
        const escrowContractAdd = "0x68dc0c4D3Bc722A69977Ef67c2aa137218887E46"
        $('#escrow-smart-contract-address').text(escrowContractAdd)
        // TODO: Read ABI easily during development phase. Change to actual ABI when we go live
        const escrowContractABI = await $.getJSON('/huatescrow/build/contracts/Escrow.json')    
        // Connect to contract
        App.contracts.escrowContract = new web3.eth.Contract(escrowContractABI.abi, escrowContractAdd)
        // TODO: Not sure if this is still required
        // escrowContract.setProvider(window.ethereum)
        const escrowBalance = await web3.eth.getBalance(escrowContractAdd)
        $('#escrow-balance-eth').text(escrowBalance)
        // escrowContract.methods.balanceOf('0xd26114cd6EE289AccF82350c8d8487fedB8A0C07').call((err, result) => { console.log(result) }
        await App.displayPropertyCount()
        await App.displayProperty()

    },
    displayPropertyCount: async() =>{
        App.propertiesCount = await App.contracts.escrowContract .methods.totalProperties().call()
        $('#properties-count').text(App.propertiesCount) 
    },
    displayProperty: async() =>{
        console.log('displayproperty')
        const propertyRow = $('#propertyRow');
        $('#propertyRow').empty();
        const propertyTemplate = $('#propertyTemplate');

        // Check if contractOwner is using this page
        const contractOwner = await App.contracts.escrowContract.methods.owner().call()
        console.log(`Contract owner: ${contractOwner}`)

        for ( var i = 1; i <= App.propertiesCount; i++) {
            const property = await App.contracts.escrowContract.methods.properties(i).call()
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
            
            // TODO: refactor
            propertyTemplate.find('.purchase-btn').attr("disabled", false).show()
            propertyTemplate.find('.complete-booking-btn').hide()
            propertyTemplate.find('.property-status').text('')

            if (property[2] == 0 ){
              propertyTemplate.find('.purchase-btn').html('Pay deposit to book now')
            } else if (property[2] == 1 ){
                // propertyTemplate.find('.purchase-btn').html('Booked')
              propertyTemplate.find('.purchase-btn').attr("disabled", true).hide()
              propertyTemplate.find('.property-status').text('Unit is booked')
           
              if (contractOwner.toLowerCase() == App.account.toLowerCase()){
                propertyTemplate.find('.complete-booking-btn').attr('data-id', i);
                propertyTemplate.find('.complete-booking-btn').show()    
              }
              
            } else if (property[2] == 2 ) {
                propertyTemplate.find('.property-status').text('Unit is Sold')
                propertyTemplate.find('.purchase-btn').attr("disabled", true).hide()
            } else {
            //   propertyTemplate.find('.purchase-btn').attr("disabled", true)
              propertyTemplate.find('.purchase-btn').html('Not Available')
            }
            propertyTemplate.find('.purchase-btn').attr('data-id', i);
    
            propertyRow.append(propertyTemplate.html());
        }
        
    },
    createProperty: async () => {
        await App.contracts.escrowContract.methods.createProperty($('#roomType').val(), $('#priceProperty').val()).send({from: ethereum.selectedAddress})
        await App.displayPropertyCount()
        await App.displayProperty()
    },
    buyProperty: async () =>{
        console.log('buyProperty')
        const propertyId = parseInt($(event.target).data('id'));

        // TODO: refactor this
        const web3 = new Web3(window.ethereum)
        const property = await App.contracts.escrowContract.methods.properties(propertyId).call()
        const propertyDownPayment = property[1]
        // console.log(`click property ${propertyId}`)
        try {
            await App.contracts.escrowContract.methods.payDeposit(propertyId).send({from: ethereum.selectedAddress, value: web3.utils.toWei(propertyDownPayment, 'wei')})
            await App.displayPropertyCount()
            await App.displayProperty()
        } catch(error) {
            console.log(error)
        }
    },
    completeBooking: async () => {
        const propertyId = parseInt($(event.target).data('id'));
        console.log(`completeBooking ${propertyId}`)
        
        // TODO: refactor this
        // const property = await App.contracts.escrowContract.methods.properties(propertyId).call()

        try {
            await App.contracts.escrowContract.methods.completeBooking(propertyId).send({from: ethereum.selectedAddress})
            await App.displayPropertyCount()
            await App.displayProperty()

        } catch(error) {
            console.log(error)
        }
    }
}

$(() => {
  $(window).on('load', () => {
    App.load()
  })
})