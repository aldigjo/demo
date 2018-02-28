pragma solidity ^0.4.8;

contract Tickets {
	mapping (address => uint) tickets;

	function buyTicket() public { tickets[msg.sender] = 1; }
	
	function hasTicket(address addr) public view returns(uint) { return tickets[addr]; }
	
	function doIHaveTicket() public view returns(uint) { return tickets[msg.sender]; }
}

