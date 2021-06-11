import React, { ReactNode } from 'react'
import { Description, StyledFeedbackBox } from './FeedbackBox'
import ModalHeader from './ModalHeader'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import buildConfig from '../constants/buildConfig'

type PropsType = {
  closeFeedbackModal: () => void
  t: TFunction
}

export class FeedbackThanksMessage extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { closeFeedbackModal, t } = this.props
    return (
      <StyledFeedbackBox>
        <ModalHeader t={t} closeFeedbackModal={closeFeedbackModal} title={t('feedbackSent')} />
        <Description>
          {t('thanksMessage', {
            appName: buildConfig().appName
          })}
        </Description>
      </StyledFeedbackBox>
    )
  }
}

export default withTranslation('feedback')(FeedbackThanksMessage)
