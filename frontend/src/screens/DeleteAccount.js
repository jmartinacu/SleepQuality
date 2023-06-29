import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { doctorDeleteAccount, userDeleteAccount, userDoctorGetNewAccessToken, userGetNewAccessToken } from '../api/ApiUser'

import { Sheep } from '../assests/questionnarieLogo'
import { useEffect, useState } from 'react'
import { getItemFromStorage } from '../utils/Utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DeleteAccount = ({ navigation, route }) => {
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
            } else {
              navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
            }
          })
      } else if (isDoctor === 'true') {
        userDoctorGetNewAccessToken(refreshToken)
          .then(result => {
            if (result.status === 200) {
              setAccessToken(result.data.accessToken)
              AsyncStorage.setItem('accessToken', result.data.accessToken)
            } else {
              navigation.replace('TextAndButton', { text: 'Session Expired. Log in again', button: 'Go Login', direction: 'Login' })
            }
          })
      }
    }
  }, [accessToken, isDoctor])

  const handleDeleteAccount = () => {
    if (isDoctor === 'false') {
      userDeleteAccount(route.params.accessToken)
        .then(result => {
          if (result.status === 204) {
            navigation.replace('Login')
          }
        })
    } else if (isDoctor === 'true') {
      doctorDeleteAccount(route.params.accessToken)
        .then(result => {
          if (result.status === 204) {
            navigation.replace('Login')
          }
        })
    }
  }

  const handleDeleteAccountDoctor = () => {
    userDeleteAccount(route.params.accessToken)
      .then(result => {
        if (result.status === 204) {
          navigation.replace('Login')
        }
      })
  }

  return (
    <SafeAreaView style={styles.container1}>

      <View style={styles.container}>
        <Image
          source={Sheep}
          resizeMode='contain'
          style={styles.image}
        />
        <Text style={styles.text}>If you pressed this button you will never can get your account back. Are you sure you want to delete this account?</Text>

        <TouchableOpacity
          onPress={route.isDoctor === 'true' ? handleDeleteAccountDoctor : handleDeleteAccount}
          style={styles.button}
        >
          <Text style={styles.textSend}>Yes, I want to delete my account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#191970'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 50
  },

  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white'
  },

  wrapperInputWrong: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#FF7F50',
    marginTop: 10,
    alignItems: 'center'
  },

  input: {
    padding: 10,
    width: '100%',
    color: 'white',
    fontWeight: '400'
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

  text: {
    color: 'white',
    fontWeight: '600'
  },

  textFailed: {
    alignSelf: 'flex-end',
    color: '#FF7F50'
  },

  textSend: {
    color: '#191970',
    fontWeight: '700'
  },
  image: {
    height: 150,
    width: '100%',
    marginBottom: 20,
    marginTop: 50
  }

})

export default DeleteAccount
