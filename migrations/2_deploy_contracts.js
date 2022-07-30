const Tether = artifacts.require('Tether');
const BLM = artifacts.require('BLM');
const BlumBank = artifacts.require('BlumBank');

module.exports = async function(deployer, network, accounts){

    //deploy Tether contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    //deploy Tether contract
    await deployer.deploy(BLM);
    const blm = await BLM.deployed();

    //deploy BlumBank contract
    await deployer.deploy(BlumBank, blm.address, tether.address);
    const blumBank = await BlumBank.deployed();

    //trabsfer all BLM tokens to Blum Bank
    await blm.transfer(blumBank.address, '1000000000000000000000000');

    //give 100 Tether tokens to investors
    await tether.transfer(accounts[1], '100000000000000000000');

};