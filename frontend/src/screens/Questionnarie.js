import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { getQuestionnarieById } from '../api/ApiQuestionnaries'
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
  const [instructions, setInstructions] = useState('')
  const [desc1, setDesc1] = useState('')
  const [desc2, setDesc2] = useState('')

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
            setInstructions(result.data.instructions)
            if (result.data.name === 'Pittsburgh Sleep Quality Index') {
              setDesc1(result.data.additionalInformation[0].description)
              setDesc2(result.data.additionalInformation[4].description)
            }
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
            {name === 'Consensus Sleep Diary Night' && <ConsensusSleepDiary accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
            {name === 'Consensus Sleep Diary Morning' && <ConsensusSleepDiary accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
            {name === 'STOP-BANG' && <StopBang id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
            {name === 'Epworth Sleepiness Scale' && <PrimaryEnumQuestionnaire n={8} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
            {name === 'Pittsburgh Sleep Quality Index' && <PittsburghSleepQualityIndex accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} desc1={desc1} desc2={desc2} />}
            {name === 'Perceived Stress Questionnaire' && <PrimaryEnumQuestionnaire n={20} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
            {name === 'Athens Insomnia Scale' && <PrimaryEnumQuestionnaire n={8} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
            {name === 'International Restless Legs Scale' && <PrimaryEnumQuestionnaire n={10} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
            {name === 'Insomnia Severity Index' && <PrimaryEnumQuestionnaire n={7} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
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
