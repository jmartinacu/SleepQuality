import { FlatList, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'

const ConsensusSleepDiary = ({ name, questions, additionalInfo }) => {
  const [answers, setAnswers] = useState(new Array(22).fill(''))

  const result = Object.entries(questions)
    .reduce((accumulator, current) => {
      const obj = {
        question: current[0],
        types: current[1]
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

  const keys = [...EnumForEachQuestion.keys()]

  const handleAddAnswer = (answer, index) => {
    const copyAnswers = [...answers]
    copyAnswers[index] = answer
    setAnswers(copyAnswers)
  }

  const renderQuestion = ({ index, item }) => {
    let esEnum = false
    if (keys.includes(index)) {
      esEnum = true
    }

    return (
      <View>
        <Text>{item.question}</Text>
        {esEnum
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
            <View style={styles.wrapperInput}>
              <TextInput
                style={styles.input}
                placeholder=''
                value={answers[index]}
                onChangeText={text => handleAddAnswer(text, index)}
                returnKeyType='done'
                maxLength={40}
              />
            </View>
            )}
      </View>

    )
  }

  return (
    <View>
      <Text>{name}</Text>
      <FlatList
        data={result}
        renderItem={renderQuestion}
        keyExtractor={(item, index) => index}
      />
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

export default ConsensusSleepDiary
