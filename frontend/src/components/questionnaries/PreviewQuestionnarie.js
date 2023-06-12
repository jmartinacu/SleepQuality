import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'

const PreviewQuestionnaire = ({ navigation, id, name, logo }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('Questionnaire', { id })}
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
    flexDirection: 'row'
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
