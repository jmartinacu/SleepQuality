import { useState } from 'react'
import { createAswer } from '../../api/ApiQuestionnaries'
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'

const EpworthSleepinessScale = ({ accessToken, navigation, name, questions, additionalInfo }) => {
  const [answers, setAnswers] = useState(new Array(8).fill(''))

  const result = Object.entries(questions)
    .reduce((accumulator, current) => {
      const obj = {
        question: current[0],
        type: current[1]
      }
      accumulator.push(obj)
      return accumulator
    }, [])

  const EnumForEachQuestion = new Map()
  for (const obj of additionalInfo) {
    if (obj.questions !== []) {
      for (const number of obj.questions) {
        EnumForEachQuestion.set(number, obj.enum)
      }
    }
  }

  const handleAddAnswer = (answer, index) => {
    const copyAnswers = [...answers]
    copyAnswers[index] = answer
    setAnswers(copyAnswers)
  }

  const handleSubmitAnswer = () => {
    const submit = []
    let i = 0
    for (const obj of result) {
      if (answers[i] === '') {
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
          navigation.replace('TextAndButton', { text: 'Answers Successfully Submitted', button: 'Go Home', direction: 'Home' })
        } else {
          console.log(result)
        }
      })
      .catch(err => {
        console.error(err)
      })

    return submit
  }

  const renderQuestion = ({ index, item }) => {
    return (
      <View>
        <Text>{item.question}</Text>
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
      </View>

    )
  }

  const renderSubmitButton = () => {
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={handleSubmitAnswer}>
          <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>

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
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
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
  picker: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10
  }
})

export default EpworthSleepinessScale
