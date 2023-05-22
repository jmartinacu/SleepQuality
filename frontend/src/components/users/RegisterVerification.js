import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

const RegisterVerification = ({ navigation }) => {
  const handleVerification = () => {
    navigation.replace('Login')
  }

  return (
    <View style={styles.container}>
      <Text>
        We sent you a Verification Email
      </Text>
      <Text>
        Check your email and verify your account
      </Text>
      <Text>
        Are you already verified?
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <Text style={styles.text}>Go Login</Text>
      </TouchableOpacity>
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
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
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
  }
})

export default RegisterVerification
