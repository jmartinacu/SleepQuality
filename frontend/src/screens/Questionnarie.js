import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { getQuestionnarieById } from '../api/ApiQuestionnaries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getItemFromStorage } from '../utils/Utils'
import ConsensusSleepDiary from '../components/typesQuestionnaries/ConsensusSleepDiary'
import StopBang from '../components/typesQuestionnaries/StopBang'
import EpworthSleepinessScale from '../components/typesQuestionnaries/EpworthSleepinessScale'
import PerceivedStress from '../components/typesQuestionnaries/PerceivedStress'
import AthensInsomniaScale from '../components/typesQuestionnaries/AthensInsomniaScale'
import InternationalRestlessLegsScale from '../components/typesQuestionnaries/InternationalRestlessLegsScale'

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
            {name === 'Epworth Sleepiness Scale' && <EpworthSleepinessScale id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}

            {name === 'Perceived Stress Questionnaire' && <PerceivedStress id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'Athens Insomnia Scale' && <AthensInsomniaScale id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'International Restless Legs Scale' && <InternationalRestlessLegsScale id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
            {name === 'Insomnia Severity Index' && <InternationalRestlessLegsScale id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} />}
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
