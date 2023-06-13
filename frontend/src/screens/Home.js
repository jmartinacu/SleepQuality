import { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, TextInput, FlatList } from 'react-native'
import { getQuestionnaires } from '../api/ApiQuestionnaries'
import { getItemFromStorage } from '../utils/Utils'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'
import { CSDN, CSDM, AIS, ESS, IRLS, ISI, PSQ, PSQI, SB } from '../assests/questionnarieLogo'
import { userCreateDoctor, userGetNewAccessToken, userIsAdmin } from '../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState([])
  const [email, setEmail] = useState('')
  const [checkValidEmail, setCheckValidEmail] = useState(false)

  const [error, setError] = useState(false)

  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    getItemFromStorage('refreshToken', setRefreshToken).then()
    if (accessToken !== null && refreshToken !== null) {
      userGetNewAccessToken(refreshToken)
        .then(result => {
          if (result.status === 200) {
            setAccessToken(result.data.accessToken)
            AsyncStorage.setItem('accessToken', result.data.accessToken)
            userIsAdmin(result.data.accessToken)
              .then(resultA => {
                if (resultA.status === 200) {
                  setIsAdmin(true)
                } else {
                  setIsAdmin(false)
                  getQuestionnaires(result.data.accessToken)
                    .then(resultQ => {
                      if (resultQ.status === 200) {
                        setError(false)
                        setQuestionnaires(resultQ.data)
                      } else {
                        setError(true)
                        console.log(resultQ.data.message)
                      }
                    })
                    .catch(err => {
                      setError(true)
                      console.error(err)
                    })
                }
              })
          } else {
            navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
          }
        })
    }
  }, [accessToken])

  const handleCheckEmail = text => {
    const re = /\S+@\S+\.\S+/
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im

    setEmail(text)
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false)
    } else {
      setCheckValidEmail(true)
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
      <PreviewQuestionnaire logo={logo} navigation={navigation} id={item.id} name={item.name} />
    )
  }

  const renderEmptyList = () => {
    return (
      <Text>Loading...</Text>
    )
  }

  const handleCreateDoctor = () => {
    if (email !== '') {
      userCreateDoctor(accessToken, email)
        .then(result => {
          if (result.status === 200) {
            navigation.replace('TextAndButton', { text: `Doctor ${email} has been correctly approved`, button: 'Go Home', direction: 'Home' })
          }
        })
    }
  }

  return (
    <View style={styles.tabBarStyle}>
      {isAdmin &&
        <View>
          <Text>Introduce an email to make the user a doctor:</Text>
          {checkValidEmail
            ? (
              <View>
                <View style={styles.wrapperInputWrong}>
                  <Text style={styles.floatingLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    inputMode='email'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={text => handleCheckEmail(text)}
                    returnKeyType='done'
                    maxLength={40}
                  />
                </View>
                <Text style={styles.textFailed}>Wrong format email</Text>
              </View>
              )
            : (
              <View>
                <View style={styles.wrapperInput}>
                  <Text style={styles.floatingLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    inputMode='email'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={text => handleCheckEmail(text)}
                    returnKeyType='done'
                    maxLength={40}
                  />
                </View>
                <Text style={styles.textFailed}> </Text>
              </View>
              )}
          <TouchableOpacity
            onPress={handleCreateDoctor}

          >
            <Text>Create Doctor</Text>
          </TouchableOpacity>
        </View>}
      <FlatList
        data={questionnaires}
        renderItem={renderQuestionnaires}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191970'
  },

  proffileImage: {
    height: 40,
    width: 40
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 25
  },
  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 25
  },
  textCreate: {
    color: '#191970',
    fontWeight: '700'
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'white',
    marginTop: 10,
    alignItems: 'center',
    height: 50
  },

  wrapperInputWrong: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'red',
    marginTop: 10,
    alignItems: 'center',
    height: 50
  },
  input: {
    padding: 10,
    width: '100%',
    color: 'white',
    fontWeight: '400',
    height: 50
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 10,
    paddingHorizontal: 5,
    backgroundColor: '#191970',
    color: 'white',
    fontSize: 12
  },

  wrapperIcon: {
    position: 'absolute',
    right: 0,
    padding: 10
  },
  icon: {
    width: 30,
    height: 24
  },
  text: {
    color: 'white',
    fontWeight: '700'
  },
  textFailed: {
    alignSelf: 'flex-end',
    color: '#FF7F50'
  },
  activeButton: {
    color: 'white'
  }
})

export default Home
