import { NavigationContainer } from '@react-navigation/native'
import MyStack from './src/navigation/MyStack'
import { SafeAreaView, StyleSheet } from 'react-native'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default App
