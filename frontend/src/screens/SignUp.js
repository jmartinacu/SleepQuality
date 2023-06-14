import { Image, StyleSheet, Text } from 'react-native'
import RegisterForm from '../components/users/RegisterForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Sheep } from '../assests/questionnarieLogo'

const SignUp = ({ navigation }) => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Image
        source={Sheep}
        resizeMode='contain'
        style={styles.image}
      />

      <Text style={styles.textTitle}>Sleep Sheep </Text>

      <RegisterForm navigation={navigation} heightU='' weightU='' genderU='NEUTER' chronicDisorders='' />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#191970'
  },

  image: {
    height: 150,
    width: '100%',
    marginBottom: 20
  },

  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30
  }
})

export default SignUp
