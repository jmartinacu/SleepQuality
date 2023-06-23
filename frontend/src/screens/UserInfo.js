import { useEffect, useState } from 'react'
import { FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, ScrollViewBase } from 'react-native'
import { getItemFromStorage } from '../utils/Utils'
import { doctorGetPatientById, userDoctorGetNewAccessToken } from '../api/ApiUser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doctorGetQuestionnaires } from '../api/ApiQuestionnaries'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'
import { AIS, CSDM, CSDN, ESS, IRLS, ISI, PSQ, PSQI, SB } from '../assests/questionnarieLogo'

const UserInfo = ({ navigation, route }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isDoctor, setIsDoctor] = useState(null)

  const [questionnaires, setQuestionnaires] = useState([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('NEUTER')
  const [birthDate, setBirthDate] = useState('')
  const [chronicDisorders, setChronicDisorders] = useState('')
  const [BMI, setBMI] = useState('')

  const [error, setError] = useState(false)

  const [showAdd, setShowAdd] = useState(false)

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
              doctorGetPatientById(result.data.accessToken, route.params.id)
                .then(resultP => {
                  if (resultP.status === 200) {
                    setError(false)
                    setName(resultP.data.name)
                    setEmail(resultP.data.email)
                    setGender(resultP.data.gender)
                    setHeight(resultP.data.height)
                    setWeight(resultP.data.weight)
                    setBMI(resultP.data.BMI)
                    setBirthDate(resultP.data.birth)
                    setChronicDisorders(resultP.data.chronicDisorders)
                    doctorGetQuestionnaires(result.data.accessToken)
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
                  } else {
                    setError(true)
                    console.log(resultP.data.message)
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
      <PreviewQuestionnaire assign logo={logo} navigation={navigation} id={item.id} name={item.name} accessToken={accessToken} idUser={route.params.id} />
    )
  }

  return (
    <View style={styles.container}>

      <View>
        {/* MODAL Add */}
        <Modal
          propagateSwipe
          animationType='slide'
          transparent
          visible={showAdd}
          onRequestClose={() => {
            setShowAdd(!showAdd)
          }}
        >
          {Platform.OS === 'web'
            ? (
              <ScrollView>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.textHeaderFlatlist}>Choose the Questionnarie that you want to assign to {name}:</Text>
                    <FlatList
                      data={questionnaires}
                      renderItem={renderQuestionnaires}
                      keyExtractor={(item, index) => index}
                    />
                    <Pressable
                      style={[styles.buttonModal, styles.buttonClose]}
                      onPress={() => setShowAdd(!showAdd)}
                    >
                      <Text style={styles.textStyle}>Hide Answers</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
              )
            : (
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.textHeaderFlatlist}>Choose the Questionnarie that you want to assign to {name}:</Text>
                  <FlatList
                    data={questionnaires}
                    renderItem={renderQuestionnaires}
                    keyExtractor={(item, index) => index}
                  />
                  <Pressable
                    style={[styles.buttonModal, styles.buttonClose]}
                    onPress={() => setShowAdd(!showAdd)}
                  >
                    <Text style={styles.textStyle}>Hide Answers</Text>
                  </Pressable>
                </View>
              </View>
              )}
        </Modal>
        <ScrollView>

          <View style={styles.subContainer}>
            <Text style={styles.textName}>{name}</Text>
            <Text style={styles.textTittle}>{email}</Text>
            <View style={styles.row}>
              <View style={styles.subSubContainer}>
                <Text style={styles.textSub}>Gender</Text>
                <Text style={styles.textData}>{gender}</Text>
              </View>
              <View style={styles.subSubContainer}>
                <Text style={styles.textSub}>Birth</Text>
                <Text style={styles.textData}>{birthDate.split('T')[0]}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.subSubContainer}>
                <Text style={styles.textSub}>Height</Text>
                <Text style={styles.textData}>{height} cm</Text>
              </View>
              <View style={styles.subSubContainer}>
                <Text style={styles.textSub}>BMI</Text>
                <Text style={styles.textData}>{BMI} Kg/m^2</Text>
              </View>
              <View style={styles.subSubContainer}>
                <Text style={styles.textSub}>Weight</Text>
                <Text style={styles.textData}>{weight} Kg</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.subSubContainer}>
                <Text style={styles.textSub}>Chronic Disorders</Text>
                <Text style={styles.textData}>{chronicDisorders !== '' ? chronicDisorders : 'No Chronic Disorders'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.push('UserInfoAnswers', { idUser: route.params.id, questionnaires, userName: name })}
            >
              <Text style={styles.textLogin}>Check Answers of the User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowAdd(true)}
            >
              <Text style={styles.textLogin}>Asign a new Questionnaire to the User</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191970'
  },
  subContainer: {
    borderColor: 'white',
    borderWidth: 0.5,
    padding: 40,
    margin: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center'
  },
  subSubContainer: {
    borderColor: 'white',
    borderWidth: Platform.OS === 'web' ? 0.5 : 0,
    padding: 40,
    margin: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-around',
    padding: 10
  },
  textName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 10,
    textDecorationLine: 'underline'
  },
  textTittle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20
  },
  textSub: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    textDecorationLine: 'underline'
  },
  textData: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 15
  },
  buttonModal: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 15
  },
  textLogin: {
    color: '#191970',
    fontWeight: '700'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: '#6495ed',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  modalTextQuiz: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700'
  },
  textHeaderFlatlist: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    paddingTop: 50
  }
})

export default UserInfo
