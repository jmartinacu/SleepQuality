import { Image, StyleSheet, Text } from 'react-native'
import LoginForm from '../components/users/LoginForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Sheep } from '../assests/questionnarieLogo'

const Login = ({ navigation }) => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Image
        source={Sheep}
        resizeMode='contain'
        style={styles.image}
      />

      <Text style={styles.textTitle}>Sleep Sheep </Text>

      <LoginForm navigation={navigation} />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191970'
  },
  image: {
    height: 150,
    width: '100%',
    marginBottom: 20,
    marginTop: 45
  },
  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30
  }
})

export default Login
