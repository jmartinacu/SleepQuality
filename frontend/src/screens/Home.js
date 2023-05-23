import { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { getQuestionnarieById } from '../api/ApiQuestionnaries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConsensusSleepDiary from '../components/typesQuestionnaries/ConsensusSleepDiary'
import { getItemFromStorage } from '../utils/Utils'

const Home = ({ navigation }) => {
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState({})
  const [additionalInfo, setAdditionalInfo] = useState([])

  const [error, setError] = useState(false)

  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    if (accessToken !== null) {
      getQuestionnarieById('646c7cfbe9d3b0045b061873', accessToken)
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
      <ConsensusSleepDiary accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />
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
