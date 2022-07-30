const BlumBank = artifacts.require('BlumBank');

module.exports = async function issueBLM(callback) {
    let blumBank = await BlumBank.deployed()
    await blumBank.issueTokens()
    console.log('tokens have been issued successfully!')
    callback()

}