// @flow

import loadLocales from '../loadLocales'
import malteOverrideLocales from '../__mocks__/malte-locales.json'
import buildConfig from '../../app/constants/buildConfig'

jest.mock(
  '../../../../locales/locales.json',
  () => require('../__mocks__/locales.json')
)
jest.mock('../../app/constants/buildConfig')

describe('loadLocales', () => {
  it('should correctly transform locales', () => {
    expect(loadLocales()).toMatchSnapshot()
  })

  it('should correctly merge and transform locales', () => {
    const previousBuildConfig = buildConfig()
    buildConfig.mockImplementation(() => ({ ...previousBuildConfig, localesOverride: malteOverrideLocales }))
    expect(loadLocales()).toMatchSnapshot()
  })
})
