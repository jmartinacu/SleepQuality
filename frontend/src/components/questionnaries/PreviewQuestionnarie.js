import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'

const PreviewQuestionnaire = ({ navigation, id, name, logo, answers }) => {
  const handlePressed = () => {
    if (answers) {
      navigation.push('AnswersList', { id, name, logo })
    } else {
      navigation.push('Questionnaire', { id, name, logo })
    }
  }

  return (
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: 'white',
    marginTop: 10

  },

  image: {
    height: 40,
    width: 40
  },

  quesText: {
    color: 'white'
  }
})

export default PreviewQuestionnaire
