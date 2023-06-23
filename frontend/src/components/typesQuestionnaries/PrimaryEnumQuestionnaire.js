import { useState } from 'react'
import { createAswer } from '../../api/ApiQuestionnaries'
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker'

const PrimaryEnumQuestionnaire = ({ logo, n, accessToken, navigation, name, questions, additionalInfo, instructions }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const [answers, setAnswers] = useState(new Array(n).fill(''))
  const [error, setError] = useState('')

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
  const keys = [...EnumForEachQuestion.keys()]

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
    let isEnum = false
    if (keys.includes(index)) {
      isEnum = true
    }
    return (
      <View>
        {isEnum &&
          <View>
            <Text style={styles.textQuiz}>{item.question} *</Text>
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
          </View>}

      </View>

    )
  }

  const renderSubmitButton = () => {
    return (
      <View>
        <Text style={styles.mandatoryText}>* Mandatory question</Text>
        <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmitAnswer}>
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
          <Text style={styles.textStyle}>See Instructions</Text>
        </Pressable>

        <FlatList
          data={result}
          renderItem={renderQuestion}
          keyExtractor={(item, index) => index}
          nestedScrollEnabled
          ListFooterComponent={renderSubmitButton}
          removeClippedSubviews
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
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5F50',
    borderRadius: 5,
    marginTop: 25
  },
  buttonSubmit: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5F50',
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

  picker: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'white',
    marginTop: 10
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

  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  mandatoryText: {
    marginTop: 25,
    color: 'white',
    textAlign: 'left'
  },
  logo: {
    height: 100,
    width: 100
  }
})

export default PrimaryEnumQuestionnaire
