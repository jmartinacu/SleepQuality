import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native'

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.tabBarStyle}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.push('Proffile')}
          activeOpacity={0.5}
        >
          <Image
            source={require('../public/PERFIL-VACIO.png')}
            style={styles.proffileImage}
          />
        </TouchableOpacity>
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

export default Home
