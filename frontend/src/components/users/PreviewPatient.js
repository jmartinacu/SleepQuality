import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const PreviewPatient = ({ navigation, id, name, profPic, email }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('UserInfo', { id })}
      activeOpacity={0.5}
    >
      <View style={styles.containerPatient}>
        <Text style={styles.textTitle}>{name}</Text>
        <Text style={styles.text}>{email}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerPatient: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 3,
    textAlign: 'center'
  },
  image: {
    height: 40,
    width: 40
  },
  textTitle: {
    color: 'white',
    fontWeight: '600',
    marginTop: 7,
    marginBottom: 4,
    marginHorizontal: 7,
    textDecorationLine: 'underline'
  },
  text: {
    color: 'white',
    marginBottom: 7,
    marginHorizontal: 7
  }
})

export default PreviewPatient
