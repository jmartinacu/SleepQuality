import { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native'
import { userForgotPass } from '../../api/ApiUser'

const ForgotPasswordVerification = ({ navigation }) => {
  const [status, setStatus] = useState('')
  const [email, setEmail] = useState('')
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

  const handleVerification = () => {
    if (!checkValidEmail) {
      userForgotPass({
        email: email.toLocaleLowerCase()
      })
        .then(result => {
          console.log(result)
          if (result.status === 200) {
            setStatus('')
            navigation.replace('EmailVerification', { mode: 'ChangePass', email })
          } else {
            setStatus(result.data.message)
          }
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      console.err('Wrong Email Format')
    }
  }

  return (
    <View style={styles.container}>
      <Text>
        Did tou forget your Password?
      </Text>
      <Text>
        Introduce your email and we will send you and email with a code:
      </Text>
      {checkValidEmail
        ? (
          <View>
            <View style={styles.wrapperInputWrong}>
              <TextInput
                style={styles.input}
                placeholder='Email'
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
              <TextInput
                style={styles.input}
                placeholder='Email'
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
      {email === '' || checkValidEmail
        ? (
          <TouchableOpacity
            disabled
            style={styles.buttonDisable}
            onPress={handleVerification}
          >
            <Text style={styles.text}>Send me an email</Text>
          </TouchableOpacity>
          )
        : (
          <TouchableOpacity style={styles.button} onPress={handleVerification}>
            <Text style={styles.text}>Send me an email</Text>
          </TouchableOpacity>
          )}
      {status !== '' &&
        <Text style={styles.textFailed}>{status}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 50
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
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
    width: '100%'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    borderRadius: 5,
    marginTop: 25
  },
  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    marginTop: 25
  },
  text: {
    color: 'white',
    fontWeight: '700'
  },
  textFailed: {
    alignSelf: 'flex-end',
    color: 'red'
  }
})

export default ForgotPasswordVerification