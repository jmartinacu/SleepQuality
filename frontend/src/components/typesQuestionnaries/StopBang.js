import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { createAswer, getDefaultInfo } from '../../api/ApiQuestionnaries'

const StopBang = ({ id, accessToken, navigation, name, questions, additionalInfo }) => {
  const [answers, setAnswers] = useState(new Array(8).fill(''))
  const [error, setError] = useState('')

  useEffect(() => {
    getDefaultInfo(accessToken, id)
      .then(result => {
        if (result.status === 200) {
          console.log(result.data)
          if (result.data !== []) {
            const copy = [...answers]
            for (const obj of result.data) {
              copy.splice(obj.index, 0, obj.answer)
            }
            console.log(copy)
            setAnswers(copy)
          }
        } else {
          console.log(result.data.message)
        }
      })
  }, [])

  const result = Object.entries(questions)
    .reduce((accumulator, current) => {
      const obj = {
        question: current[0],
        type: current[1]
      }
      accumulator.push(obj)
      return accumulator
    }, [])

  const handleAddAnswer = (answer, index) => {
    const copyAnswers = [...answers]
    copyAnswers[index] = answer
    setAnswers(copyAnswers)
  }

  const handleSubmitAnswer = () => {
    let submit = []
    let err = false
    let i = 0
    for (const obj of result) {
      if (answers[i] === '') {
        setError('You need to fill all the mandatory questions: *')
        err = true
        submit = []
        break
      } else {
        const listInList = [obj.question, answers[i]]
        submit.push(listInList)
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

      return submit
    }
  }

  const renderQuestion = ({ index, item }) => {
    return (
      <View>
        <Text>{item.question} *</Text>
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
        </View>
      </View>

    )
  }

  const renderSubmitButton = () => {
    return (
      <View>
        <Text>*: Mandatory question</Text>
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

export default StopBang
