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
import { userLogin } from '../../api/ApiUser'
import { Eye, EyeActive } from '../../assests/eyes'

const LoginForm = ({ navigation }) => {
  const [status, setStatus] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [seePassword, setSeePassword] = useState(true)
  const [checkValidEmail, setCheckValidEmail] = useState(false)

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
        email: email.toLocaleLowerCase(),
        password
      })
        .then(result => {
          if (result.status === 200) {
            console.log(result)
            setStatus('')
            AsyncStorage.setItem('accessToken', result.data.accessToken)
            AsyncStorage.setItem('refreshToken', result.data.refreshToken)
            navigation.replace('Home')
          } else {
            console.log(result)
            setStatus(result.message)
          }
        })
        .catch(err => {
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

      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={text => handleCheckEmail(text)}
        />
      </View>
      {checkValidEmail
        ? (
          <Text style={styles.textFailed}>Wrong format email</Text>
          )
        : (
          <Text style={styles.textFailed}> </Text>
          )}
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder='Password'
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
      {email === '' || password === '' || checkValidEmail === true
        ? (
          <TouchableOpacity
            disabled
            style={styles.buttonDisable}
            onPress={handleLogin}
          >
            <Text style={styles.textLogin}>Login</Text>
          </TouchableOpacity>
          )
        : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.textLogin}>Login</Text>
          </TouchableOpacity>
          )}
      {status !== '' &&
        <Text style={styles.textFailed}>{status}</Text>}

      <TouchableOpacity
        style={styles.forgotPass}
        onPress={handleRegister}
      >
        <Text style={styles.underline}>Don't have an account?</Text>
      </TouchableOpacity>

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
    borderColor: 'white',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    padding: 10,
    width: '100%',
    color: 'white',
    fontWeight: '400'
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
  }
})

export default LoginForm
