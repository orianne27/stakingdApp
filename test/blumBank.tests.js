const assert = require('assert');
const Tether = artifacts.require('Tether');
const BLM = artifacts.require('BLM');
const BlumBank = artifacts.require('BlumBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('BlumBank', ([owner, customer]) => {

    let tether, blm, blumBank;

    function tokens(number){
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        //load contracts
        tether = await Tether.new();
        blm = await BLM.new();
        blumBank = await BlumBank.new(blm.address, tether.address);

        //transfer all tokens to blum bank (1M)
        await blm.transfer(blumBank.address, tokens('1000000'))

        //transfer 100 mock tether to investor
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Mock Tether')
        })
    })

    describe('BLM Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await blm.name()
            assert.equal(name, 'Blum Reward Token')
        })
    })

    describe('Blum Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await blumBank.name()
            assert.equal(name, 'Blum Bank')
        })

        it('contract has tokens', async () => {
            let balance = await blm.balanceOf(blumBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yeild Farming', async () => {
        it('blm tokens for staking', async () => {
            let result 

            //check investor balance
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'investor mock wallet balance before staking')

            //check staking for customer
            await tether.approve(blumBank.address, tokens('100'), {from: customer})
             await blumBank.depositTokens(tokens('100'), {from: customer})

            //check updated balance of customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'), 'investor mock wallet balance after staking')

            //check updated balance of blum bank
            result = await tether.balanceOf(blumBank.address)
            assert.equal(result.toString(), tokens('100'), 'banks mock wallet balance after staking for customer')

            //check issue tokens
            await blumBank.issueTokens({from: owner})
            
            //ensure only owner can issue tokens
            await blumBank.issueTokens({from: customer}).should.be.rejected;

            //unstake tokens
            await blumBank.unstakeTokens({from: customer})
            
        })
    })
});