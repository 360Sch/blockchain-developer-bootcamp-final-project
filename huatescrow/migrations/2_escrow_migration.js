var Escrow = artifacts.require('Escrow');

module.exports = function(depolyer) {
    depolyer.deploy(Escrow);
}