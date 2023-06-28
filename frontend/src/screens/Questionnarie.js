import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { getQuestionnarieById } from '../api/ApiQuestionnaries'
import { getItemFromStorage } from '../utils/Utils'

import ConsensusSleepDiary from '../components/typesQuestionnaries/ConsensusSleepDiary'
import StopBang from '../components/typesQuestionnaries/StopBang'
import PrimaryEnumQuestionnaire from '../components/typesQuestionnaries/PrimaryEnumQuestionnaire'
import PittsburghSleepQualityIndex from '../components/typesQuestionnaries/PittsburghSleepQualityIndex'
import { userGetNewAccessToken } from '../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Questionnarie = ({ navigation, route }) => {
  const [name, setName] = useState('')
  const [questions, setQuestions] = useState({})
  const [additionalInfo, setAdditionalInfo] = useState([])
  const [instructions, setInstructions] = useState('')
  const [desc1, setDesc1] = useState('')
  const [desc2, setDesc2] = useState('')

  const [error, setError] = useState(false)

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
              getQuestionnarieById(route.params.id, accessToken)
                .then(resultQ => {
                  if (resultQ.status === 200) {
                    setError(false)
                    setName(resultQ.data.name)
                    setQuestions(resultQ.data.questions)
                    setAdditionalInfo(resultQ.data.additionalInformation)
                    setInstructions(resultQ.data.instructions)
                    if (resultQ.data.name === 'Pittsburgh Sleep Quality Index') {
                      setDesc1(resultQ.data.additionalInformation[0].description)
                      setDesc2(resultQ.data.additionalInformation[4].description)
                    }
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
  }, [accessToken, instructions, isDoctor])

  return (

    <SafeAreaView style={styles.container}>
      {error
        ? (
          <Text style={styles.errorMessage}>An error occurred. Please refresh the page.</Text>
          )
        : (
          <View>
            {instructions === []
              ? (
                <Text style={styles.errorMessage}>Loading...</Text>
                )
              : (
                <View style={styles.questionnaire}>
                  {name === 'Consensus Sleep Diary Night' && <ConsensusSleepDiary logo={route.params.logo} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                  {name === 'Consensus Sleep Diary Morning' && <ConsensusSleepDiary logo={route.params.logo} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                  {name === 'STOP-BANG' && <StopBang n={8} logo={route.params.logo} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                  {name === 'Epworth Sleepiness Scale' && <PrimaryEnumQuestionnaire logo={route.params.logo} n={8} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                  {name === 'Pittsburgh Sleep Quality Index' && <PittsburghSleepQualityIndex logo={route.params.logo} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} desc1={desc1} desc2={desc2} />}
                  {name === 'Perceived Stress Questionnaire' && <PrimaryEnumQuestionnaire logo={route.params.logo} n={20} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                  {name === 'Athens Insomnia Scale' && <PrimaryEnumQuestionnaire logo={route.params.logo} n={8} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                  {name === 'International Restless Legs Scale' && <PrimaryEnumQuestionnaire logo={route.params.logo} n={10} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                  {name === 'Insomnia Severity Index' && <PrimaryEnumQuestionnaire logo={route.params.logo} n={7} id={route.params.id} accessToken={accessToken} navigation={navigation} name={name} questions={questions} additionalInfo={additionalInfo} instructions={instructions} />}
                </View>
                )}
          </View>

          )}
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#191970'
  },
  questionnaire: {
    marginTop: 50
  },
  errorMessage: {
    color: 'white',
    alignItems: 'center',
    fontSize: 18
  }

})

export default Questionnarie
