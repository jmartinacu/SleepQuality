import { useEffect, useState } from 'react'
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getItemFromStorage } from '../../utils/Utils'
import { doctorGetAnswersOfUserByQuestionnarieId, userDoctorGetNewAccessToken, userGetNewAccessToken } from '../../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAllCSVByQuestionnarie, getAnswers } from '../../api/ApiQuestionnaries'
import PreviewAnswer from './PreviewAnswer'

const AnswersList = ({ navigation, route }) => {
  const [answers, setAnswers] = useState([])
  const [algorithms, setAlgorithms] = useState([])

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
              getAnswers(result.data.accessToken, route.params.id)
                .then(resultQ => {
                  if (resultQ.status === 200) {
                    setAnswers(resultQ.data.answers)
                    setAlgorithms(resultQ.data.algorithms)
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
              doctorGetAnswersOfUserByQuestionnarieId(result.data.accessToken, route.params.idUser, route.params.id)
                .then(resultQ => {
                  if (resultQ.status === 200) {
                    setAnswers(resultQ.data.answers)
                    setAlgorithms(resultQ.data.algorithms)
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
      }
    }
  }, [accessToken, isDoctor])

  const handleExportCSV = () => {
    if (accessToken !== null) {
      if (Platform.OS === 'web') {
        getAllCSVByQuestionnarie(accessToken, route.params.name)
          .then(result => {
            const url = window.URL.createObjectURL(new Blob([result.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `SleepSheepData${route.params.name}.csv`)
            link.click()
          })
      } else {
        console.log('Feuture only for web')
      }
    }
  }

  const renderAnswer = ({ index, item }) => {
    return (
      <PreviewAnswer name={route.params.name} algorithms={algorithms[index]} answers={item.answers} date={item.createdAt} />

    )
  }

  const renderEmptyList = () => {
    return (
      <Text style={{ color: 'white' }}>There are no answers for this questionnarie yet</Text>
    )
  }

  return (
    <View style={styles.container}>
      <Image
        source={route.params.logo}
        style={styles.logo}
      />
      <Text style={styles.textTitle}>{route.params.name}</Text>

      {Platform.OS === 'web' &&
        <TouchableOpacity
          style={styles.button}
          onPress={handleExportCSV}
        >
          <Text style={styles.textCreate}>Export CSV of your {route.params.name}'s' data</Text>
        </TouchableOpacity>}
      <FlatList
        data={answers}
        renderItem={renderAnswer}
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
  },
  logo: {
    height: 100,
    width: 100
  },
  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30
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

export default AnswersList
