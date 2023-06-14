import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const PreviewPatient = ({ navigation, id, name, profPic, email }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push('UserInfo', { id })}
      activeOpacity={0.5}
    >
      <Image
        source={profPic}
        resizeMode='contain'
        style={styles.image}
      />
      <View>
        <Text style={styles.quesText}>{name}</Text>
        <Text style={styles.quesText}>{email}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },

  image: {
    height: 40,
    width: 40
  },

  quesText: {
    color: 'white'
  }
})

export default PreviewPatient
