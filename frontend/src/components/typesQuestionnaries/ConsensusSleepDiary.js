import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { createAswer } from '../../api/ApiQuestionnaries'
import { ScrollView } from 'react-native-gesture-handler'

const ConsensusSleepDiary = ({ accessToken, navigation, name, questions, additionalInfo }) => {
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
  const [isError, setIsError] = useState(new Array(22).fill(false))

  const [status, setStatus] = useState('')

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
    const submit = []
    let i = 0
    for (const obj of result) {
      if (isBoolean[i] && answers[i] === '') {
        const listInList = [obj.question, true]
        submit.push(listInList)
      } else if (keys.includes(i)) {
        const listInList = [obj.question, EnumForEachQuestion.get(i)[0]]
        submit.push(listInList)
      } else {
        const listInList = [obj.question, answers[i]]
        submit.push(listInList)
      }
      i++
    }
    createAswer(accessToken, {
      name,
      answers: Object.fromEntries(submit)
    })
      .then(result => {
        if (result.status === 201) {
          setStatus('')
          navigation.replace('TextAndButton', { text: 'Answers Successfully Submitted', button: 'Go Home', direction: 'Home' })
        } else {
          console.log(result)
          setStatus(result.message)
        }
      })
      .catch(err => {
        console.error(err)
      })

    return submit
  }

  const renderQuestion = ({ index, item }) => {
    let isEnum = false
    if (keys.includes(index)) {
      isEnum = true
    }

    return (
      <View>
        <Text>{item.question}</Text>
        {isEnum
          ? (
            <View style={!(Platform.OS === 'ios') ? styles.picker : null}>
              <Picker
                selectedValue={answers[index]}
                onValueChange={(itemValue, itemIndex) => handleAddAnswer(itemValue, index)}
                prompt='Answer'
                mode='dropdown'
              >
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
  const prueba = false

  const renderSubmitButton = () => {
    return (
      <View>
        {prueba
          ? (
            <TouchableOpacity
              disabled
              style={styles.buttonDisable}
              onPress={handleSubmitAnswer}
            >
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
            )
          : (
            <TouchableOpacity style={styles.button} onPress={handleSubmitAnswer}>
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
            )}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text>{name}</Text>
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
  }
})

export default ConsensusSleepDiary
