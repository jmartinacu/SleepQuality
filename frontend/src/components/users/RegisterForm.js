import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Button } from 'react-native'
import { userLogin, userRegister } from '../../api/ApiUser'
import { Eye, EyeActive } from '../../assests/eyes'
import { Input } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'

const RegisterForm = ({ navigation }) => {
  const [status, setStatus] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')

  const [birthDate, setBirthDate] = useState(new Date(1598051730000))
  const [gender, setGender] = useState('MASCULINE')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [chronicDisorders, setChronicDisorders] = useState('')

  const [seePassword, setSeePassword] = useState(true)
  const [seeConfirmedPassword, setSeeConfirmedPassword] = useState(true)

  const [checkValidName, setCheckValidName] = useState(false)
  const [checkValidEmail, setCheckValidEmail] = useState(false)
  const [checkValidPassword, setCheckValidPassword] = useState(false)
  const [checkValidConfirmedPassword, setCheckValidConfirmedPassword] = useState(false)
  const [checkValidHeight, setCheckValidHeight] = useState(false)
  const [checkValidWeight, setCheckValidWeight] = useState(false)
  const [checkValidBirthdate, setCheckValidBirthdate] = useState(false)

  const [show, setShow] = useState(false)

  // VALIDATION
  const handleCheckName = text => {
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u

    setName(text)
    if (regex.test(text)) {
      setCheckValidName(false)
    } else {
      setCheckValidName(true)
    }
  }

  const handleCheckEmail = text => {
    const re = /\S+@\S+\.\S+/
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im

    setEmail(text)
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false)
    } else {
      setCheckValidEmail(true)
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

  const handleCheckHeightValidity = value => {
    setHeight(value)
    if (value >= 0 && value <= 300) {
      setCheckValidHeight(false)
    } else {
      setCheckValidHeight(true)
    }
  }

  const handleCheckWeightValidity = value => {
    setWeight(value)
    if (value >= 0 && value <= 600) {
      setCheckValidWeight(false)
    } else {
      setCheckValidWeight(true)
    }
  }

  const handleCheckBirthdateValidity = value => {
    setBirthDate(value)
    if (value < new Date(Date.now())) {
      setCheckValidBirthdate(false)
    } else {
      setCheckValidBirthdate(true)
    }
  }

  // DATEPICKER
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)
    setBirthDate(currentDate)
  }

  const showDatepicker = () => {
    setShow(true)
  }

  // API
  const handleRegister = () => {
    const checkPassowrd = checkPasswordValidity(password)
    if (!checkPassowrd) {
      userRegister({
        email: email.toLocaleLowerCase(),
        name,
        gender,
        height,
        weight,
        birth: birthDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        chronicDisorders: chronicDisorders === '' ? null : chronicDisorders,
        password
      })
        .then(result => {
          if (result.status === 201) {
            setStatus('')
            navigation.replace('EmailVerification', { mode: 'Register' })
          } else {
            setStatus(result.data.message)
          }
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      console.err(checkPassowrd)
    }
  }

  return (
    <View style={styles.container}>

      {/* INPUT NAME */}
      {checkValidName
        ? (
          <View>
            <View style={styles.wrapperInputWrong}>
              <TextInput
                style={styles.input}
                placeholder='Name Lastname'
                value={name}
                onChangeText={text => handleCheckName(text)}
                returnKeyType='done'
                maxLength={40}
              />
            </View>
            <Text style={styles.textFailed}>Name can not contain Numbers or Symbols</Text>
          </View>
          )
        : (
          <View>
            <View style={styles.wrapperInput}>
              <TextInput
                style={styles.input}
                placeholder='Name'
                value={name}
                onChangeText={text => handleCheckName(text)}
                returnKeyType='done'
                maxLength={40}
              />
            </View>
          </View>

          )}

      {/* INPUT EMAIL */}
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

      {/* INPUT PASSWORD */}
      {checkValidPassword
        ? (
          <View>
            <View style={styles.wrapperInputWrong}>
              <TextInput
                style={styles.input}
                placeholder='Password'
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
              <TextInput
                style={styles.input}
                placeholder='Password'
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
              <TextInput
                style={styles.input}
                placeholder='Confirm Password'
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
              <TextInput
                style={styles.input}
                placeholder='Confirm Password'
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

      {/* HORIZONTAL LINE */}
      <View
        style={{
          marginTop: 20,
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth
        }}
      />

      <View style={styles.wrapperInputRow}>

        {/* INPUT HEIGHT */}
        {checkValidHeight
          ? (
            <View style={styles.wrapperInputWrong}>
              <TextInput
                style={styles.input}
                inputMode='numeric'
                keyboardType='numeric'
                placeholder='Height'
                value={height}
                onChangeText={text => handleCheckHeightValidity(text)}
                returnKeyType='done'
                maxLength={3}
              />
            </View>
            )
          : (
            <View style={styles.wrapperInput}>
              <TextInput
                style={styles.input}
                inputMode='numeric'
                keyboardType='numeric'
                placeholder='Height'
                value={height}
                onChangeText={text => handleCheckHeightValidity(text)}
                returnKeyType='done'
                maxLength={3}
              />
            </View>
            )}

        {/* INPUT WEIGHT */}
        {checkValidWeight
          ? (
            <View style={styles.wrapperInputWrong}>
              <TextInput
                style={styles.input}
                inputMode='numeric'
                keyboardType='numeric'
                placeholder='Weight'
                value={weight}
                onChangeText={text => handleCheckWeightValidity(text)}
                returnKeyType='done'
                maxLength={3}
              />
            </View>
            )
          : (
            <View style={styles.wrapperInput}>
              <TextInput
                style={styles.input}
                inputMode='numeric'
                keyboardType='numeric'
                placeholder='Weight'
                value={weight}
                onChangeText={text => handleCheckWeightValidity(text)}
                returnKeyType='done'
                maxLength={3}
              />
            </View>
            )}

        {/* INPUT BIRTHDATE */}
        <View style={styles.birthdate}>
          <Text style={styles.input}>Introduce your birhdate:</Text>
          {!(Platform.OS === 'ios') &&
            <Button
              onPress={showDatepicker}
              title={birthDate.toLocaleDateString()}
            />}
          {show && !(Platform.OS === 'ios') &&
            <DateTimePicker
              testID='dateTimePicker'
              value={birthDate}
              mode='date'
              is24Hour
              onChange={onChange}
              maximumDate={new Date(Date.now())}
            />}
          {Platform.OS === 'ios' &&
            <DateTimePicker
              testID='dateTimePicker'
              value={birthDate}
              mode='date'
              is24Hour
              onChange={(event, selectedDate) => handleCheckBirthdateValidity(selectedDate)}
              maximumDate={new Date(Date.now())}
            />}
        </View>
      </View>

      {/* ERROR MESSAGES HEIGHT AND WEIGHT VALIDATION */}
      {checkValidWeight &&
        (
          <Text style={styles.textFailed}>Weight must be bigger than 0 and less than 600kg</Text>
        )}
      {checkValidHeight &&
        (
          <Text style={styles.textFailed}>Height must be bigger than 0 and less than 300cm</Text>
        )}

      {/* HORIZONTAL LINE */}
      <View
        style={{
          marginTop: 20,
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth
        }}
      />

      {/* INPUT GENDER */}
      <View>
        <Text style={styles.input}>Introduce your gender:</Text>
        <View style={!(Platform.OS === 'ios') ? styles.picker : null}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            prompt='Gender'
            mode='dropdown'
          >
            <Picker.Item
              label='Male'
              value='MASCULINE'
            />
            <Picker.Item
              label='Female'
              value='FEMININE'
            />
            <Picker.Item
              label='Other'
              value='NEUTER'
            />
          </Picker>
        </View>

        {/* INPUT CHRONICAL DISORDER */}
        <View>
          <Text style={styles.input}>Any chronical disorder?</Text>
          <View style={styles.wrapperInput}>
            <TextInput
              style={styles.input}
              multiline
              inputMode='text'
              value={chronicDisorders}
              onChangeText={text => setChronicDisorders(text)}
              returnKeyType='done'
            />
          </View>

        </View>
      </View>

      {/* CREATE ACCOUNT BUTTON */}
      {name === '' || password === '' || email === '' || confirmedPassword === '' ||
      height === '' || weight === '' || checkValidPassword || checkValidEmail ||
      checkValidName || checkValidConfirmedPassword || checkValidHeight || checkValidWeight || checkValidBirthdate
        ? (
          <TouchableOpacity
            disabled
            style={styles.buttonDisable}
            onPress={handleRegister}
          >
            <Text style={styles.text}>Create Account</Text>
          </TouchableOpacity>
          )
        : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.text}>Create Account</Text>
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
  wrapperInputRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around'
  },
  input: {
    padding: 10,
    width: '100%'
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
  },
  activeButton: {
    color: 'white'
  },
  picker: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10
  },
  birthdate: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  }
})

export default RegisterForm
