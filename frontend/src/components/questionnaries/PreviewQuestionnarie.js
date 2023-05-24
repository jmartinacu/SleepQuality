import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Eye } from '../../assests/eyes'

const PreviewQuestionnaire = ({ navigation, id, name }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('Questionnaire', { id })}
      activeOpacity={0.5}
    >
      <Image
        source={Eye}
        resizeMode='contain'
        style={styles.image}
      />
      <Text>{name}</Text>
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
  }
})

export default PreviewQuestionnaire
