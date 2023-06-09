import { useEffect, useState } from 'react'
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getItemFromStorage } from '../utils/Utils'
import { userDoctorGetNewAccessToken, userGetNewAccessToken } from '../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAllCSV, getAllQuestionnaires } from '../api/ApiQuestionnaries'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'
import { AIS, CSDM, CSDN, ESS, IRLS, ISI, PSQ, PSQI, SB } from '../assests/questionnarieLogo'

const CalendarPage = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState([])

  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isDoctor, setIsDoctor] = useState(null)

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
              getAllQuestionnaires(result.data.accessToken)
                .then(resultQ => {
                  if (resultQ.status === 200) {
                    setQuestionnaires(resultQ.data)
                  } else {
                    console.log(resultQ.data.message)
                  }
                })
                .catch(err => {
                  console.error(err)
                })
            } else {
              navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
            }
          })
      } else if (isDoctor === 'true') {
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

  const handleExportCSV = () => {
    if (accessToken !== null) {
      if (Platform.OS === 'web') {
        getAllCSV(accessToken)
          .then(result => {
            const url = window.URL.createObjectURL(new Blob([result.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'SleepSheepData.csv')
            link.click()
          })
      } else {
        console.log('Feuture only for web')
      }
    }
  }

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
      <Text style={{ color: 'white' }}>Loading...</Text>
    )
  }

  return (

    <View style={{ backgroundColor: '#191970', flex: 1 }}>
      {isDoctor === 'true' &&
        <Text style={styles.textHeaderFlatlist}>This is a feature only for patients. Please go back</Text>}
      {isDoctor === 'false' &&

        <View style={styles.container}>
          {Platform.OS === 'web' &&
            <TouchableOpacity
              style={styles.button}
              onPress={handleExportCSV}
            >
              <Text style={styles.textCreate}>Export CSV of ALL your data</Text>
            </TouchableOpacity>}
          <Text style={styles.textHeaderFlatlist}>Press on a Questionnarie to check your Answers:</Text>
          <FlatList
            data={questionnaires}
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
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 25
  },
  textCreate: {
    color: '#191970',
    fontWeight: '700'
  }
})

export default CalendarPage
