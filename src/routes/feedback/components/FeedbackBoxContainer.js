// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import CityModel from '../../../modules/endpoint/models/CityModel'
import FeedbackEndpoint, {
  CATEGORIES_FEEDBACK_TYPE, DEFAULT_FEEDBACK_LANGUAGE,
  EVENTS_FEEDBACK_TYPE,
  EXTRA_FEEDBACK_TYPE, EXTRAS_FEEDBACK_TYPE, INTEGREAT_INSTANCE,
  PAGE_FEEDBACK_TYPE,
  SEARCH_FEEDBACK_TYPE
}
  from '../../../modules/endpoint/FeedbackEndpoint'
import type { TFunction } from 'react-i18next'
import { CATEGORIES_ROUTE } from '../../../modules/app/routes/categories'
import { EVENTS_ROUTE } from '../../../modules/app/routes/events'
import { SEARCH_ROUTE } from '../../../modules/app/routes/search'
import { DISCLAIMER_ROUTE } from '../../../modules/app/routes/disclaimer'
import type { LocationState } from 'redux-first-router'
import FeedbackDropdownItem from '../FeedbackDropdownItem'
import { WOHNEN_ROUTE } from '../../../modules/app/routes/wohnen'
import { SPRUNGBRETT_ROUTE } from '../../../modules/app/routes/sprungbrett'
import { EXTRAS_ROUTE } from '../../../modules/app/routes/extras'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import FeedbackBox from './FeedbackBox'
import { translate } from 'react-i18next'
import type { FeedbackDataType } from '../../../modules/endpoint/FeedbackEndpoint'

const TECHNICAL_TOPICS_OPTION = 'TECHNICAL TOPICS'

type PropsType = {
  cities: ?Array<CityModel>,
  title?: string,
  alias?: string,
  id?: number,
  query?: string,
  isPositiveRatingSelected: boolean,
  location: LocationState,
  isOpen: boolean,
  extras?: ?Array<ExtraModel>,
  t: TFunction
}

type StateType = {
  feedbackOptions: Array<FeedbackDropdownItem>,
  selectedFeedbackOption: FeedbackDropdownItem,
  comment: string
}

/**
 * Renders a FeedbackBox with all possible feedback options the User can select
 */
