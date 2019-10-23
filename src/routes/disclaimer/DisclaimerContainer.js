// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator } from 'react-native'
import { createDisclaimerEndpoint, PageModel, Payload } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../modules/theme/constants/theme'
import type { StateType } from '../../modules/app/StateType'
import type { NavigationScreenProp } from 'react-navigation'
import { baseUrl } from '../../modules/endpoint/constants'
import withTheme from '../../modules/theme/hocs/withTheme'
import Disclaimer from './Disclaimer'
import FailureContainer from '../../modules/error/containers/FailureContainer'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../modules/app/StoreActionType'

type OwnPropsType = {| navigation: NavigationScreenProp<*> |}

type StatePropsType = {| city: string, language: string |}

type PropsType = {| ...OwnPropsType, ...StatePropsType, dispatch: Dispatch<StoreActionType> |}

const mapStateToProps = (state: StateType): StatePropsType => {
  if (!state.cityContent) {
    throw new Error('CityContent must not be null!')
  }

  return { city: state.cityContent.city, language: state.contentLanguage }
}

type DisclaimerPropsType = {|
  navigation: NavigationScreenProp<*>,
  city: string,
  language: string,
  theme: ThemeType,
  dispatch: Dispatch<StoreActionType>
|}

type DisclaimerStateType = {|
  disclaimer: ?PageModel,
  error: ?Error
|}

class DisclaimerContainer extends React.Component<DisclaimerPropsType, DisclaimerStateType> {
  constructor (props: DisclaimerPropsType) {
    super(props)
    this.state = { disclaimer: null, error: null }
  }

  componentWillMount () {
    this.loadDisclaimer()
  }

  loadDisclaimer = async () => {
    const { city, language } = this.props
    this.setState({ error: null, disclaimer: null })

    try {
      const disclaimerEndpoint = createDisclaimerEndpoint(baseUrl)
      const payload: Payload<Array<PageModel>> = await (disclaimerEndpoint.request({ city, language }))

      if (payload.error) {
        this.setState(({ error: payload.error, disclaimer: null }))
      } else {
        this.setState(({ error: null, disclaimer: payload.data }))
      }
    } catch (e) {
      this.setState({ error: e, disclaimer: null })
    }
  }

  render () {
    const { theme, navigation, city, language } = this.props
    const { disclaimer, error } = this.state

    if (error) {
      return <FailureContainer error={error} tryAgain={this.loadDisclaimer} />
    }

    if (!disclaimer) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    return <Disclaimer disclaimer={disclaimer} theme={theme} navigation={navigation} city={city} language={language} />
  }
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
  withTheme(props => props.language)(
    DisclaimerContainer
  ))
