import { useEffect, useState } from 'react'
import { View, StyleSheet, Button, TouchableOpacity, Image, Text } from 'react-native'
import { b64toBlob, getItemFromStorage } from '../utils/Utils'
import { userAddProffilePic, userDoctorGetNewAccessToken, userGetDoctorData, userGetNewAccessToken, userGetProffilePic, userGetUserData } from '../api/ApiUser'
import { EmptyProffile } from '../assests/perfil'
import * as ImagePicker from 'expo-image-picker'
import RegisterForm from '../components/users/RegisterForm'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Proffile = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [isDoctor, setIsDoctor] = useState(null)

  const [image, setImage] = useState(EmptyProffile)
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
            console.log(result)
            if (result.status === 200) {
              setAccessToken(result.data.accessToken)
              AsyncStorage.setItem('accessToken', result.data.accessToken)
              userGetUserData(accessToken)
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

              userGetProffilePic(accessToken)
                .then(result => {
                  if (result.status === 200) {
                    // setImage(result.data.base64)
                  }
                })
            }
          })
      }
    }
  }, [accessToken, name, isDoctor])

  const handleLogOut = () => {
    navigation.replace('Login')
    AsyncStorage.removeItem('accessToken')
    AsyncStorage.removeItem('refreshToken')
    AsyncStorage.removeItem('isDoctor')
  }

  const handleAddPic = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      const [imageInfo, imageBase64] = result.assets[0].uri.split(',')
      const [dataAndContentType] = imageInfo.split(';')
      const [, contentType] = dataAndContentType.split(':')
      console.log({ imageInfo, imageBase64, contentType })
      const blobImage = b64toBlob(imageBase64, contentType)
      const file = new global.File(blobImage, new Date() + '_profile', {
        type: contentType
      })
      console.log(blobImage.type)
      console.log(blobImage.size)
      const formData = new FormData()
      formData.append('profilePicture', {
        name: new Date() + '_profile',
        uri: file,
        type: contentType
      })

      userAddProffilePic(formData, accessToken)
        .then(res => {
          console.log(res)
        })
    }
  }

  return (

    <View style={styles.container}>

      {error || name === '' || isDoctor === null
        ? (
          <Text style={{ color: 'white' }}>Loading...</Text>
          )
        : (
          <View style={styles.container}>

            {isDoctor === 'true'
              ? (
                <Text style={styles.textTitle}>Doctor</Text>
                )
              : (
                <TouchableOpacity
                  onPress={handleAddPic}
                  activeOpacity={0.5}
                >
                  <Image
                    source={image}
                    style={styles.proffileImage}
                  />
                </TouchableOpacity>
                )}

            <Text>{name}</Text>
            <Text>{email}</Text>
            {typeof birthDate === 'string' && <Text>{birthDate.split('T')[0]}</Text>}
            {isDoctor === 'false' && <Text>{BMI} kg/m^2</Text>}
            {isDoctor === 'false' && <RegisterForm navigation={navigation} update heightU={height} weightU={weight} genderU={gender} chronicDisordersU={chronicDisorders} token={accessToken} />}

            <Button
              onPress={handleLogOut}
              title='Log out'
            />
            <TouchableOpacity
              onPress={() => navigation.push('DeleteAccount', { accessToken, isDoctor })}
            >
              <Text>Delete account</Text>
            </TouchableOpacity>
          </View>
          )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#191970'
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
    fontSize: 30
  }
})

export default Proffile
