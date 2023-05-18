import { Image, StyleSheet } from 'react-native'
import RegisterForm from '../components/users/RegisterForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const SignUp = ({ navigation }) => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/* <Image
        source={require('')}
        resizeMode='contain'
        style={styles.image}
      /> */}

      <RegisterForm navigation={navigation} />
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

export default SignUp
