import { Image, StyleSheet } from 'react-native'
import LoginForm from '../components/users/LoginForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Login = ({ navigation }) => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/* <Image
        source={require('')}
        resizeMode='contain'
        style={styles.image}
      /> */}

      <LoginForm navigation={navigation} />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  },
  image: {
    height: 150,
    width: '100%',
    marginBottom: 20
  }
})

export default Login
