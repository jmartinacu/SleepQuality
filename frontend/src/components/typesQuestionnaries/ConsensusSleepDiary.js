import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { createAswer } from '../../api/ApiQuestionnaries'
import { ScrollView } from 'react-native-gesture-handler'

const ConsensusSleepDiary = ({ logo, accessToken, navigation, name, questions, additionalInfo, instructions }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const result = Object.entries(questions)
    .reduce((accumulator, current) => {
      const obj = {
        question: current[0],
        type: current[1]
      }
      accumulator.push(obj)
      return accumulator
    }, [])
  const isText = []
  const isBoolean = []
  const isNumber = []
  const isSecondary = []

  const EnumForEachQuestion = new Map()

  const [answers, setAnswers] = useState(new Array(22).fill(''))
  const [error, setError] = useState(false)

  let i = 0
  for (const obj of result) {
    if (obj.type.split('_')[0] === 'SECONDARY') {
      isSecondary.push(true)
    } else {
      isSecondary.push(false)
    }
    if (obj.type.split('_')[1] === 'TEXT' && !((name === 'Consensus Sleep Diary Morning') && (i === 2 || i === 4))) {
      isText.push(true)
      isBoolean.push(false)
      isNumber.push(false)
    } else if (obj.type.split('_')[1] === 'BOOL') {
      isBoolean.push(true)
      isText.push(false)
      isNumber.push(false)
    } else if (obj.type.split('_')[1] === 'NUMBER' || ((name === 'Consensus Sleep Diary Morning') && (i === 2 || i === 4))) {
      isBoolean.push(false)
      isText.push(false)
      isNumber.push(true)
    }
    i++
  }
  for (const obj of additionalInfo) {
    if (obj.questions !== []) {
      for (const number of obj.questions) {
        EnumForEachQuestion.set(number, obj.enum)
      }
    }
  }

  const keys = [...EnumForEachQuestion.keys()]

  const handleAddAnswer = (answer, index) => {
    const copyAnswers = [...answers]
    copyAnswers[index] = answer
    setAnswers(copyAnswers)
  }

  const handleSubmitAnswer = () => {
    const regexHour = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
    const isOnlyNumbers = /^\d+$/
    let submit = []
    let err = false
    let ind = 0
    for (const obj of result) {
      if (isNumber[ind] && !isOnlyNumbers.test(answers[ind])) {
        setError('Some questions can only be filled with numbers: **')
        err = true
        submit = []
        break
      } else if ((!isSecondary[ind] || isBoolean[ind] || keys.includes(i)) && answers[ind] === '') {
        setError('You need to fill all the mandatory questions: *')
        err = true
        submit = []
        break
      } else if ((ind === 0 || ind === 5 || ind === 9) && !regexHour.test(answers[ind])) {
        setError('Wrong hour format. Correct format is: HH:MM')
        err = true
        submit = []
        break
      } else {
        if (isSecondary[ind] && answers[ind] === '') {
          const listInList = [obj.question, null]
          submit.push(listInList)
        } else {
          const listInList = [obj.question, answers[ind].trim()]
          submit.push(listInList)
        }
      }
      ind++
    }
    if (!err) {
      createAswer(accessToken, {
        name,
        answers: Object.fromEntries(submit)
      })
        .then(result => {
          if (result.status === 201) {
            navigation.replace('TextAndButton', { text: 'Answers Successfully Submitted', button: 'Go Home', direction: 'Home' })
          } else {
            console.log(result)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

    return submit
  }

  const renderQuestion = ({ index, item }) => {
    let isEnum = false
    if (keys.includes(index)) {
      isEnum = true
    }

    return (
      <View>
        {isSecondary[index]
          ? (
            <Text style={styles.textQuiz}>{item.question}</Text>
            )
          : (
            <View>
              {isNumber[index]
                ? (
                  <Text style={styles.textQuiz}>{item.question} **</Text>
                  )
                : (
                  <Text style={styles.textQuiz}>{item.question} *</Text>
                  )}
            </View>
            )}

        {isEnum
          ? (
            <View style={!(Platform.OS === 'ios') ? styles.picker : null}>
              <Picker
                selectedValue={answers[index]}
                onValueChange={(itemValue, itemIndex) => handleAddAnswer(itemValue, index)}
                prompt='Answer'
                mode='dropdown'
              >
                <Picker.Item
                  style={{ color: 'white' }}
                  label='Select an answer...'
                  value=''
                />
                {EnumForEachQuestion.get(index).map((value, index) => {
                  return (
                    <Picker.Item
                      style={{ color: 'white', backgroundColor: '#FF5F50', fontWeight: 'bold' }}
                      key={index}
                      label={value}
                      value={value}
                    />
                  )
                })}
              </Picker>
            </View>
            )
          : (
            <View>
              {isText[index] && !(name === 'Consensus Sleep Diary Morning' && (index === 0 || index === 5 || index === 9)) &&
                <View style={styles.wrapperInput}>
                  <TextInput
                    style={styles.input}
                    placeholder=''
                    value={answers[index]}
                    onChangeText={text => handleAddAnswer(text, index)}
                    returnKeyType='none'
                    maxLength={20}
                    autoCorrect={false}
                    keyboardType='visible-password'
                  />
                </View>}
              {isText[index] && (name === 'Consensus Sleep Diary Morning' && (index === 0 || index === 5 || index === 9)) &&
                <View>
                  {Platform.OS === 'web' &&
                    <input
                      type='time'
                      value={answers[index]}
                      onChange={(e) => handleAddAnswer(e.target.value, index)}
                    />}
                  {Platform.OS !== 'web' &&
                    <View style={styles.wrapperInput}>
                      <TextInput
                        placeholderTextColor='white'
                        style={styles.input}
                        placeholder='00:00'
                        value={answers[index]}
                        onChangeText={text => handleAddAnswer(text, index)}
                        returnKeyType='none'
                        maxLength={5}
                        autoCorrect={false}
                        keyboardType='visible-password'
                      />
                    </View>}
                </View>}
              {isNumber[index] &&
                <View style={styles.wrapperInput}>
                  <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder=''
                    value={answers[index]}
                    onChangeText={text => handleAddAnswer(text, index)}
                    returnKeyType='none'
                    maxLength={3}
                    autoCorrect={false}
                    keyboardType='visible-password'
                  />
                </View>}
              {isBoolean[index] &&
                <View style={!(Platform.OS === 'ios') ? styles.picker : null}>
                  <Picker
                    selectedValue={answers[index]}
                    onValueChange={(itemValue, itemIndex) => handleAddAnswer(itemValue, index)}
                    prompt='Answer'
                    mode='dropdown'
                  >
                    <Picker.Item
                      style={{ color: 'white' }}
                      label='Select an answer...'
                      value=''
                    />
                    <Picker.Item
                      style={{ color: 'white', backgroundColor: '#FF5F50', fontWeight: 'bold' }}
                      label='Yes'
                      value='true'
                    />
                    <Picker.Item
                      style={{ color: 'white', backgroundColor: '#FF5F50', fontWeight: 'bold' }}
                      label='No'
                      value='false'
                    />
                  </Picker>
                </View>}
            </View>

            )}
      </View>

    )
  }

  const renderSubmitButton = () => {
    return (
      <View>
        <Text style={styles.mandatoryText}>* Mandatory question</Text>
        <Text style={styles.mandatoryText2}>** Mandatory question. You can only answer with numbers</Text>
        <TouchableOpacity style={styles.button} onPress={handleSubmitAnswer}>
          <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>
        <Text style={styles.textFailed}>{error}</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Modal
        propagateSwipe
        animationType='slide'
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{instructions}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Instructions</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <View style={styles.container1}>

        <Image
          source={logo}
          style={styles.logo}
        />
        <Text style={styles.textTitle}>{name}</Text>
        <Pressable
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.text}>See Instructions</Text>
        </Pressable>

        <FlatList
          data={result}
          renderItem={renderQuestion}
          keyExtractor={(item, index) => index}
          nestedScrollEnabled
          ListFooterComponent={renderSubmitButton}
          removeClippedSubviews={false}
          keyboardDismissMode='none'
        />

      </View>
    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  container1: {
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center',
    marginBottom: 35,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'white',
    marginTop: 10,
    alignItems: 'center',
    width: '100%'
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
    color: 'red'
  },
  activeButton: {
    color: 'white'
  },
  picker: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'white',
    marginTop: 10
  },
  birthdate: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  row: {
    flexDirection: 'row'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  textQuiz: {
    marginTop: 15,
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  mandatoryText: {
    marginTop: 25,
    color: 'white',
    textAlign: 'left'
  },
  mandatoryText2: {
    color: 'white',
    textAlign: 'left'
  },
  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center',
    fontSize: 30
  },
  logo: {
    height: 100,
    width: 100
  }
})

export default ConsensusSleepDiary
