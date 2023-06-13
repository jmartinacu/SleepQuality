import { useEffect, useState } from 'react'
import { View, StyleSheet, Button, TouchableOpacity, Image, Text } from 'react-native'
import { b64toBlob, getItemFromStorage } from '../utils/Utils'
import { userAddProffilePic, userGetProffilePic, userGetUserData } from '../api/ApiUser'
import { EmptyProffile } from '../assests/perfil'
import * as ImagePicker from 'expo-image-picker'
import RegisterForm from '../components/users/RegisterForm'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Proffile = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState(null)
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
    if (accessToken !== null) {
      userGetUserData(accessToken)
        .then(result => {
          console.log(result)
          if (result.status === 200) {
            setName(result.data.name)
            setEmail(result.data.email)
            setHeight(result.data.height)
            setWeight(result.data.weight)
            setGender(result.data.gender)
            setBirthDate(result.data.birth)
            setChronicDisorders(result.data.chronicDisorders)
            setBMI(result.data.BMI)
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
  }, [accessToken, name])

  const handleLogOut = () => {
    AsyncStorage.removeItem('accessToken')
    AsyncStorage.removeItem('refreshToken')
    navigation.replace('Login')
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

      {error || name === ''
        ? (
          <Text style={{ color: 'white' }}>Loading...</Text>
          )
        : (
          <View style={styles.container}>

            <TouchableOpacity
              onPress={handleAddPic}
              activeOpacity={0.5}
            >
              <Image
                source={image}
                style={styles.proffileImage}
              />
            </TouchableOpacity>
            <Text>{name}</Text>
            <Text>{email}</Text>
            <Text>{birthDate.split('T')[0]}</Text>
            <Text>{BMI} kg/m^2</Text>

            <RegisterForm navigation={navigation} update heightU={height} weightU={weight} genderU={gender} chronicDisordersU={chronicDisorders} token={accessToken} />

            <Button
              onPress={handleLogOut}
              title='Log out'
            />
            <TouchableOpacity
              onPress={() => navigation.push('DeleteAccount', { accessToken })}
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
  }
})

export default Proffile
