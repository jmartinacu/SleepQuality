import { View, StyleSheet, Button } from 'react-native'

const Proffile = ({ navigation }) => {
  return (

    <View>
      <Button
        onPress={() => navigation.push('Login')}
        title='Log out'
      />
    </View>

  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flex: 1,
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  proffileImage: {
    height: 40,
    width: 40
  }
})

export default Proffile
