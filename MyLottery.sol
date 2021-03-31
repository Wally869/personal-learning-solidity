// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyLottery {
    mapping(uint => address) private _drawWinners;

    address[] private _currentDrawParticipants;

    address private _owner;

    uint public prizePool;


    uint public idCurrentDraw = 0;
    uint public priceTicket;

    

    constructor () { 
        _owner = msg.sender;
        priceTicket = 1 ether; 
    }


    function owner() public view returns (address){
        return _owner;

    }


    modifier onlyOwner() {
        require(owner() == msg.sender, "MyLottery: caller is not the owner");
        _;
    }


    function getWinner(uint idDraw) public view returns (address) {
        require(idDraw < idCurrentDraw, "This draw has not been done yet");
        return _drawWinners[idDraw];
    }


    event OnTicketBought(uint idDraw, address participantAddress);

    function buyTicket() public payable returns (uint) {
        require(msg.value == priceTicket, "Msg Value is different from ticket price");
        
        prizePool += priceTicket;
        _currentDrawParticipants.push(msg.sender);

        emit OnTicketBought(idCurrentDraw, msg.sender);
    }



    function random(uint sizeRange) public view returns (uint) {
        uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        return randomHash % sizeRange;
    } 

    event OnDrawWinner(uint idDraw, address winnerAddress, uint sizePrizePool);

    function drawWinner() public onlyOwner {
        uint idWinner = random(_currentDrawParticipants.length);


        address payable winner = payable(_currentDrawParticipants[idWinner]);
        _drawWinners[idCurrentDraw] = _currentDrawParticipants[idWinner];

        sendWinningsToAddress(winner);

        emit OnDrawWinner(idCurrentDraw, winner, prizePool);

        delete _currentDrawParticipants;
        prizePool = 0;
        idCurrentDraw++;

    }

    function getNbParticipants() public view returns (uint) {
        return _currentDrawParticipants.length;
        
    }



    function sendWinningsToAddress(address payable _to) private {
        _to.transfer(prizePool - 1 ether);

    }



}