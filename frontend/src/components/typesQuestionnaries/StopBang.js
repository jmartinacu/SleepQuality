import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { createAswer, getDefaultInfo } from '../../api/ApiQuestionnaries'

const StopBang = ({ n, logo, id, accessToken, navigation, name, questions, additionalInfo, instructions }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const [answers, setAnswers] = useState(new Array(n).fill(''))
  const [answer4, setAnswer4] = useState('')
  const [answer5, setAnswer5] = useState('')
  const [answer7, setAnswer7] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    getDefaultInfo(accessToken, id)
      .then(result => {
        if (result.status === 200) {
          if (result.data !== []) {
            const copy = [...answers]
            for (const obj of result.data) {
              if (obj.index === 4) {
                setAnswer4(obj.dbInformation)
              }
              if (obj.index === 5) {
                setAnswer5(obj.answer)
              }
              if (obj.index === 7) {
                setAnswer7(obj.dbInformation)
              }
              copy.splice(obj.index, 0, obj.answer)
            }
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
        <Text style={styles.textQuiz}>{item.question} *</Text>
        {index !== 4 && index !== 5 && index !== 7 &&
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

        {index === 5 &&
          <View style={styles.picker}>
            {answer5
              ? (
                <Text style={styles.answer}>YES</Text>
                )
              : (
                <Text style={styles.answer}>NO</Text>
                )}
          </View>}
        {index === 4 &&
          <View>
            <View style={styles.picker}>
              <Text style={styles.answer}>BMI: {answer4} kg/m^2</Text>
            </View>
            <Text style={styles.comment}>If you need to update your height or weight go to your proffile information</Text>
          </View>}
        {index === 7 &&
          <View style={styles.picker}>
            <Text style={styles.answer}>{answer7}</Text>
          </View>}
      </View>

    )
  }

  const renderSubmitButton = () => {
    return (
      <View>
        <Text style={styles.mandatoryText}>* Mandatory question</Text>
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
    alignItems: 'center'
  },

  button: {
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
  },
  answer: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  },
  comment: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  }
})

export default StopBang
