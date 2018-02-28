import TicketContract from '../utilities/TicketContract'

async function getShares (addr, actions) {
  actions.getCurrentSharesREQUEST()
  TicketContract.hasTicket
    .call(addr, (error, sharesNumber) => {
      if (error) {
        actions.getCurrentSharesERROR(error)
        throw error
      }
      const sharesNumberDecoded = sharesNumber.toNumber()
      actions.getCurrentSharesSUCCESS(sharesNumberDecoded)
      return sharesNumberDecoded
    })
}

export default getShares
