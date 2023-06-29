import { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { getItemFromStorage } from '../utils/Utils'
import { userDoctorGetNewAccessToken, userGetDoctorData, userGetNewAccessToken, userGetUserData } from '../api/ApiUser'
import RegisterForm from '../components/users/RegisterForm'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Proffile = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isDoctor, setIsDoctor] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('NEUTER')
  const [birthDate, setBirthDate] = useState(new Date(1598051730000))
  const [chronicDisorders, setChronicDisorders] = useState('')
  const [BMI, setBMI] = useState('')
  const [error, setError] = useState(false)

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
              userGetDoctorData(result.data.accessToken)
                .then(resultData => {
                  if (resultData.status === 200) {
                    setName(resultData.data.name)
                    setEmail(resultData.data.email)
                    setHeight(resultData.data.height)
                    setWeight(resultData.data.weight)
                    setGender(resultData.data.gender)
                    setBirthDate(resultData.data.birth)
                  } else {
                    setError(true)
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
              userGetUserData(result.data.accessToken)
                .then(resultData => {
                  if (resultData.status === 200) {
                    setName(resultData.data.name)
                    setEmail(resultData.data.email)
                    setHeight(resultData.data.height)
                    setWeight(resultData.data.weight)
                    setGender(resultData.data.gender)
                    setBirthDate(resultData.data.birth)
                    setChronicDisorders(resultData.data.chronicDisorders)
                    setBMI(resultData.data.BMI)
                  } else {
                    setError(true)
                  }
                })
            } else {
              navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
            }
          })
      }
    }
  }, [accessToken, name, isDoctor, gender])

  const handleLogOut = () => {
    navigation.replace('Login')
    AsyncStorage.removeItem('accessToken')
    AsyncStorage.removeItem('refreshToken')
    AsyncStorage.removeItem('isDoctor')
  }

  // const handleAddPic = async () => {
  //   // No permissions request is necessary for launching the image library
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //     base64: true
  //   })

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri)
  //     const [imageInfo, imageBase64] = result.assets[0].uri.split(',')
  //     const [dataAndContentType] = imageInfo.split(';')
  //     const [, contentType] = dataAndContentType.split(':')
  //     console.log({ imageInfo, imageBase64, contentType })
  //     const blobImage = b64toBlob(imageBase64, contentType)
  //     const file = new global.File(blobImage, new Date() + '_profile', {
  //       type: contentType
  //     })
  //     console.log(blobImage.type)
  //     console.log(blobImage.size)
  //     const formData = new FormData()
  //     formData.append('profilePicture', {
  //       name: new Date() + '_profile',
  //       uri: file,
  //       type: contentType
  //     })

  //     userAddProffilePic(formData, accessToken)
  //       .then(res => {
  //         console.log(res)
  //       })
  //   }
  // }

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container1}>

        {error || name === '' || isDoctor === null || height === ''
          ? (
            <Text style={{ color: 'white' }}>Loading...</Text>
            )
          : (
            <View>
              <View style={{ alignItems: 'center', marginBottom: 25, marginTop: 20 }}>
                {isDoctor === 'true'
                  ? (
                    <Text style={styles.textTitle}>Doctor Proffile</Text>
                    )
                  : (
                    <Text style={styles.textTitle}>Patient Proffile</Text>
                    )}
                <View style={{ alignItems: 'center', marginBottom: 60 }}>
                  <Text style={styles.textName}>{name}</Text>
                  <Text style={styles.subText}>{email}</Text>
                  {isDoctor === 'true' && typeof birthDate === 'string' && <Text style={styles.subText}>{birthDate.split('T')[0].split('-')[0]}</Text>}
                  {isDoctor === 'false' && typeof birthDate === 'string' && <Text style={styles.subText}>{birthDate.split('T')[0]}</Text>}
                  {isDoctor === 'false' && <Text style={styles.subText}>BMI: {BMI} kg/m^2</Text>}
                </View>
              </View>
              {isDoctor === 'false' &&
                <ScrollView>

                  <RegisterForm
                    navigation={navigation} update heightU={height} weightU={weight} genderU={gender} chronicDisordersU={chronicDisorders} token={accessToken}
                  />
                </ScrollView>}

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogOut}
              >
                <Text style={styles.textLogin}>Log out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotPass}
                onPress={() => navigation.push('DeleteAccount', { accessToken, isDoctor })}
              >
                <Text style={styles.underline}>Delete account</Text>
              </TouchableOpacity>
            </View>
            )}
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191970'
  },
  container: {
    flex: 1,
    backgroundColor: '#191970',
    alignItems: 'center',
    marginBottom: 0
  },
  tabBarStyle: {
    flex: 1,
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  proffileImage: {
    height: 100,
    width: 100
  },
  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 10,
    textDecorationLine: 'underline'
  },
  textName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25
  },
  forgotPass: {
    alignSelf: 'center',
    padding: 10,
    flexDirection: 'row'
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'white'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5
  },
  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5
  },
  textLogin: {
    color: '#191970',
    fontWeight: '700'
  },
  subText: {
    color: 'white',
    fontSize: 15,
    padding: 5
  }
})

export default Proffile
