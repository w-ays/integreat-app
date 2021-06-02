import * as React from 'react'
import { Text } from 'react-native'
import { SprungbrettJobModel } from 'api-client'
import ListItem from '../../../components/ListItem'
import { ThemeType } from 'build-configs'

type PropsType = {
  job: SprungbrettJobModel
  openJobInBrowser: () => void
  theme: ThemeType
  language: string
}

class SprungbrettListItem extends React.PureComponent<PropsType> {
  render() {
    const { language, job, openJobInBrowser, theme } = this.props
    return (
      <ListItem thumbnail={null} title={job.title} navigateTo={openJobInBrowser} theme={theme} language={language}>
        <Text>{job.location}</Text>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
