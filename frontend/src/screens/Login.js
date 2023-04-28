import { Button, SafeAreaView, View } from 'react-native'

const Login = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View>
        <Button
          onPress={() => navigation.push('Home')}
          title='Log In'
        />
      </View>
    </SafeAreaView>
  )
}

export default Login
