import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const TextAndButton = ({ navigation, route }) => {
  const handleGoDirection = (direction) => {
    navigation.replace(direction)
  }

  return (
    <View style={styles.container}>
      <Text>{route.params.text}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleGoDirection(route.params.direction)}>
        <Text style={styles.text}>{route.params.button}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    borderRadius: 5,
    marginTop: 25
  }
})

export default TextAndButton
