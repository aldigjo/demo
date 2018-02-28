// Frameworks
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

import { uport } from '../utilities/uportSetup'

import TicketContract from '../utilities/TicketContract'
import waitForMined from '../utilities/waitForMined'
import checkAddressMNID from '../utilities/checkAddressMNID'
import getShares from '../utilities/getShares'

import styled from 'styled-components'

const SharesWrap = styled.section`
  @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
    position: inherit;
  }
`
const SharesArea = styled.div``
const CurrentSharesArea = styled.div`
  margin-bottom: 20px;
`
const CurrentSharesNumber = styled.span`
  color: white;
`
const FormBuyshares = styled.form``
const FormRow = styled.div``
const BtnBuyShares = styled.button``
const NextButton = styled.button`
  margin-top: 20px;
`
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`

class SignTransaction extends Component {

  constructor (props) {
    super(props)
    this.getCurrentShares = this.getCurrentShares.bind(this)
    this.buyShares = this.buyShares.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  getCurrentShares () {
    // TODO: Dump this check once MNID is default behavior
    const addr = checkAddressMNID(this.props.uport.address)
    const actions = this.props.actions
    getShares(addr, actions)
  }

  buyShares (e) {
    e.preventDefault()

    this.props.actions.updatesharesInput(1)
    let sharesNumber = this.props.sharesInput
    const addr = checkAddressMNID(this.props.uport.address)
    const actions = this.props.actions

    this.props.actions.buySharesREQUEST(sharesNumber)

    TicketContract.buyTicket((error, txHash) => {
      console.log('buyTicket')
      if (error) { this.props.actions.buySharesERROR(error) }
      waitForMined(addr, txHash, { blockNumber: null }, actions,
        () => {
          this.props.actions.buySharesPENDING()
        },
        (total) => {
          console.log('waitForMined complete')
          this.props.actions.buySharesSUCCESS(txHash, total)
          uport.attestCredentials({
            sub: this.props.uport.address,
            claim: {ticket: this.props.uport.name},
            exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // 30 days from now
            uriHandler: (log) => { console.log(log) }
          })
        }
      )
    })
  }

  handleInputChange (event) {
    this.props.actions.updatesharesInput(event.target.value)
  }

  componentDidMount () {
    // Populate existing shares
    this.getCurrentShares()
  }

  render () {
    return (
      <SharesWrap>
        <h4>Register For Event</h4>

        <SharesArea>
          {
            this.props.buyingInProgress
              ? (
                <div>
                  <br />
                  <div className="spinner center">
                    {[...Array(12)].map((x,i) =>
                      <div className="spinner-blade"key={i}/>
                    )}
                  </div>
                  <br />
                </div>
              )
              : this.props.txHash ? <div> your ticket should be arriving to your phone! </div>
              : (
                <FormBuyshares>
                  <FormRow>
                    <br />
                    <BtnBuyShares
                      onClick={this.buyShares}>
                      Buy Ticket
                    </BtnBuyShares>
                  </FormRow>
                  <FormRow>
                    <br />
                    {
                      this.props.buyingInProgress
                        ? <div>Please wait for transaction card on phone</div>
                        : null
                    }
                  </FormRow>
                </FormBuyshares>
              )
          }
        </SharesArea>
        {
          this.props.confirmingInProgress
            ? <div>Please confirm the transaction card on your phone</div>
            : null
        }

      </SharesWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
    sharesInput: state.App.sharesInput,
    gettingShares: state.App.gettingShares,
    confirmingInProgress: state.App.confirmingInProgress,
    sharesTotal: state.App.sharesTotal,
    buyingInProgress: state.App.buyingInProgress,
    tx: state.App.tx,
    error: state.App.error,
    ticketPurchased: state.App.ticketPurchased,
    txHash: state.App.txHash
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignTransaction)
