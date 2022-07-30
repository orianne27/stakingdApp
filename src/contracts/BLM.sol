// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;

contract BLM{
    string public name = 'Blum Reward Token';
    string public symbol = 'BLM';
    uint256 public totalSupply = 1000000000000000000000000; //1M
    uint8 public decimal = 18;

    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public{
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){

        //require that the value is greater/equal to the current balance of the contract
        require(balanceOf[msg.sender] >= _value);

        //transfer the amount to the "buyer" and send to his account
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //for 3rd party transactions, using this contract
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    } 
    
}