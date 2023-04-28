import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Button } from 'react-native'

const Proffile = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View>
        <Button
          onPress={() => navigation.push('Login')}
          title='Log out'
        />
      </View>
    </SafeAreaView>

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
