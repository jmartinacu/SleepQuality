import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { createAswer } from '../../api/ApiQuestionnaries'

const PittsburghSleepQualityIndex = ({ logo, accessToken, navigation, name, questions, additionalInfo, instructions, desc1, desc2 }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const [answers, setAnswers] = useState(new Array(24).fill(''))
  const [error, setError] = useState(false)

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

  for (const obj of result) {
    if (obj.type.split('_')[0] === 'SECONDARY') {
      isSecondary.push(true)
    } else {
      isSecondary.push(false)
    }
    if (obj.type.split('_')[1] === 'TEXT') {
      isText.push(true)
      isBoolean.push(false)
      isNumber.push(false)
    } else if (obj.type.split('_')[1] === 'BOOL') {
      isBoolean.push(true)
      isText.push(false)
      isNumber.push(false)
    } else if (obj.type.split('_')[1] === 'NUMBER') {
      isBoolean.push(false)
      isText.push(false)
      isNumber.push(true)
    }
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
    let i = 0
    for (const obj of result) {
      if (isNumber[i] && !isOnlyNumbers.test(answers[i])) {
        setError('Some questions can only be filled with numbers: **')
        err = true
        submit = []
        break
      } else if ((!isSecondary[i] || isBoolean[i] || keys.includes(i)) && answers[i] === '') {
        setError('You need to fill all the mandatory questions: *')
        err = true
        submit = []
        break
      } else if ((i === 0 || i === 2) && !regexHour.test(answers[i])) {
        setError('Wrong hour format. Correct format is: HH:MM')
        err = true
        submit = []
        break
      } else {
        if (isSecondary[i] && answers[i] === '') {
          const listInList = [obj.question, null]
          submit.push(listInList)
        } else if ((i === 0 || i === 2)) {
          const listInList = [obj.question, `17/05/2023-${answers[i]}`]
          submit.push(listInList)
        } else {
          const listInList = [obj.question, answers[i].trim()]
          submit.push(listInList)
        }
      }
      i++
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
        {((index >= 4 && index <= 12) || (index >= 19 && index <= 22)) &&
          <View>
            {index === 4 && <Text style={styles.textQuiz}>{desc1}</Text>}
            {index === 19 && <Text style={styles.textQuiz}>{desc2}</Text>}
            <View style={styles.hasDesc}>
              {isSecondary[index]
                ? (
                  <Text style={styles.textQuizSub}>{item.question}</Text>
                  )
                : (
                  <View>
                    {isNumber[index]
                      ? (
                        <Text style={styles.textQuizSub}>{item.question} **</Text>
                        )
                      : (
                        <Text style={styles.textQuizSub}>{item.question} *</Text>
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
                    {isText[index] &&
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

                    {isNumber[index] &&
                      <View style={styles.wrapperInput}>
                        <TextInput
                          style={styles.input}
                          inputMode='numeric'
                          keyboardType='numeric'
                          placeholder=''
                          value={answers[index]}
                          onChangeText={text => handleAddAnswer(text, index)}
                          returnKeyType='none'
                          maxLength={3}
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
          </View>}

        {(index < 4 || (index >= 14 && index <= 18)) &&
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
                  {isText[index] && (index !== 0 && index !== 2) &&
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
                  {isText[index] && (index === 0 || index === 2) &&
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
                        keyboardType='visible-password'
                        placeholder=''
                        value={answers[index]}
                        onChangeText={text => handleAddAnswer(text, index)}
                        returnKeyType='none'
                        maxLength={3}
                        autoCorrect={false}
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
          </View>}

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
    alignItems: 'center'
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
    backgroundColor: '#FF5F50',
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

  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center',
    fontSize: 30
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

  hasDesc: {
    marginLeft: 30,
    borderLeftWidth: 10,
    borderColor: 'white'
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

  textQuiz: {
    marginTop: 15,
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  textQuizSub: {
    marginTop: 15,
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center'
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
  logo: {
    height: 100,
    width: 100
  }
})

export default PittsburghSleepQualityIndex
