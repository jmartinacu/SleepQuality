import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { userDeleteAccount } from '../api/ApiUser'

const DeleteAccount = ({ navigation, route }) => {
  const handleDeleteAccount = () => {
    userDeleteAccount(route.params.accessToken)
      .then(result => {
        if (result.status === 204) {
          navigation.replace('Login')
        }
      })
  }

  const handleDeleteAccountDoctor = () => {
    userDeleteAccount(route.params.accessToken)
      .then(result => {
        if (result.status === 204) {
          navigation.replace('Login')
        }
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>If you pressed this button you will never can get your account back. Are you sure you want to delete this account?</Text>

      <TouchableOpacity
        onPress={route.isDoctor === 'true' ? handleDeleteAccountDoctor : handleDeleteAccount}
        style={styles.button}
      >
        <Text>Yes, I want to delete my account</Text>
      </TouchableOpacity>

    </SafeAreaView>
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
    backgroundColor: '#FF7F50',
    borderRadius: 5,
    marginTop: 25
  }
})

export default DeleteAccount
