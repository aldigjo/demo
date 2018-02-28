// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uport } from '../utilities/uportSetup'

const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const verifyButton = styled.button`
background: 'white'
color: 'black'
border: 2px
margin-top: 20px;
`
const welcomeRow = styled.div``

class Welcome extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)
    this.verifyPage = this.verifyPage.bind(this)
  }

  connectUport () {
    console.log(this.props)
    uport.requestCredentials(
      { requested: ['name', 'phone', 'country', 'avatar'],
        accountType: 'segregated',
        notifications: true }
    ).then((credentials) => {
        console.log({credentials})
        this.props.actions.connectUport(credentials)
    })
  }

  verifyPage () {
    console.log(this)
    this.props.actions.verifyCredential()
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Ethereum Event Demo</h4>
        <SubText>RSVP with uPort</SubText>
        <ConnectUport
          onClick={this.connectUport}>
          Connect
        </ConnectUport>
        <welcomeRow>
          <br /><br />
          <verifyButton
            onClick={this.verifyPage}>
            Verify
          </verifyButton>
        </welcomeRow>
      </WelcomeWrap>
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
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
