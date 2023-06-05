import { useEffect, useState } from 'react'
import { View, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import { getItemFromStorage } from '../utils/Utils'
import { userAddProffilePic, userGetProffilePic } from '../api/ApiUser'
import { launchImageLibrary } from 'react-native-image-picker'

const Proffile = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [image, setImage] = useState('../public/PERFIL-VACIO.png')

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

  const handdleAddPic = () => {
    launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false
    })
      .then(result => {
        console.log(result)
        if (!result.didCancel && result.assets !== []) {
          const url = result.assets[0].uri
          console.log(url)
          const formData = new FormData()
          formData.append('profilePicture', url)
          userAddProffilePic({ formData }, accessToken)
            .then(res => {
              console.log(result)
              if (res.status === 200) {
                setImage(result.assets)
              } else if (res.status === 401) {
                // Token Expired
              } else if (res.status === 400) {
                // Bad Image
              }
            })
        }
      })
  }

  return (

    <View style={styles.container}>

      <TouchableOpacity
        onPress={handdleAddPic}
        activeOpacity={0.5}
      >
        <Image
          source={require('../public/PERFIL-VACIO.png')}
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
