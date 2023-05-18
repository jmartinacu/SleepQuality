import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, StyleSheet, Image } from 'react-native'
import RegisterVerification from '../components/users/RegisterVerification'
import ForgotPasswordVerification from '../components/users/ForgotPasswordVerification'
import PasswordChangeVerification from '../components/users/PasswordChangeVerification'
import { Eye } from '../assests/eyes'

const EmailVerification = ({ navigation, route }) => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Image
        source={Eye}
        resizeMode='contain'
        style={styles.image}
      />
      {route.params.mode === 'Register' && <RegisterVerification navigation={navigation} />}
      {route.params.mode === 'Password' && <ForgotPasswordVerification navigation={navigation} />}
      {route.params.mode === 'ChangePass' && <PasswordChangeVerification navigation={navigation} email={route.params.email} />}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
    // backgroundColor: '#191970'
  }
})

export default EmailVerification
