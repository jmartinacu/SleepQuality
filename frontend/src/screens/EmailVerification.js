import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, StyleSheet } from 'react-native'
import RegisterVerification from '../components/RegisterVerification'
import PasswordChangeVerification from '../components/PasswordChangeVerification'

const EmailVerification = ({ navigation, mode }) => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      {mode === 'Register' && <RegisterVerification navigation={navigation} />}
      {mode === 'Password' && <PasswordChangeVerification navigation={navigation} />}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  }
})

export default EmailVerification
