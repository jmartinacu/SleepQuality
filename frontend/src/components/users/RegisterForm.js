import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Button } from 'react-native'
import { userLogin, userRegister } from '../../api/ApiUser'
import { Eye, EyeActive } from '../../assests/eyes'
import { Input } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import { parseDateToString } from '../../utils/Utils'

const RegisterForm = ({ navigation, update, nameU, emailU, heightU, weightU, genderU, birthDateU, chronicDisordersU }) => {
  const [status, setStatus] = useState('')

  console.log(nameU)

  const [name, setName] = useState(nameU)
  const [email, setEmail] = useState(emailU)
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')

  const [birthDate, setBirthDate] = useState(new Date(1598051730000))
  const [gender, setGender] = useState(genderU)
  const [height, setHeight] = useState(heightU)
  const [weight, setWeight] = useState(weightU)
  const [chronicDisorders, setChronicDisorders] = useState(chronicDisordersU)

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
        email: email.toLocaleLowerCase().trim(),
        name: name.trim(),
        gender,
        height,
        weight,
        birth: parseDateToString(birthDate),
        chronicDisorders: chronicDisorders === '' ? null : chronicDisorders.trim(),
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

      <View style={styles.container}>

        {/* INPUT NAME */}
        {checkValidName
          ? (
            <View>
              <View style={styles.wrapperInputWrong}>
                <Text style={styles.floatingLabel}>Name</Text>
                <TextInput
                  style={styles.input}
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
                <Text style={styles.floatingLabel}>Name</Text>
                <TextInput
                  style={styles.input}
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

        {/* HORIZONTAL LINE */}
        <View
          style={{
            marginTop: 20,
            borderBottomColor: 'white',
            // borderBottomWidth: StyleSheet.hairlineWidth
            borderBottomWidth: 5
          }}
        />

        <View style={styles.wrapperInputRow}>

          {/* INPUT HEIGHT */}
          {checkValidHeight
            ? (
              <View style={styles.wrapperInputWrong}>
                <Text style={styles.floatingLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  inputMode='numeric'
                  keyboardType='numeric'
                  value={height}
                  onChangeText={text => handleCheckHeightValidity(text)}
                  returnKeyType='done'
                  maxLength={3}
                />
              </View>

              )
            : (
              <View style={styles.wrapperInput}>
                <Text style={styles.floatingLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  inputMode='numeric'
                  keyboardType='numeric'
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
                <Text style={styles.floatingLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  inputMode='numeric'
                  keyboardType='numeric'
                  value={weight}
                  onChangeText={text => handleCheckWeightValidity(text)}
                  returnKeyType='done'
                  maxLength={3}
                />
              </View>
              )
            : (
              <View style={styles.wrapperInput}>
                <Text style={styles.floatingLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  inputMode='numeric'
                  keyboardType='numeric'
                  value={weight}
                  onChangeText={text => handleCheckWeightValidity(text)}
                  returnKeyType='done'
                  maxLength={3}
                />
              </View>
              )}
          {/* ERROR MESSAGES HEIGHT AND WEIGHT VALIDATION */}
        </View>
        {checkValidWeight &&
  (
    <Text style={styles.textFailed}>Weight must be bigger than 0 kg and less than 600 kg</Text>
  )}
        {checkValidHeight &&
  (
    <Text style={styles.textFailed}>Height must be bigger than 0 cm and less than 300 cm</Text>
  )}
        <View />

        {/* INPUT BIRTHDATE */}
        <View style={styles.birthdate}>
          <Text style={styles.input}>Introduce your birthdate:</Text>
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

        {/* HORIZONTAL LINE */}
        <View
          style={{
            marginTop: 20,
            borderBottomColor: 'white',
            // borderBottomWidth: StyleSheet.hairlineWidth
            borderBottomWidth: 5
          }}
        />

        {/* INPUT GENDER */}
        <View>
          <Text style={styles.inputGender}>Introduce your gender:</Text>
          <View style={!(Platform.OS === 'ios') ? styles.picker : null}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
              prompt='Gender'
              mode='dropdown'
            >
              <Picker.Item
                label='Other'
                value='NEUTER'
              />
              <Picker.Item
                label='Male'
                value='MASCULINE'
              />
              <Picker.Item
                label='Female'
                value='FEMININE'
              />
            </Picker>
          </View>

          {/* INPUT CHRONICAL DISORDER */}
          <View>
            <View style={styles.wrapperInput}>
              <Text style={styles.floatingLabel}>Any chronical disorder?</Text>
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
              <Text style={styles.textCreate}>Create Account</Text>
            </TouchableOpacity>
            )
          : (
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.textCreate}>Create Account</Text>
            </TouchableOpacity>
            )}
        {status !== '' &&
          <Text style={styles.textFailed}>{status}</Text>}
      </View>
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
    borderColor: 'white',
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
    width: '100%',
    color: 'white',
    fontWeight: '400',
    height: 50
  },

  inputGender: {
    padding: 10,
    width: '100%',
    color: 'white',
    fontWeight: '400',
    height: 50,
    marginTop: '0'
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
    fontWeight: '700'
  },
  textFailed: {
    alignSelf: 'flex-end',
    color: '#FF7F50'
  },
  activeButton: {
    color: 'white'
  },
  picker: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#191970',
    marginTop: 10
  },
  birthdate: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  textCreate: {
    color: '#191970',
    fontWeight: '700'
  }
})

export default RegisterForm
