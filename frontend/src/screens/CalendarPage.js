import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { getItemFromStorage } from '../utils/Utils'
import { userGetNewAccessToken } from '../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getQuestionnaires } from '../api/ApiQuestionnaries'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'
import { AIS, CSDM, CSDN, ESS, IRLS, ISI, PSQ, PSQI, SB } from '../assests/questionnarieLogo'

const CalendarPage = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState([])

  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isDoctor, setIsDoctor] = useState(null)

  const [error, setError] = useState(false)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    getItemFromStorage('refreshToken', setRefreshToken).then()
    getItemFromStorage('isDoctor', setIsDoctor).then()
    if (accessToken !== null && refreshToken !== null && isDoctor !== null) {
      if (isDoctor === 'false') {
        userGetNewAccessToken(refreshToken)
          .then(result => {
            if (result.status === 200) {
              setAccessToken(result.data.accessToken)
              AsyncStorage.setItem('accessToken', result.data.accessToken)
              getQuestionnaires(result.data.accessToken)
                .then(resultQ => {
                  if (resultQ.status === 200) {
                    setError(false)
                    setQuestionnaires(resultQ.data)
                  } else {
                    setError(true)
                    console.log(resultQ.data.message)
                  }
                })
                .catch(err => {
                  setError(true)
                  console.error(err)
                })
            } else {
              navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
            }
          })
      }
    }
  }, [accessToken, isDoctor])

  const renderQuestionnaires = ({ index, item }) => {
    let logo = null
    switch (item.name) {
      case 'Consensus Sleep Diary Morning':
        logo = CSDM
        break
      case 'Consensus Sleep Diary Night':
        logo = CSDN
        break
      case 'STOP-BANG':
        logo = SB
        break
      case 'Epworth Sleepiness Scale':
        logo = ESS
        break
      case 'Pittsburgh Sleep Quality Index':
        logo = PSQI
        break
      case 'Perceived Stress Questionnaire':
        logo = PSQ
        break
      case 'Athens Insomnia Scale':
        logo = AIS
        break
      case 'International Restless Legs Scale':
        logo = IRLS
        break
      case 'Insomnia Severity Index':
        logo = ISI
        break
    }

    return (
      <PreviewQuestionnaire answers logo={logo} navigation={navigation} id={item.id} name={item.name} />
    )
  }

  const renderEmptyList = () => {
    return (
      <Text>Loading...</Text>
    )
  }

  return (

    <View style={styles.container}>
      <Text>Press on a Questionnarie to check your Answers:</Text>
      <FlatList
        data={questionnaires}
        renderItem={renderQuestionnaires}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={renderEmptyList}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191970'
  }
})

export default CalendarPage
