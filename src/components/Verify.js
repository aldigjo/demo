// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uport } from '../utilities/uportSetup'
import { JWT } from 'uport/dist/uport'
import UportLite from 'uport-lite'
const registryUndecorated = UportLite({infuraKey: 'uport'})
const VerifyWrap = styled.section``
const ConnectUport = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`

class Verify extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)
    this.registry = this.registry.bind(this)
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
      { requested: ['name'],
        verified: ['ticket'],
        notifications: true }
    ).then((credentials) => {
        JWT.verifyJWT({registry: this.registry, address: '35DDXwF6Hdr6dQQo1BRwQru7W3d54avzBwk'}, credentials.verified[0].jwt)
        .then(payload => {
          this.props.actions.verifyCredentialSUCCESS(payload)
        })
    })
  }

  render () {
    return (
      this.props.verification ? <div> Success!  </div>
      : ( 
        <VerifyWrap>
          <h4>Ethereum Meetup SF</h4>
          <SubText>RSVP with uPort</SubText>
          <ConnectUport
            onClick={this.connectUport}>
            Verify
          </ConnectUport>
        </VerifyWrap>
      )
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
export default connect(mapStateToProps, mapDispatchToProps)(Verify)
