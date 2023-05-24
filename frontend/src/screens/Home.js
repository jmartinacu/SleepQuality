import { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import { getQuestionnaires, getQuestionnarieById } from '../api/ApiQuestionnaries'
import ConsensusSleepDiary from '../components/typesQuestionnaries/ConsensusSleepDiary'
import { getItemFromStorage } from '../utils/Utils'
import { FlatList } from 'react-native-gesture-handler'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'

const Home = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState([])

  const [error, setError] = useState(false)

  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    getItemFromStorage('accessToken', setAccessToken).then()
    if (accessToken !== null) {
      getQuestionnaires(accessToken)
        .then(result => {
          if (result.status === 200) {
            setError(false)
            setQuestionnaires(result.data)
          } else {
            setError(true)
            console.log(result.data.message)
          }
        })
        .catch(err => {
          setError(true)
          console.error(err)
        })
    }
  }, [accessToken])

  const renderQuestionnaires = ({ index, item }) => {
    return (
      <PreviewQuestionnaire navigation={navigation} id={item.id} name={item.name} />
    )
  }

  const renderEmptyList = () => {
    return (
      <Text>Error. Refresh the page</Text>
    )
  }

  return (
    <View style={styles.tabBarStyle}>
      <FlatList
        data={questionnaires}
        renderItem={renderQuestionnaires}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flex: 1,
    alignItems: 'center'
  },
  proffileImage: {
    height: 40,
    width: 40
  }
})

export default Home
