// @flow

import React from 'react'

import Heading from './Heading'
import ScrollingSearchBox from '../../../modules/common/components/ScrollingSearchBox'
import CitySelector from './CitySelector'
import CityModel from '../../../modules/endpoint/models/CityModel'
import styled from 'styled-components'

import type { TFunction } from 'react-i18next'
import { withNamespaces } from 'react-i18next'

const Container = styled.div`
  padding-top: 22px;
`

type PropsType = {|
  cities: Array<CityModel>,
  language: string,
  t: TFunction
|}

type StateType = {|
  filterText: string,
  stickyTop: number
|}

export class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {filterText: '', stickyTop: 0}
  }

  onFilterTextChange = (filterText: string) => this.setState({filterText})

  onStickyTopChanged = (stickyTop: number) => this.setState({stickyTop})

  render () {
    const {cities, language, t} = this.props
    const {filterText, stickyTop} = this.state

    return (
      <Container>
        <Heading />
        <ScrollingSearchBox
          filterText={filterText}
          onFilterTextChange={this.onFilterTextChange}
          placeholderText={t('searchCity')}
          spaceSearch={false}
          onStickyTopChanged={this.onStickyTopChanged}>
          <CitySelector
            stickyTop={stickyTop}
            cities={cities}
            filterText={filterText}
            language={language}
          />
        </ScrollingSearchBox>
      </Container>
    )
  }
}

export default withNamespaces('landing')(FilterableCitySelector)
