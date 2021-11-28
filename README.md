# blockchain-developer-bootcamp-final-project

## Idea: Automated Property Purchases using Escrow Smart Contract
I like to use blockchain technology to simplify the conveyancing process and significantly reduce the time and cost it takes to buy and sell a property.

In future, I would also like to explore fractional property ownership so users can pool their money to buy home or commercial property for investments.

## Current Solution
Current version: Using blockchain technology to enable users to book and make an downpayment for the property. Only the owner of the contract can finalize to accept the downpayment to complete the booking.

Current Features:
- Only contract owner is able create property for sale
- Any buyer with ETH is able to make a full downpayment for the property through MetaMask
- After the buyer made the deposit, only the contract owner is able to complete the booking and transfer ETH out of the contract.

Future version: Owner is able to transfer ETH only if status of property is completed, time-base to automatically commplete the booking,  tole-Based Management(Owner,Lawyer,Buyer for example) and allow owner to obtain the payment, issue NFT for property purchase. And improvement to the User Experience with better login, login and loading experiences.

## APP URL
[https://on9commerce.github.io/](https://on9commerce.github.io/)

## Simple Workflow To Use The App If You Want To Test It locally
1. Start Ganache.
2. In ESCROW folder using command prompt, 'truffle migrate --network' to create ESCROW contract. 
3. Load the truffle-config.js file in Ganache UI to see the contract if you like to see the contract and transation using a UI.
4. In the app.js file, update the 'const escrowContractAdd = ' to the contract address.
5. Use live server in VSCode to start index.html in the web browser.
6. In the web browser, login with Metamask in Rinkeby Network using the owner account that created the ESCROW smart contract and you should see the UI at the bottom to create new properties.
7. Create a few properties.
8. Login with Metamask using another account and you will not be able to see the UI to create any new properties.
9. You can buy the property that you like to book the unit
10. Switch back to the owner account and you will able to see the 'Complete (Contract Owner)' button on the property that was purchased by the previous account.
11. Click to 'Complete (Contract Owner)' button for the property and the ESCROW account value will be updated at the bottom of the page.
12. Click on 'Transfer ETH To Contract Owner' to receive ETH to your MetaMask wallet!


## Project Structure
- `ESCROW` - Solidaity Contract Files
- `CLIENT` - Frontend Files

### Backend
- Node.js >= 12.16.3
- Truffle and Ganache
- Ganache Port Number 8545

### Frontend
Frontend is developed using vanilla javascript. You do not need to a server to run the frontend. You can use live server in vscode. 

### Unit Test
truffle test

## Design Patterns
[Design patterns used](https://github.com/on9commerce/blockchain-developer-bootcamp-final-project/blob/main/design_pattern_decisions.md)

## Avoid Common Attacks
[Avoid common attacks](https://github.com/on9commerce/blockchain-developer-bootcamp-final-project/blob/main/avoiding_common_attacks.md)

## Deployed Address
[Deployed_address.txt](https://github.com/on9commerce/blockchain-developer-bootcamp-final-project/blob/main/deployed_address.txt)

## Screenscast
[Youtube](https://youtu.be/-gl2ZQShToc)

## Public Ethereum Address for NFT Cert
0x3B7e3ff9E864665DD747f2fa6D6A9a0780324c1b
