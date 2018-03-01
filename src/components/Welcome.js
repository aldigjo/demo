// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uport } from '../utilities/uportSetup'
import { JWT } from 'uport/dist/uport'
import { ConnectCore } from 'uport-connect';
import UportLite from 'uport-lite'
const registryUndecorated = UportLite({infuraKey: 'uport'})
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const verifyButton = styled.button`
  color: white;
  border-color: white;
  border: 2px;
`
const welcomeRow = styled.div``

class Welcome extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)
    this.registry = this.registry.bind(this)
    this.verifyPage = this.verifyPage.bind(this)
    this.verifyCredential = this.verifyCredential.bind(this)
  }

  registry (address) {
    return new Promise((resolve, reject) => {
      registryUndecorated(address, (error, profile) => {
        if (error) return reject(error)
        resolve(profile)
      })
    })
  }

  connectUport () {
    uport.requestCredentials(
      { requested: ['name', 'phone', 'country', 'avatar'],
        accountType: 'segregated',
        notifications: true }
    ).then((credentials) => {
        this.props.actions.connectUport(credentials)
    })
  }

  verifyCredential () {
    uport.requestCredentials(
      { requested: ['name'],
        accountType: 'segregated',
        verified: ['ticket'],
        notifications: true }
    ).then((credentials) => {
        if(!credentials.verified[0]) {
          this.props.actions.verifyCredentialFAIL()
        } else {
          JWT.verifyJWT({registry: this.registry, address: '35DDXwF6Hdr6dQQo1BRwQru7W3d54avzBwk'}, credentials.verified[0].jwt)
          .then(payload => {
            this.props.actions.verifyCredentialSUCCESS(payload)
          })
        }
    })
  }

  verifyPage () {
    this.props.actions.verifyCredential()
  }

  render () {
    return (
      this.props.verification 
      ? this.props.verification === 'fail'
        ? <div> <h4> No Entry! </h4></div> : <div> <h4> Entry Granted </h4> </div>
      : (<WelcomeWrap>
        <h4>Ethereum Event Demo</h4>
        <SubText>RSVP with uPort</SubText>
        <ConnectUport
          onClick={this.connectUport}>
          Get Ticket
        </ConnectUport>
        <div /> <div />
        <welcomeRow>
          <br /><br /><br />
          <ConnectUport
            onClick={this.verifyCredential}>
            Verify
          </ConnectUport>
        </welcomeRow>
      </WelcomeWrap>)
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
    verification: state.App.verification
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
