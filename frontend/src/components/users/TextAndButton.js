import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Sheep } from '../../assests/questionnarieLogo'

const TextAndButton = ({ navigation, route }) => {
  const handleGoDirection = (direction) => {
    navigation.replace(direction)
  }

  return (
    <View style={styles.container1}>
      <View style={styles.container}>
        <Image
          source={Sheep}
          resizeMode='contain'
          style={styles.image}
        />
        <Text style={styles.text}>{route.params.text}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleGoDirection(route.params.direction)}>
          <Text style={styles.textSend}>{route.params.button}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#191970'
  },
  container: {
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 50
  },

  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white'
  },

  wrapperInputWrong: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#FF7F50',
    marginTop: 10,
    alignItems: 'center'
  },

  input: {
    padding: 10,
    width: '100%',
    color: 'white',
    fontWeight: '400'
  },

  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 10,
    paddingHorizontal: 5,
    backgroundColor: '#191970',
    color: 'white',
    fontSize: 12
  },

  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 25
  },

  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 25
  },

  text: {
    color: 'white',
    fontWeight: '600'
  },

  textFailed: {
    alignSelf: 'flex-end',
    color: '#FF7F50'
  },

  textSend: {
    color: '#191970',
    fontWeight: '700'
  },
  image: {
    height: 150,
    width: '100%',
    marginBottom: 20,
    marginTop: 50
  }

})

export default TextAndButton
