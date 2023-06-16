import { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { getItemFromStorage } from '../../utils/Utils'
import { userGetNewAccessToken } from '../../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAnswers } from '../../api/ApiQuestionnaries'
import PreviewAnswer from './PreviewAnswer'

const AnswersList = ({ navigation, route }) => {
  const [answers, setAnswers] = useState([])
  const [algorithms, setAlgorithms] = useState([])

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
              getAnswers(result.data.accessToken, route.params.id)
                .then(resultQ => {
                  if (resultQ.status === 200) {
                    setError(false)
                    setAnswers(resultQ.data.answers)
                    setAlgorithms(resultQ.data.algorithms)
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

  const renderAnswer = ({ index, item }) => {
    return (
      <PreviewAnswer name={route.params.name} algorithms={algorithms[index]} answers={item.answers} date={item.createdAt} />

    )
  }

  const renderEmptyList = () => {
    return (
      <Text>There are no answers for this questionnarie yet</Text>
    )
  }

  return (
    <View style={styles.container}>
      <Image
        source={route.params.logo}
        style={styles.logo}
      />
      <Text style={styles.textTitle}>{route.params.name}</Text>
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
  }
})

export default AnswersList
