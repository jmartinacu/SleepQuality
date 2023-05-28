import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { getQuestionnarieById } from '../api/ApiQuestionnaries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getItemFromStorage } from '../utils/Utils'
import ConsensusSleepDiary from '../components/typesQuestionnaries/ConsensusSleepDiary'
import StopBang from '../components/typesQuestionnaries/StopBang'

import PrimaryEnumQuestionnaire from '../components/typesQuestionnaries/PrimaryEnumQuestionnaire'
import PittsburghSleepQualityIndex from '../components/typesQuestionnaries/PittsburghSleepQualityIndex'

const Questionnarie = ({ navigation, route }) => {
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState({})
  const [additionalInfo, setAdditionalInfo] = useState([])

  const [error, setError] = useState(false)

  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    if (accessToken !== null) {
      getQuestionnarieById(route.params.id, accessToken)
        .then(result => {
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

    <SafeAreaView style={styles.container}>
      {error
        ? (
          <Text>An error ocurried. Refresh</Text>
          )
        : (
          <View>
            {name === 'Consensus Sleep Diary' && <ConsensusSleepDiary accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'STOP-BANG' && <StopBang id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'Epworth Sleepiness Scale' && <PrimaryEnumQuestionnaire n={8} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'Pittsburgh Sleep Quality Index' && <PittsburghSleepQualityIndex accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'Perceived Stress Questionnaire' && <PrimaryEnumQuestionnaire n={20} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'Athens Insomnia Scale' && <PrimaryEnumQuestionnaire n={8} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'International Restless Legs Scale' && <PrimaryEnumQuestionnaire n={10} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'Insomnia Severity Index' && <PrimaryEnumQuestionnaire n={7} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
          </View>
          )}
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    textAlign: 'center'
  }
})

export default Questionnarie
