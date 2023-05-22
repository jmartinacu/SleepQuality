import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getQuestionnarieById } from '../api/ApiQuestionnaries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ConsensusSleepDiary from '../components/questionnaries/ConsensusSleepDiary'

const Questionnarie = ({ navigation, id }) => {
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState({})
  const [additionalInfo, setAdditionalInfo] = useState([])

  const [error, setError] = useState(false)

  useEffect(() => {
    getQuestionnarieById(id, AsyncStorage.getItem('AccessToken'))
      .then(result => {
        if (result.data.status === 200) {
          setError(false)
          setName(result.body.name)
          setQuestions(result.body.questions)
          setAdditionalInfo(result.body.additionalInformation)
        } else {
          setError(true)
          console.log(result.data.message)
        }
      })
      .catch(err => {
        setError(true)
        console.error(err)
      })
  }, [])

  return (
    <KeyboardAwareScrollView style={styles.container}>
      {error
        ? (
          <Text>An error ocurried. Refresh</Text>
          )
        : (
          <View>
            {name === 'Consensus Sleep Diary' && <ConsensusSleepDiary name={name} questions={questions} additionalInfo={additionalInfo} />}
          </View>
          )}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  }
})

export default Questionnarie
