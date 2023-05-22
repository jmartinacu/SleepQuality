import { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { getQuestionnarieById } from '../api/ApiQuestionnaries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConsensusSleepDiary from '../components/typesQuestionnaries/ConsensusSleepDiary'

const Home = ({ navigation }) => {
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState({})
  const [additionalInfo, setAdditionalInfo] = useState([])

  const [error, setError] = useState(false)

  const [accessToken, setAccessToken] = useState(null)

  const getItemFromStorage = async () => {
    try {
      await AsyncStorage.getItem('accessToken', (error, result) => {
        if (result) {
          setAccessToken(result)
        } else {
          console.log(JSON.stringfy(error))
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getItemFromStorage().then()
    if (accessToken !== null) {
      getQuestionnarieById('64622c5020a7d02abbfc957b', accessToken)
        .then(result => {
          console.log(accessToken)
          console.log(result)
          if (result.status === 200) {
            setError(false)
            setName(result.data.name)
            setQuestions(result.data.questions)
            setAdditionalInfo(result.data.additionalInformation)
          } else {
            setError(true)
            console.log(result.data.message)
          }
        })
        .catch(err => {
          setError(true)
          console.error(err)
        })
    }
  }, [accessToken])

  return (
    <View style={styles.tabBarStyle}>
      <ConsensusSleepDiary name={name} questions={questions} additionalInfo={additionalInfo} />
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flex: 1,
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  proffileImage: {
    height: 40,
    width: 40
  }
})

export default Home
