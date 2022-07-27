import {
  CategoriesRouteType,
  CityNotCooperatingRouteType,
  DashboardRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  JpalTrackingRouteType,
  LandingRouteType,
  LicenseRouteType,
  LocalNewsType,
  NewsRouteType,
  OffersRouteType,
  PoisRouteType,
  SearchRouteType,
  ShelterRouteType,
  SprungbrettOfferRouteType,
  TuNewsType,
} from '.'

type ParamsType = {
  cityCode: string
  languageCode: string
}
export type LandingRouteInformationType = {
  route: LandingRouteType
  languageCode: string
}
export type CityNotCooperatingInformationType = {
  route: CityNotCooperatingRouteType
  languageCode: string
}

export type JpalTrackingRouteInformationType = {
  route: JpalTrackingRouteType
  trackingCode: string | null
}
export type CategoriesRouteInformationType = ParamsType & {
  route: DashboardRouteType | CategoriesRouteType
  cityContentPath: string
}
export type NewsRouteInformationType = ParamsType & {
  // Two levels of ids: news type and news id
  route: NewsRouteType
  newsType: LocalNewsType | TuNewsType
  newsId?: string
}
export type SimpleCityContentFeatureType = ParamsType & {
  // Routes without customizable ids, e.g. '/augsburg/de/disclaimer/
  route: DisclaimerRouteType | OffersRouteType | SprungbrettOfferRouteType | SearchRouteType
}
export type IdCityContentFeatureType = ParamsType & {
  route: ShelterRouteType
  id?: string
}
export type EventsPoisRouteInformationType = ParamsType & {
  // Routes with customizable ids, e.g. '/augsburg/de/pois/1234/
  route: EventsRouteType | PoisRouteType
  cityContentPath?: string
  urlSlug?: string
}

export type LicenseRouteInformationType = {
  route: LicenseRouteType
}

export type NonNullableRouteInformationType =
  | LandingRouteInformationType
  | CityNotCooperatingInformationType
  | JpalTrackingRouteInformationType
  | CategoriesRouteInformationType
  | NewsRouteInformationType
  | SimpleCityContentFeatureType
  | EventsPoisRouteInformationType
  | IdCityContentFeatureType
  | LicenseRouteInformationType

export type RouteInformationType = NonNullableRouteInformationType | null
