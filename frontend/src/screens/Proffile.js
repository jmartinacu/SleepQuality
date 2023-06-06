import { useEffect, useState } from 'react'
import { View, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import { DataURIToBlob, getItemFromStorage } from '../utils/Utils'
import { userAddProffilePic, userGetProffilePic } from '../api/ApiUser'
import { EmptyProffile } from '../assests/perfil'
import * as ImagePicker from 'expo-image-picker'

const Proffile = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [image, setImage] = useState(EmptyProffile)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    if (accessToken !== null) {
      userGetProffilePic(accessToken)
        .then(result => {
          if (result.status === 200) {
            setImage(result.data)
          }
        })
    }
  }, [])

  const handleAddPic = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      const imgBase64 = result.assets[0].uri
      const file = DataURIToBlob(imgBase64)
      const formData = new FormData()
      formData.append('profilePicture', file)

      userAddProffilePic(formData, accessToken)
        .then(res => {
          console.log(res)
        })
    }
  }

  return (

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

      <Button
        onPress={() => navigation.push('Login')}
        title='Log out'
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
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
