import React, {Component} from "react";
import Main from './Main';
import Navbar from './Navbar';
import Web3 from "web3";
import Tether from '../truffle_abis/Tether.json'
import BLM from '../truffle_abis/BLM.json'
import BlumBank from '../truffle_abis/BlumBank.json'

class App extends Component{

    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }


    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }else{
            window.alert('No ethereum browser detected! You can check out MataMask')
        }
    }

    //change it to connect wallet!!!

    async loadBlockchainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account: account[0]})
        const networkId = await web3.eth.net.getId()

        //load tether contract
        const tetherData = Tether.networks[networkId]
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
            this.setState({tether})
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({tetherBalance: tetherBalance.toString()})
        } else {
            window.alert('Error! Tether contract not deployed - no detected network')
        }

        //load BLM contract
        const blmData = BLM.networks[networkId]
        if(blmData){
            const blm = new web3.eth.Contract(BLM.abi, blmData.address)
            this.setState({blm})
            let blmBalance = await blm.methods.balanceOf(this.state.account).call()
            this.setState({blmBalance: blmBalance.toString()})
        } else {
            window.alert('Error! BLM contract not deployed - no detected network')
        }

        //load BlumBank contract
        const blumBankData = BlumBank.networks[networkId]
        if(blumBankData){
            const blumBank = new web3.eth.Contract(BlumBank.abi, blumBankData.address)
            this.setState({blumBank})
            let stakingBalance = await blumBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance: stakingBalance.toString()})
        } else {
            window.alert('Error! Blum bank contract not deployed - no detected network')
        }

        this.setState({loading: false})      
    }

    //stake
    stakeTokens = (amount) => {
        this.setState({loading: true })
        this.state.tether.methods.approve(this.state.blumBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
          this.state.blumBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading:false})
          })
        }) 
      }

      //unstake
    unstakeTokens = () => {
        this.setState({loading: true })
        this.state.blumBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading:false})
        }) 
    }

    issueTokens = () => {
        this.setState({loading: true})
        this.state.blumBank.methods.issueTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading:false})
        }) 
    }

                

    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            blm: {},
            blumBank: {},
            tetherBalance: '0',
            blmBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    render(){
        let content
        {this.state.loading ? 
        content = <p id="loader" className="text-center" style={{margin:'30px'}}>Loading...</p> : 
        content = 
        <Main 
        tetherBalance = {this.state.tetherBalance}
        blmBalance = {this.state.blmBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        blumBank = {this.blumBank}
        issueTokens = {this.issueTokens}
        />}
        return (
            <div>

                <Navbar account={this.state.account}/>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role = "main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;