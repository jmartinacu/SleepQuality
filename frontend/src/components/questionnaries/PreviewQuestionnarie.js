import { FlatList, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import { doctorAssignQuestionnarieToUser } from '../../api/ApiUser'
import { useState } from 'react'

const PreviewQuestionnaire = ({ navigation, id, name, logo, answers, assign, fill, accessToken, idUser }) => {
  const [showApproved, setShowApproved] = useState(false)
  const [message, setMessage] = useState('Questionnarie Successfully Assigned')

  const handleAsignQuestionnarie = () => {
    if (accessToken !== null) {
      doctorAssignQuestionnarieToUser(accessToken, idUser, { questionnaires: [id] })
        .then(result => {
          if (result.status === 200) {
            setShowApproved(true)
            setMessage('Questionnarie Successfully Assigned')
          } else if (result.status === 403) {
            setMessage('This User is not one of your patients')
          } else if (result.status === 404) {
            setMessage('User does not exist')
          } else {
            navigation.replace('TextAndButton', { text: 'An error occurried. Log in again', button: 'Go Login', direction: 'Login' })
          }
        })
    }
  }

  const handlePressed = () => {
    if (answers) {
      navigation.push('AnswersList', { id, name, logo, idUser })
    } else if (fill) {
      navigation.push('Questionnaire', { id, name, logo })
    } else if (assign) {
      handleAsignQuestionnarie()
    }
  }

  return (
    <View>
      <Modal
        propagateSwipe
        animationType='slide'
        transparent
        visible={showApproved}
        onRequestClose={() => {
          setShowApproved(!showApproved)
        }}
      >
        {Platform.OS === 'web'
          ? (
            <ScrollView>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text>{message}</Text>
                  <Pressable
                    style={[styles.buttonModal, styles.buttonClose]}
                    onPress={() => setShowApproved(!showApproved)}
                  >
                    <Text style={styles.textStyle}>Close Message</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
            )
          : (
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>{message}</Text>
                <Pressable
                  style={[styles.buttonModal, styles.buttonClose]}
                  onPress={() => setShowApproved(!showApproved)}
                >
                  <Text style={styles.textStyle}>Close Message</Text>
                </Pressable>
              </View>
            </View>
            )}
      </Modal>

      <TouchableOpacity
        style={styles.container}
        onPress={handlePressed}
        activeOpacity={0.5}
      >
        <Image
          source={logo}
          resizeMode='contain'
          style={styles.image}
        />
        <Text style={styles.quesText}>{name}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: 'white',
    marginTop: 10,
    backgroundColor: '#191970'
  },
  image: {
    height: 40,
    width: 40
  },
  quesText: {
    color: 'white'
  },
  buttonModal: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 15
  },
  textLogin: {
    color: '#191970',
    fontWeight: '700'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: '#6495ed',
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
  }
})

export default PreviewQuestionnaire
