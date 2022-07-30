// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;

import './BLM.sol';
import './Tether.sol';

contract BlumBank{
    string public name = 'Blum Bank';
    address public owner;
    BLM public blm;
    Tether public tether;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(BLM _blm, Tether _tether) public{
        owner = msg.sender;
        blm = _blm;
        tether = _tether;
    }

    //staking function
    function depositTokens(uint _amount) public{

        require(_amount > 0, 'The amount can not be 0 or less');

        //transfer USDT tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        //update staking balance
        stakingBalance[msg.sender] += _amount;

        //check if the user has already staked in Blum
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //update staking balance
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //issue rewards blm token
    function issueTokens() public{

       // require(msg.sender == owner, 'only the owner can issue reward tokens');
        for(uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 10; //get 10% staking incentive
            if(balance > 0){blm.transfer(recipient, balance);}
        }
    }

    //unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'can not be less than zero');

        //transfer the tokens to the specified contract from our bank
        tether.transfer(msg.sender, balance);

        //reset staking balance
        stakingBalance[msg.sender] = 0;

        //update staking status
        isStaked[msg.sender] = false;

    }
}