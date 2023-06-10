import { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import { Eye, EyeActive } from '../../assests/eyes'
import { userChangePass } from '../../api/ApiUser'

const PasswordChangeVerification = ({ navigation, email }) => {
  const [status, setStatus] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')

  const [seePassword, setSeePassword] = useState(true)
  const [seeConfirmedPassword, setSeeConfirmedPassword] = useState(true)

  const [checkValidCode, setCheckValidCode] = useState(false)
  const [checkValidPassword, setCheckValidPassword] = useState(false)
  const [checkValidConfirmedPassword, setCheckValidConfirmedPassword] = useState(false)

  const handleCheckCodeValidity = value => {
    const regex = /[0-9]{5}/
    setCode(value)
    if (regex.test(value)) {
      setCheckValidCode(false)
    } else {
      setCheckValidCode(true)
    }
  }

  const checkPasswordValidity = value => {
    const isNonWhiteSpace = /^\S*$/
    const isContainsUppercase = /^(?=.*[A-Z]).*$/
    const isContainsLowercase = /^(?=.*[a-z]).*$/
    const isContainsNumber = /^(?=.*[0-9]).*$/
    const isValidLength = /^.{8,15}$/
    const isContainsSymbol = /^(?=.*[~`!@#$%^&*€()--+={}[\]|\\:;"'<>,.?/_₹]).*$/
    const isContainsComma = /,/

    if (isContainsComma.test(value)) {
      return 'Password must not contain Commas.'
    }

    if (!isNonWhiteSpace.test(value)) {
      return 'Password must not contain Whitespaces.'
    }

    if (!isContainsUppercase.test(value)) {
      return 'Password must have at least one Uppercase Character.'
    }

    if (!isContainsLowercase.test(value)) {
      return 'Password must have at least one Lowercase Character.'
    }

    if (!isContainsNumber.test(value)) {
      return 'Password must contain at least one Digit.'
    }

    if (!isValidLength.test(value)) {
      return 'Password must be 8-15 Characters Long.'
    }

    if (!isContainsSymbol.test(value)) {
      return 'Password must contain at least one Special Symbol.'
    }

    return null
  }

  const handleCheckPasswordValidity = value => {
    setPassword(value)
    const isNonWhiteSpace = /^\S*$/
    const isContainsUppercase = /^(?=.*[A-Z]).*$/
    const isContainsLowercase = /^(?=.*[a-z]).*$/
    const isContainsNumber = /^(?=.*[0-9]).*$/
    const isValidLength = /^.{8,15}$/
    const isContainsSymbol = /^(?=.*[~`!@#$%^&*€()--+={}[\]|\\:;"'<>,.?/_₹]).*$/
    const isContainsComma = /,/

    if (!isNonWhiteSpace.test(value) || !isContainsUppercase.test(value) || !isContainsLowercase.test(value) ||
              !isContainsNumber.test(value) || !isValidLength.test(value) || !isValidLength.test(value) ||
               !isContainsSymbol.test(value) || isContainsComma.test(value)) {
      setCheckValidPassword(true)
    } else {
      setCheckValidPassword(false)
    }

    if (value !== confirmedPassword && confirmedPassword !== '') {
      setCheckValidConfirmedPassword(true)
    } else {
      setCheckValidConfirmedPassword(false)
    }
  }

  const handleCheckConfirmedPasswordValidity = value => {
    setConfirmedPassword(value)
    if (password === value) {
      setCheckValidConfirmedPassword(false)
    } else {
      setCheckValidConfirmedPassword(true)
    }
  }

  const handleVerification = () => {
    if (!checkValidPassword && !checkValidCode) {
      userChangePass({
        email,
        password
      }, code)
        .then(result => {
          if (result.status === 200) {
            setStatus('')
            navigation.replace('TextAndButton', { text: 'Password Successfully Changed', button: 'Go Login', direction: 'Login' })
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
      <Text style={styles.text}>
        Introduce the 5 Digits Code that you received:
      </Text>
      {checkValidCode
        ? (
          <View>
            <View style={styles.wrapperInputWrong}>
              <TextInput
                style={styles.input}
                placeholder='XXXXX'
                inputMode='numeric'
                keyboardType='number-pad'
                value={code}
                onChangeText={value => handleCheckCodeValidity(value)}
                returnKeyType='done'
                maxLength={5}
              />
            </View>
            <Text style={styles.textFailed}>Code must have 5 digits</Text>
          </View>
          )
        : (
          <View>
            <View style={styles.wrapperInput}>
              <TextInput
                style={styles.input}
                placeholder='XXXXX'
                inputMode='numeric'
                keyboardType='number-pad'
                value={code}
                onChangeText={value => handleCheckCodeValidity(value)}
                returnKeyType='done'
                maxLength={5}
              />
            </View>
            <Text style={styles.textFailed}> </Text>
          </View>
          )}
      <Text style={styles.text}>
        Introduce your new Password
      </Text>
      {/* INPUT PASSWORD */}
      {checkValidPassword
        ? (
          <View>
            <View style={styles.wrapperInputWrong}>
              <Text style={styles.floatingLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                secureTextEntry={seePassword}
                onChangeText={text => handleCheckPasswordValidity(text)}
                returnKeyType='done'
                maxLength={15}
              />
              <TouchableOpacity
                style={styles.wrapperIcon}
                onPress={() => setSeePassword(!seePassword)}
              >
                <Image source={seePassword ? Eye : EyeActive} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.textFailed}>{checkPasswordValidity(password)}</Text>
          </View>
          )
        : (
          <View>
            <View style={styles.wrapperInput}>
              <Text style={styles.floatingLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                secureTextEntry={seePassword}
                onChangeText={text => handleCheckPasswordValidity(text)}
                returnKeyType='done'
                maxLength={15}
              />
              <TouchableOpacity
                style={styles.wrapperIcon}
                onPress={() => setSeePassword(!seePassword)}
              >
                <Image source={seePassword ? Eye : EyeActive} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
          )}

      {/* INPUT CONFIRM PASSWORD */}
      {checkValidConfirmedPassword
        ? (
          <View>
            <View style={styles.wrapperInputWrong}>
              <Text style={styles.floatingLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmedPassword}
                secureTextEntry={seeConfirmedPassword}
                onChangeText={text => handleCheckConfirmedPasswordValidity(text)}
                returnKeyType='done'
                maxLength={15}
              />
              <TouchableOpacity
                style={styles.wrapperIcon}
                onPress={() => setSeeConfirmedPassword(!seeConfirmedPassword)}
              >
                <Image source={seeConfirmedPassword ? Eye : EyeActive} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.textFailed}>Passwords must coincide</Text>
          </View>
          )
        : (
          <View>
            <View style={styles.wrapperInput}>
              <Text style={styles.floatingLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmedPassword}
                secureTextEntry={seeConfirmedPassword}
                onChangeText={text => handleCheckConfirmedPasswordValidity(text)}
                returnKeyType='done'
                maxLength={15}
              />
              <TouchableOpacity
                style={styles.wrapperIcon}
                onPress={() => setSeeConfirmedPassword(!seeConfirmedPassword)}
              >
                <Image source={seeConfirmedPassword ? Eye : EyeActive} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
          )}
      {code === '' || password === '' || confirmedPassword === '' || checkValidCode || checkValidPassword || checkValidConfirmedPassword
        ? (
          <TouchableOpacity
            disabled
            style={styles.buttonDisable}
            onPress={handleVerification}
          >
            <Text style={styles.textSend}>Change Password</Text>
          </TouchableOpacity>
          )
        : (
          <TouchableOpacity style={styles.button} onPress={handleVerification}>
            <Text style={styles.textSend}>Change Password</Text>
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
    marginTop: 10,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
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

  wrapperIcon: {
    position: 'absolute',
    right: 0,
    padding: 10
  },

  icon: {
    width: 30,
    height: 24
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
  }
})

export default PasswordChangeVerification
