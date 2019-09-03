// @flow

import { DateModel, EventModel, LocationModel } from '@integreat-app/integreat-api-client'
import { runSaga } from 'redux-saga'
import DefaultDataContainer from '../../DefaultDataContainer'
import loadEvents from '../loadEvents'
import moment from 'moment-timezone'

jest.mock('rn-fetch-blob')
jest.mock('@integreat-app/integreat-api-client/endpoints/createEventsEndpoint',
  () => () => {
    const { EventModel, EndpointBuilder, DateModel, LocationModel } = require('@integreat-app/integreat-api-client')
    const moment = require('moment-timezone')

    return new EndpointBuilder('events-mock')
      .withParamsToUrlMapper(() => 'https://cms.integreat-app.de/events')
      .withResponseOverride([new EventModel({
        id: 1,
        path: '/augsburg/en/events/first_event',
        title: 'first Event',
        availableLanguages: new Map(
          [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
        date: new DateModel({
          startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
          endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
          allDay: true
        }),
        location: new LocationModel({
          address: 'address',
          town: 'town',
          postcode: 'postcode'
        }),
        excerpt: 'excerpt',
        lastUpdate: moment('2016-01-07 10:36:24'),
        content: 'content',
        thumbnail: 'thumbnail'
      })])
      .withMapper(() => { })
      .build()
  }
)

describe('loadEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const oldEvents = [
    new EventModel({
      id: 2,
      path: '/augsburg/en/events/second_event',
      title: 'second Event',
      availableLanguages: new Map(
        [['en', '/augsburg/de/events/zwotes_event'], ['ar', '/augsburg/ar/events/zwotes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      content: 'content',
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumbnail'
    })
  ]

  const newEvents = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: 'postcode'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      content: 'content',
      thumbnail: 'thumbnail'
    })
  ]
  const city = 'augsburg'
  const language = 'de'

  it('should fetch and set cities if cities are not available', async () => {
    const dataContainer = new DefaultDataContainer()
    const setEvents = jest.fn()
    dataContainer.setEvents = setEvents
    const result = await runSaga({}, loadEvents, city, language, dataContainer, false).toPromise()

    expect(result).toStrictEqual(newEvents)
    expect(setEvents).toHaveBeenCalledTimes(1)
    expect(setEvents).toHaveBeenCalledWith(city, language, newEvents)
  })

  it('should fetch and set cities if it should update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setEvents(city, language, oldEvents)
    const setEvents = jest.fn()
    dataContainer.setEvents = setEvents
    const result = await runSaga({}, loadEvents, city, language, dataContainer, true).toPromise()

    expect(result).toStrictEqual(newEvents)
    expect(setEvents).toHaveBeenCalledTimes(1)
    expect(setEvents).toHaveBeenCalledWith(city, language, newEvents)
  })

  it('should use cached cities if cities are available and it should not update', async () => {
    const dataContainer = new DefaultDataContainer()
    await dataContainer.setEvents(city, language, oldEvents)
    const setEvents = jest.fn()
    dataContainer.setEvents = setEvents
    const result = await runSaga({}, loadEvents, city, language, dataContainer, false).toPromise()

    expect(result).toStrictEqual(oldEvents)
    expect(setEvents).not.toHaveBeenCalled()
  })
})
