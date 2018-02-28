import { web3 } from './uportSetup'

function TicketContractSetup () {
  let TicketsABI = web3.eth.contract([{"constant":true,"inputs":[],"name":"doIHaveTicket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"hasTicket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buyTicket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}])
  let TicketContractObj = TicketsABI.at('0x2e7f00a6084cf6b0f877e548717ba616bcdb0b08')
  return TicketContractObj
}

const TicketContract = TicketContractSetup()

export default TicketContract
