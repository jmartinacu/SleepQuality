import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { userLogin, userLoginDoctor } from '../../api/ApiUser'
import { Eye, EyeActive } from '../../assests/eyes'

const LoginForm = ({ navigation }) => {
  const [status, setStatus] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [seePassword, setSeePassword] = useState(true)
  const [checkValidEmail, setCheckValidEmail] = useState(false)
  const [doctorView, setDoctorView] = useState(false)

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

  const checkPasswordValidity = value => {
    const isNonWhiteSpace = /^\S*$/
    if (!isNonWhiteSpace.test(value)) {
      return 'Password must not contain Whitespaces.'
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/
    if (!isContainsUppercase.test(value)) {
      return 'Password must have at least one Uppercase Character.'
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/
    if (!isContainsLowercase.test(value)) {
      return 'Password must have at least one Lowercase Character.'
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/
    if (!isContainsNumber.test(value)) {
      return 'Password must contain at least one Digit.'
    }

    const isValidLength = /^.{8,15}$/
    if (!isValidLength.test(value)) {
      return 'Password must be 8-15 Characters Long.'
    }

    const isContainsSymbol =
    /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>.?/_₹]).*$/
    if (!isContainsSymbol.test(value)) {
      return 'Password must contain at least one Special Symbol.'
    }

    const isContainsComma = /,/
    if (isContainsComma.test(value)) {
      return 'Password must not contain Commas.'
    }

    return null
  }

  const handleLogin = () => {
    const checkPassword = checkPasswordValidity(password)
    if (!checkPassword) {
      userLogin({
        email: email.toLocaleLowerCase().trim(),
        password
      })
        .then(result => {
          if (result.status === 200) {
            setStatus('')
            AsyncStorage.setItem('accessToken', result.data.accessToken)
            AsyncStorage.setItem('refreshToken', result.data.refreshToken)
            AsyncStorage.setItem('isDoctor', 'false')
            navigation.replace('Home')
          } else {
            console.log(result)
            setStatus(result.message)
          }
        })
        .catch(err => {
          setStatus('Conection error. Please reload the website')
          console.error(err)
        })
    } else {
      console.error(checkPassword)
      setStatus('Email or password wrong')
    }
  }

  const handleLoginDoctor = () => {
    const checkPassword = checkPasswordValidity(password)
    if (!checkPassword) {
      userLoginDoctor({
        email: email.toLocaleLowerCase().trim(),
        password
      })
        .then(result => {
          if (result.status === 200) {
            setStatus('')
            AsyncStorage.setItem('accessToken', result.data.accessToken)
            AsyncStorage.setItem('refreshToken', result.data.refreshToken)
            AsyncStorage.setItem('isDoctor', 'true')
            navigation.replace('Home')
          } else {
            console.log(result)
            setStatus(result.data.message)
          }
        })
        .catch(err => {
          setStatus('Conection error. Please reload the website')
          console.error(err)
        })
    } else {
      console.error(checkPassword)
      setStatus('Email or password wrong')
    }
  }

  const handleRegister = () => {
    navigation.push('SignUp')
  }

  const handlePasswordForgotten = () => {
    navigation.push('EmailVerification', { mode: 'Password' })
  }

  return (
    <View style={styles.container}>
      {doctorView && <Text style={styles.textTitle}>Doctor Login</Text>}
      {!doctorView && <Text style={styles.textTitle}>Patient Login</Text>}
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
      <View style={[styles.wrapperInput, password === '' ? styles.invalidInput : null]}>
        <Text style={styles.floatingLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          secureTextEntry={seePassword}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.wrapperIcon}
          onPress={() => setSeePassword(!seePassword)}
        >
          <Image source={seePassword ? Eye : EyeActive} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPass}
        onPress={handlePasswordForgotten}
      >
        <Text style={styles.underline}>Forgot password?</Text>
      </TouchableOpacity>

      {(email === '' || password === '' || checkValidEmail)
        ? (
          <TouchableOpacity
            disabled
            style={styles.buttonDisable}
            onPress={handleLogin}
          >
            {doctorView && <Text style={styles.textLogin}>Login as a Doctor</Text>}
            {!doctorView && <Text style={styles.textLogin}>Login as a Patient</Text>}
          </TouchableOpacity>
          )
        : (
          <TouchableOpacity
            style={styles.button}
            onPress={doctorView ? handleLoginDoctor : handleLogin}
          >
            {doctorView && <Text style={styles.textLogin}>Login as a Doctor</Text>}
            {!doctorView && <Text style={styles.textLogin}>Login as a Patient</Text>}
          </TouchableOpacity>
          )}
      {status !== '' && <Text style={styles.textFailed}>{status}</Text>}
      <TouchableOpacity
        style={styles.forgotPass}
        onPress={handleRegister}
      >
        <Text style={styles.underline}>Don't have an account?</Text>
      </TouchableOpacity>
      {doctorView
        ? (
          <TouchableOpacity
            style={styles.forgotPass}
            onPress={() => setDoctorView(!doctorView)}
          >
            <Text style={styles.underline}>Are you a patient?</Text>
          </TouchableOpacity>
          )
        : (
          <TouchableOpacity
            style={styles.forgotPass}
            onPress={() => setDoctorView(!doctorView)}
          >
            <Text style={styles.underline}>Are you a doctor?</Text>
          </TouchableOpacity>
          )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20
  },

  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    marginTop: 10,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },

  wrapperInputWrong: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#FF7F50',
    marginTop: 10
  },

  invalidInput: {
    borderColor: 'white'
  },

  input: {
    padding: 10,
    flex: 1,
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

  wrapperIcon: {
    position: 'absolute',
    right: 0,
    padding: 10
  },

  icon: {
    width: 30,
    height: 24
  },

  forgotPass: {
    alignSelf: 'flex-end',
    padding: 10,
    flexDirection: 'row'
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
    fontWeight: '300'
  },

  textLogin: {
    color: '#191970',
    fontWeight: '700'
  },

  textFailed: {
    alignSelf: 'flex-end',
    color: '#FF7F50'
  },

  underline: {
    textDecorationLine: 'underline',
    color: 'white'
  },
  textTitle: {
    marginTop: 15,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default LoginForm
