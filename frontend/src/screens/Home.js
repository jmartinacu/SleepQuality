import { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, FlatList, Dimensions } from 'react-native'
import { getAnswers, getConsensusMorning, getQuestionnaires } from '../api/ApiQuestionnaries'
import { getItemFromStorage, handleAnswersToGraphicByNQuestion } from '../utils/Utils'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'
import { CSDN, CSDM, AIS, ESS, IRLS, ISI, PSQ, PSQI, SB } from '../assests/questionnarieLogo'
import { doctorGetPatients, userAddUserToDoctor, userCreateDoctor, userDoctorGetNewAccessToken, userGetNewAccessToken, userIsAdmin } from '../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PreviewPatient from '../components/users/PreviewPatient'
import { EmptyProffile } from '../assests/perfil'
import { BarChart } from 'react-native-chart-kit'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Home = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState([])
  const [patients, setPatients] = useState([])
  const [answers, setAnswers] = useState([])
  const [tableData, setTableData] = useState([])

  const [email, setEmail] = useState('')
  const [checkValidEmail, setCheckValidEmail] = useState(false)

  const [error, setError] = useState(false)
  const [errorCreateDoctor, setErrorCreateDoctor] = useState('')

  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDoctor, setIsDoctor] = useState(null)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    getItemFromStorage('refreshToken', setRefreshToken).then()
    getItemFromStorage('isDoctor', setIsDoctor).then()
    if (accessToken !== null && refreshToken !== null && isDoctor !== null) {
      if (isDoctor === 'true') {
        userDoctorGetNewAccessToken(refreshToken)
          .then(result => {
            if (result.status === 200) {
              setAccessToken(result.data.accessToken)
              AsyncStorage.setItem('accessToken', result.data.accessToken)
              doctorGetPatients(result.data.accessToken)
                .then(resultP => {
                  if (resultP.status === 200) {
                    setPatients(resultP.data)
                  }
                })
            } else {
              navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
            }
          })
      } else if (isDoctor === 'false') {
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
                    getConsensusMorning(result.data.accessToken)
                      .then(resultQ => {
                        if (resultQ.status === 200) {
                          setAnswers(resultQ.data)
                          let data = [
                            Array.from(handleAnswersToGraphicByNQuestion(resultQ.data, 0).values()),
                            Array.from(handleAnswersToGraphicByNQuestion(resultQ.data, 5).values()),
                            Array.from(handleAnswersToGraphicByNQuestion(resultQ.data, 9).values())
                          ]

                          data = [
                            [data[0][0], data[1][0], data[2][0]],
                            [data[0][1], data[1][1], data[2][1]],
                            [data[0][2], data[1][2], data[2][2]],
                            [data[0][3], data[1][3], data[2][3]],
                            [data[0][4], data[1][4], data[2][4]],
                            [data[0][5], data[1][5], data[2][5]],
                            [data[0][6], data[1][6], data[2][6]]]
                          setTableData(data)
                        } else {
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
    }
  }, [accessToken, isAdmin, isDoctor])

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
      <PreviewQuestionnaire fill logo={logo} navigation={navigation} id={item.id} name={item.name} />
    )
  }

  const renderPatients = ({ index, item }) => {
    let profPic = item.profPic
    if (profPic === undefined) {
      profPic = EmptyProffile
    } else {
      profPic = item.profPic
    }
    return (
      <PreviewPatient profPic={profPic} navigation={navigation} id={item.id} name={item.name} email={item.email} />
    )
  }

  const renderEmptyPatientsList = () => {
    return (
      <Text style={styles.text}>You have no patients yet</Text>
    )
  }

  const renderEmptyQuestionnaireList = () => {
    return (
      <Text style={styles.text}>You have no questionnaires to do yet</Text>
    )
  }

  const handleCreateDoctor = () => {
    if (email !== '') {
      userCreateDoctor(accessToken, email)
        .then(result => {
          if (result.status === 201) {
            navigation.replace('TextAndButton', { text: `Doctor ${email} has been correctly approved`, button: 'Go Home', direction: 'Home' })
          } else if (result.status === 404) {
            setErrorCreateDoctor('User not found or already a doctor')
          }
        })
    }
  }

  const handleAddUserToDoctor = () => {
    if (email !== '') {
      userAddUserToDoctor(accessToken, email)
        .then(result => {
          if (result.status === 200) {
            navigation.replace('TextAndButton', { text: `An email request has correctly been sent to User ${email}. When the request gets accepted, you will be able to access to the patient's data `, button: 'Go Home', direction: 'Home' })
          } else if (result.status === 404) {
            setErrorCreateDoctor('User not found or already a patient')
          }
        })
    }
  }

  const tableHead = ['', 'Get into bed', 'Final Awakening', 'Get out of bed']

  return (
    <View style={styles.tabBarStyle}>

      {!isAdmin && isDoctor === 'false' && tableData !== [] &&
        <View>
          <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 1 }}>
              <Row data={tableHead} flexArr={[1, 1, 1, 1]} style={styles.head} textStyle={styles.textTable} />
              <TableWrapper style={styles.wrapper}>
                <Col data={Array.from(handleAnswersToGraphicByNQuestion(answers, 0).keys())} style={styles.title} heightArr={[28, 28]} textStyle={styles.textTable} />
                <Rows data={tableData} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.textTable} />
              </TableWrapper>
            </Table>
            <Text style={styles.textHeaderFlatlist}>Fill In the Available Questionnaires:</Text>
            <FlatList
              data={questionnaires}
              renderItem={renderQuestionnaires}
              keyExtractor={(item, index) => index}
              ListEmptyComponent={renderEmptyQuestionnaireList}
            />
          </View>
          {/* <View>
              <Text style={styles.textTitle}>Duration of Awakenings</Text>
              <BarChart
                data={{
                  labels: Array.from(handleAnswersToGraphicByNQuestion(answers, 2).keys()),
                  datasets: [
                    {
                      data: Array.from(handleAnswersToGraphicByNQuestion(answers, 2).values())
                    }
                  ],
                  legend: ['Duration of Awakenings']
                }}
                width={Dimensions.get('window').width - 25} // from react-native
                height={220}
                yAxisSuffix=' min'
                yAxisInterval={10} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientFrom: '#fb8c00',
                  backgroundGradientTo: '#ffa726',
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726'
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
            </View> */}
        </View>}
      <View>
        <View>
          <KeyboardAwareScrollView>

            {(isAdmin || isDoctor === 'true') &&
              <View>
                {isAdmin && <Text style={styles.textTitle}>Admin</Text>}
                {isAdmin && <Text style={styles.textHeaderFlatlist}>Introduce an email to make the user a doctor:</Text>}
                {isDoctor === 'true' && <Text style={styles.textTitle}>Doctor</Text>}
                {isDoctor === 'true' && <Text style={styles.textHeaderFlatlist}>Introduce an email to add the user to your patients list:</Text>}
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
                {!checkValidEmail && email !== ''
                  ? (
                    <TouchableOpacity
                      onPress={isDoctor === 'true' ? handleAddUserToDoctor : handleCreateDoctor}
                      style={styles.button}
                    >
                      {isDoctor === 'false' && <Text style={styles.textCreate}>Create Doctor</Text>}
                      {isDoctor === 'true' && <Text style={styles.textCreate}>Add User to List of Patients</Text>}

                    </TouchableOpacity>
                    )
                  : (
                    <TouchableOpacity
                      onPress={handleCreateDoctor}
                      style={styles.buttonDisable}
                    >
                      {isDoctor === 'false' && <Text style={styles.textCreate}>Create Doctor</Text>}
                      {isDoctor === 'true' && <Text style={styles.textCreate}>Add User to List of Patients</Text>}
                    </TouchableOpacity>
                    )}
                <Text style={styles.textFailed}>{errorCreateDoctor}</Text>
              </View>}
          </KeyboardAwareScrollView>

          {isDoctor === 'true' &&
            <View style={styles.container}>
              <Text style={styles.textHeaderFlatlist2}>Patients List</Text>
              <FlatList
                data={patients}
                renderItem={renderPatients}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={renderEmptyPatientsList}
              />
            </View>}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: '#191970'
  },
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
    textAlign: 'center'
  },
  textFailed: {
    alignSelf: 'flex-end',
    color: '#FF7F50'
  },
  activeButton: {
    color: 'white'
  },
  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30
  },
  container: { flex: 1, padding: 16, paddingTop: 30, marginBottom: 30, width: Dimensions.get('window').width - 25 },
  head: { height: 40, backgroundColor: '#FF7F50', borderTopRightRadius: 16, borderTopLeftRadius: 16 },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#FF7F50' },
  row: { height: 28 },
  textTable: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700'
  },
  textHeaderFlatlist: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    paddingTop: 50
  },
  textHeaderFlatlist2: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700'
  }
})

export default Home
