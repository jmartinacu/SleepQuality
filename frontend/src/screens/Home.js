import { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import { getQuestionnaires } from '../api/ApiQuestionnaries'
import { getItemFromStorage } from '../utils/Utils'
import { FlatList } from 'react-native-gesture-handler'
import PreviewQuestionnaire from '../components/questionnaries/PreviewQuestionnarie'
import { CSDN, CSDM, AIS, ESS, IRLS, ISI, PSQ, PSQI, SB } from '../assests/questionnarieLogo'

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
    let logo = null
    switch (item.name) {
      case 'Consensus Sleep Diary Morning':
        logo = CSDM
        break
      case 'Consensus Sleep Diary Night':
        logo = CSDN
        break
      case 'STOP-BANG':
        logo = SB
        break
      case 'Epworth Sleepiness Scale':
        logo = ESS
        break
      case 'Pittsburgh Sleep Quality Index':
        logo = PSQI
        break
      case 'Perceived Stress Questionnaire':
        logo = PSQ
        break
      case 'Athens Insomnia Scale':
        logo = AIS
        break
      case 'International Restless Legs Scale':
        logo = IRLS
        break
      case 'Insomnia Severity Index':
        logo = ISI
        break
    }

    return (
      <PreviewQuestionnaire logo={logo} navigation={navigation} id={item.id} name={item.name} />
    )
  }

  const renderEmptyList = () => {
    return (
      <Text>Loading...</Text>
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
    alignItems: 'center',
    backgroundColor: '#191970'
  },

  proffileImage: {
    height: 40,
    width: 40
  }
})

export default Home
