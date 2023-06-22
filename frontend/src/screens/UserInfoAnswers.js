import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { getItemFromStorage } from '../utils/Utils'
import { userDoctorGetNewAccessToken } from '../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'
import { AIS, CSDM, CSDN, ESS, IRLS, ISI, PSQ, PSQI, SB } from '../assests/questionnarieLogo'

const UserInfoAnswers = ({ navigation, route }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isDoctor, setIsDoctor] = useState(null)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    getItemFromStorage('refreshToken', setRefreshToken).then()
    getItemFromStorage('isDoctor', setIsDoctor).then()
    if (accessToken !== null && refreshToken !== null && isDoctor !== null) {
      if (isDoctor === 'true') {
        userDoctorGetNewAccessToken(refreshToken)
          .then(result => {
            if (result.status === 200) {
              setAccessToken(result.data.accessToken)
              AsyncStorage.setItem('accessToken', result.data.accessToken)
            }
          })
      } else {
        navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
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
      <PreviewQuestionnaire answers logo={logo} navigation={navigation} id={item.id} name={item.name} idUser={route.params.idUser} />
    )
  }

  const renderEmptyList = () => {
    return (
      <Text style={{ color: 'white' }}>Loading...</Text>
    )
  }

  return (

    <View style={{ backgroundColor: '#191970', flex: 1 }}>
      {isDoctor === 'true' &&
        <View style={styles.container}>
          <Text style={styles.textHeaderFlatlist}>Press on a Questionnarie to check the Answers of {route.params.userName}:</Text>
          <FlatList
            data={route.params.questionnaires}
            renderItem={renderQuestionnaires}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={renderEmptyList}
          />
        </View>}
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191970'
  },
  textHeaderFlatlist: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    paddingTop: 50
  }
})

export default UserInfoAnswers
