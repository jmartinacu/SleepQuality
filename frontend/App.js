import { NavigationContainer } from '@react-navigation/native'
import MyStack from './src/navigation/MyStack'
import { SafeAreaView, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' />
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191970'
  }
})

export default App
