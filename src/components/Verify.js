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
        console.log({credentials})
        console.log(credentials.verified[0].jwt)
        JWT.verifyJWT({registry: this.registry, address: '2oeXufHGDpU51bfKBsZDdu7Je9weJ3r7sVG'}, credentials.verified[0].jwt)
        .then(payload => {
            console.log('HERE')
            console.log(payload)
        })
        //this.props.actions.connectUport(credentials)
    })
  }

  render () {
    return (
      <VerifyWrap>
        <h4>Ethereum Meetup SF</h4>
        <SubText>RSVP with uPort</SubText>
        <ConnectUport
          onClick={this.connectUport}>
          Connect
        </ConnectUport>
      </VerifyWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(Verify)
