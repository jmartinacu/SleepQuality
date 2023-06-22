import { useState } from 'react'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

const PreviewAnswer = ({ date, answers, algorithms, name }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const answersToRender = Object.entries(answers)
    .reduce((accumulator, current) => {
      const obj = {
        question: current[0],
        answer: current[1]
      }
      accumulator.push(obj)
      return accumulator
    }, [])

  const dateSplit = date.split('T')
  const hour = dateSplit[1].split(':')[0] + ':' + dateSplit[1].split(':')[1]
  const year = dateSplit[0]

  const renderAnswer = ({ index, item }) => {
    return (
      <View>
        <Text style={styles.modalTextQuiz}>{item.question}</Text>
        {(name === 'Pittsburgh Sleep Quality Index' && (index === 0 || index === 2))
          ? (
            <Text style={styles.modalTextQuiz}>{item.answer.split('-')[1]}</Text>
            )
          : (
            <Text style={styles.modalText}>{item.answer === null ? 'No answer' : item.answer.toString()}</Text>
            )}
      </View>
    )
  }

  return (
    <View>
      <Modal
        propagateSwipe
        animationType='slide'
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        {Platform.OS === 'web'
          ? (
            <ScrollView>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <FlatList
                    data={answersToRender}
                    renderItem={renderAnswer}
                    keyExtractor={(item, index) => index}
                  />
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Hide Answers</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
            )
          : (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <FlatList
                  data={answersToRender}
                  renderItem={renderAnswer}
                  keyExtractor={(item, index) => index}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Hide Answers</Text>
                </Pressable>
              </View>
            </View>
            )}

      </Modal>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={styles.container}
      >
        <View>
          <Text style={styles.quesText}>{year}</Text>
          <Text style={styles.quesText}>{hour}</Text>
        </View>
        {algorithms !== undefined && <View style={styles.separator} />}
        {algorithms !== undefined &&
          <View>
            {name === 'STOP-BANG' && <Text style={styles.quesText}>STOP BANG Risk: {algorithms.stopBangRisk}</Text>}
            {name === 'STOP-BANG' && <Text style={styles.quesText}>STOP BANG Warning: {algorithms.stopBangWarning}</Text>}
            {name === 'Epworth Sleepiness Scale' && <Text style={styles.quesText}>Epworth Sleepiness Scale Risk: {algorithms.epworthSleepinessScaleRisk}</Text>}
            {name === 'Epworth Sleepiness Scale' && <Text style={styles.quesText}>Epworth Sleepiness Scale Warning: {algorithms.epworthSleepinessScaleWarning}</Text>}
            {name === 'Pittsburgh Sleep Quality Index' && <Text style={styles.quesText}>Pittsburgh Sleep Quality Index: {algorithms.pittsburghSleepQualityIndex}</Text>}
            {name === 'Perceived Stress Questionnaire' && <Text style={styles.quesText}>Perceived Stress Questionnaire Risk: {algorithms.perceivedStressQuestionnaireRisk}</Text>}
            {name === 'Perceived Stress Questionnaire' && <Text style={styles.quesText}>Perceived Stress Questionnaire Emotions: {algorithms.perceivedStressQuestionnaireEmotions}</Text>}
            {name === 'Athens Insomnia Scale' && <Text style={styles.quesText}>Athens Insomnia Scale: {algorithms.athensInsomniaScale}</Text>}
            {name === 'International Restless Legs Scale' && <Text style={styles.quesText}>International Restless Legs Scale: {algorithms.internationalRestlessLegsScale}</Text>}
            {name === 'Insomnia Severity Index' && <Text style={styles.quesText}>Insomnia Severity Index Risk: {algorithms.insomniaSeverityIndexRisk}</Text>}
            {name === 'Insomnia Severity Index' && <Text style={styles.quesText}>Insomnia Severity Index Warning: {algorithms.insomniaSeverityIndexWarning}</Text>}
          </View>}

      </TouchableOpacity>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 3,
    borderColor: 'white',
    marginTop: 10,
    flexDirection: 'row',
    padding: 10
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
  modalTextQuiz: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 25
  },
  quesText: {
    color: 'white'
  },
  separator: {
    borderColor: 'white',
    borderWidth: 2,
    marginHorizontal: 10
  }
})

export default PreviewAnswer
