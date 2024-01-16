import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { PoiCategoryModel, PoiModelBuilder } from 'api-client'

import render from '../../testing/render'
import PoiFiltersModal from '../PoiFiltersModal'

jest.mock('styled-components')
jest.mock('react-i18next')
jest.mock('react-native-svg')

describe('PoiFiltersModal', () => {
  beforeEach(jest.clearAllMocks)

  const pois = new PoiModelBuilder(2).build()

  const closeModal = jest.fn()
  const setSelectedPoiCategory = jest.fn()
  const setCurrentlyOpenFilter = jest.fn()

  const renderPoiFiltersModal = ({
    category = null,
    currentlyOpen = false,
    poisCount = 0,
  }: {
    category?: PoiCategoryModel | null
    currentlyOpen?: boolean
    poisCount?: number
  }) =>
    render(
      <PoiFiltersModal
        modalVisible
        closeModal={closeModal}
        pois={pois}
        selectedPoiCategory={category}
        setSelectedPoiCategory={setSelectedPoiCategory}
        currentlyOpenFilter={currentlyOpen}
        setCurrentlyOpenFilter={setCurrentlyOpenFilter}
        poisCount={poisCount}
      />,
    )

  it('should set toggle open filter', () => {
    const { getByRole } = renderPoiFiltersModal({})

    fireEvent.press(getByRole('switch'))
    expect(setCurrentlyOpenFilter).toHaveBeenCalledTimes(1)
  })

  it('should set poi category on press', () => {
    const { getByText } = renderPoiFiltersModal({})

    fireEvent.press(getByText(pois[0]!.category.name))
    expect(setSelectedPoiCategory).toHaveBeenCalledTimes(1)
    expect(setSelectedPoiCategory).toHaveBeenCalledWith(pois[0]!.category)
  })

  it('should deselect poi category on selected poi category press', () => {
    const { getByText } = renderPoiFiltersModal({ category: pois[0]!.category })

    fireEvent.press(getByText(pois[0]!.category.name))
    expect(setSelectedPoiCategory).toHaveBeenCalledTimes(1)
    expect(setSelectedPoiCategory).toHaveBeenCalledWith(null)
  })

  it('should close modal on button press', () => {
    const { getByText } = renderPoiFiltersModal({ poisCount: 1 })

    fireEvent.press(getByText('showPois'))
    expect(closeModal).toHaveBeenCalledTimes(1)
  })

  it('should not close modal on button press', () => {
    const { getByText } = renderPoiFiltersModal({ poisCount: 0 })

    fireEvent.press(getByText('showPois'))
    expect(closeModal).not.toHaveBeenCalledTimes(1)
  })
})
