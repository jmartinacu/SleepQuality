import { useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'

const RegisterVerification = ({ navigation }) => {
  const [code, setCode] = useState('')

  const handleVerification = () => {
    return null
  }

  return (
    <View style={styles.container}>
      <Text>
        We sent you a code
      </Text>
      <Text>
        Check your email to get your confirmation code
      </Text>
      <View style={styles.wrapperInput}>
        <Text>Enter your 4 digits code:</Text>
        <TextInput
          style={styles.input}
          placeholder='XXXX'
          maxLength={4}
          keyboardType='numeric'
          inputMode='numeric'
          onChangeText={value => setCode(value)}
        />
      </View>
      {code.length !== 4
        ? (
          <TouchableOpacity
            disabled
            style={styles.buttonDisable}
            onPress={handleVerification}
          >
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
          )
        : (
          <TouchableOpacity style={styles.button} onPress={handleVerification}>
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
          )}
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
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10,
    alignItems: 'center',
    height: 50
  },
  input: {
    padding: 10,
    width: '100%'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    borderRadius: 5,
    marginTop: 25
  },
  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    marginTop: 25
  }
})

export default RegisterVerification
