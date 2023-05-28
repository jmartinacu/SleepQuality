import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { createAswer } from '../../api/ApiQuestionnaries'
import { ScrollView } from 'react-native-gesture-handler'

const ConsensusSleepDiary = ({ accessToken, navigation, name, questions, additionalInfo }) => {
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
    const isOnlyNumbers = /^\d+$/
    let submit = []
    let err = false
    let i = 0
    for (const obj of result) {
      if (isNumber[i] && !isOnlyNumbers.test(answers[i])) {
        console.log('HOLa')
        setError('Some questions can only be filled with numbers: **')
        err = true
        submit = []
        break
      } else if ((!isSecondary[i] || isBoolean[i] || keys.includes(i)) && answers[i] === '') {
        console.log('ADIOS')
        setError('You need to fill all the mandatory questions: *')
        err = true
        submit = []
        break
      } else {
        if (isSecondary[i] && answers[i] === '') {
          const listInList = [obj.question, null]
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
        {isSecondary[index]
          ? (
            <Text>{item.question}</Text>
            )
          : (
            <View>
              {isNumber[index]
                ? (
                  <Text>{item.question} **</Text>
                  )
                : (
                  <Text>{item.question} *</Text>
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
                  label='Select an answer...'
                  value=''
                />
                {EnumForEachQuestion.get(index).map((value, index) => {
                  return (
                    <Picker.Item
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
                    returnKeyType='done'
                    maxLength={20}
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
                    returnKeyType='done'
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
                      label='Select an answer...'
                      value=''
                    />
                    <Picker.Item
                      label='Yes'
                      value='true'
                    />
                    <Picker.Item
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
        <Text>*: Mandatory question</Text>
        <Text>**: Mandatory question. You can only answer with numbers</Text>
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
        animationType='slide'
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>iNSTRUCTIONS</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Instructions</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.row}>
        <Text>{name}</Text>
        <Pressable
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text>See Instructions</Text>
        </Pressable>
      </View>

      <FlatList
        data={result}
        renderItem={renderQuestion}
        keyExtractor={(item, index) => index}
        nestedScrollEnabled
        ListFooterComponent={renderSubmitButton}
        removeClippedSubviews={false}
      />

    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 50,
    marginHorizontal: 20
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10,
    alignItems: 'center',
    height: 50,
    width: '75%'
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
  }
})

export default ConsensusSleepDiary
