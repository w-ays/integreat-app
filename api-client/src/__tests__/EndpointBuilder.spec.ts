import EndpointBuilder from '../EndpointBuilder'

describe('EndpointBuilder', () => {
  it('should produce the correct endpoint', () => {
    const url = 'https://someurl'
    const name = 'endpoint'

    const mapper = (json: string) => json

    const responseOverride = {
      test: 'random',
    }
    const errorOverride = new Error('Error No. 5')

    const mapParamsToUrl = () => url

    const endpoint = new EndpointBuilder(name)
      .withParamsToUrlMapper(mapParamsToUrl)
      .withMapper(mapper)
      .withResponseOverride(responseOverride)
      .withErrorOverride(errorOverride)
      .build()
    expect(endpoint.mapParamsToUrl).toBe(mapParamsToUrl)
    expect(endpoint.stateName).toBe(name)
    expect(endpoint.mapResponse).toBe(mapper)
    expect(endpoint.responseOverride).toBe(responseOverride)
    expect(endpoint.errorOverride).toBe(errorOverride)
  })
  it('should throw errors if used incorrectly', () => {
    const builder = new EndpointBuilder('endpoint')
    expect(() => builder.build()).toThrow('You have to set a url mapper to build an endpoint!')
    builder.withParamsToUrlMapper(() => 'https://someurl')
    expect(() => builder.build()).toThrow('You have to set a mapper to build an endpoint!')
    builder.withMapper(json => json)
    expect(() => builder.build()).not.toThrow()
  })
})