export class FeedbackBoxContainer extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    const feedbackOptions = this.getFeedbackOptions()
    this.state = {feedbackOptions: feedbackOptions, selectedFeedbackOption: feedbackOptions[0], comment: ''}
  }

  componentDidUpdate (prevProps: PropsType) {
    const {isOpen} = this.props
    const prevIsOpen = prevProps.isOpen

    // If the FeedbackBoxContainer is opened, we have to reset and initialize the state and post the feedback
    if (prevIsOpen !== isOpen && isOpen) {
      /* eslint-disable react/no-did-update-set-state */
      const feedbackOptions = this.getFeedbackOptions()
      const selectedFeedbackOption = feedbackOptions[0]
      this.setState({feedbackOptions: feedbackOptions, selectedFeedbackOption: selectedFeedbackOption, comment: ''})
      FeedbackEndpoint.postData(this.getFeedbackData(selectedFeedbackOption, ''))
    }
  }

  /**
   * Returns all feedback options which are:
   * * Feedback for the current page if it isn't the categories/events/extras page
   * * Feedback for the content of the current city if the current route is a LocationRoute
   * * Feedback for all available extras if the current page is the extras page
   * * Feedback for technical topics
   * @return {Array}
   */
  getFeedbackOptions = (): Array<FeedbackDropdownItem> => {
    const {cities, location, t} = this.props
    const {city} = location.payload
    const currentRoute = location.type

    const options = []
    const currentPageFeedbackOption = this.getCurrentPageFeedbackOption()
    if (currentPageFeedbackOption) {
      options.push(currentPageFeedbackOption)
    }
    if (city && cities) {
      const cityTitle = CityModel.findCityName(cities, city)
      let feedbackType
      if (currentRoute === EVENTS_ROUTE) {
        feedbackType = EVENTS_FEEDBACK_TYPE
      } else if (currentRoute === EXTRAS_ROUTE) {
        feedbackType = EXTRAS_FEEDBACK_TYPE
      } else {
        feedbackType = CATEGORIES_FEEDBACK_TYPE
      }
      // We don't want to differ between the content of categories, extras and events for the user, but we want to know
      // from which route the feedback was sent
      options.push(new FeedbackDropdownItem(`${t('contentOfCity')} ${cityTitle}`, feedbackType))
      this.getExtrasFeedbackOptions().forEach(option => options.push(option))
    }

    options.push(new FeedbackDropdownItem(t('technicalTopics'), CATEGORIES_FEEDBACK_TYPE, TECHNICAL_TOPICS_OPTION))

    return options
  }

  /**
   * Returns a feedback option for every available extra
   * @return {*}
   */
  getExtrasFeedbackOptions = (): Array<FeedbackDropdownItem> => {
    const {extras, location, t} = this.props
    const currentRoute = location.type
    if (extras && currentRoute === EXTRAS_ROUTE) {
      return extras.map(
        extra => new FeedbackDropdownItem(`${t('extra')} '${extra.title}'`, EXTRA_FEEDBACK_TYPE, extra.alias)
      )
    }
    return []
  }

  /**
   * Returns a feedback option for the current page or null if there shouldn't be one
   * @return {*}
   */
  getCurrentPageFeedbackOption = (): ?FeedbackDropdownItem => {
    const {location, id, alias, title, query, t} = this.props
    const type = location.type

    if (type === CATEGORIES_ROUTE && id && title) {
      return new FeedbackDropdownItem(`${t('contentOfPage')} '${title}'`, PAGE_FEEDBACK_TYPE)
    } else if (type === EVENTS_ROUTE && id && title) {
      return new FeedbackDropdownItem(`${t('news')} '${title}'`, PAGE_FEEDBACK_TYPE)
    } else if ((type === WOHNEN_ROUTE || type === SPRUNGBRETT_ROUTE) && alias && title) {
      return new FeedbackDropdownItem(`${t('extra')} '${title}'`, EXTRA_FEEDBACK_TYPE)
    } else if (type === SEARCH_ROUTE && query) {
      return new FeedbackDropdownItem(`${t('searchFor')} '${query}'`, SEARCH_FEEDBACK_TYPE)
    } else if (type === DISCLAIMER_ROUTE) {
      return new FeedbackDropdownItem(`${t('disclaimer')}`, PAGE_FEEDBACK_TYPE)
    } else {
      return null
    }
  }

  /**
   * Returns the data that should be posted to the FeedbackEndpoint
   * @param selectedFeedbackOption
   * @param comment
   * @return {{feedbackType: string, isPositiveRating: boolean, comment: string, id: number, city: *, language: *,
   * alias: string, query: string}}
   */
  getFeedbackData = (selectedFeedbackOption: FeedbackDropdownItem, comment: string): FeedbackDataType => {
    const {location, query, isPositiveRatingSelected, id, alias} = this.props
    const {city, language} = location.payload

    const isTechnicalTopicsOptionSelected = selectedFeedbackOption.value === TECHNICAL_TOPICS_OPTION
    const isExtraOptionSelected = selectedFeedbackOption.feedbackType === EXTRA_FEEDBACK_TYPE
    const feedbackCity = !city || isTechnicalTopicsOptionSelected ? INTEGREAT_INSTANCE : city
    const feedbackLanguage = !language || isTechnicalTopicsOptionSelected ? DEFAULT_FEEDBACK_LANGUAGE : language
    const feedbackAlias = alias || (isExtraOptionSelected ? selectedFeedbackOption.value : '')

    return {
      feedbackType: selectedFeedbackOption.feedbackType,
      isPositiveRating: isPositiveRatingSelected,
      comment,
      id,
      city: feedbackCity,
      language: feedbackLanguage,
      alias: feedbackAlias,
      query
    }
  }

  onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => this.setState({comment: event.target.value})

  onFeedbackOptionChanged = (selectedDropdown: FeedbackDropdownItem) => {
    this.setState(prevState =>
      ({selectedFeedbackOption: prevState.feedbackOptions.find(option => option.value === selectedDropdown.value)})
    )
  }

  onSubmit = () => {
    const {selectedFeedbackOption, comment} = this.state
    FeedbackEndpoint.postData(this.getFeedbackData(selectedFeedbackOption, comment))
  }

  render () {
    const {location, isPositiveRatingSelected} = this.props
    return (
      <FeedbackBox onFeedbackOptionChanged={this.onFeedbackOptionChanged}
                   onCommentChanged={this.onCommentChanged}
                   onSubmit={this.onSubmit}
                   location={location}
                   isPositiveRatingSelected={isPositiveRatingSelected}
                   {...this.state} />
    )
  }
}

export default translate('feedback')(FeedbackBoxContainer)
