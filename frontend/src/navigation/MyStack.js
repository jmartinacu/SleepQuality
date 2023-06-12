import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from '@react-navigation/stack'
import { Alert, Button, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Home from '../screens/Home'
import Proffile from '../screens/Proffile'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CalendarPage from '../screens/CalendarPage'
import Login from '../screens/Login'
import SignUp from '../screens/SignUp'
import EmailVerification from '../screens/EmailVerification'
import TextAndButton from '../components/users/TextAndButton'
import Questionnarie from '../screens/Questionnarie'
import { EmptyProffile } from '../assests/perfil'

const Stack = createStackNavigator()

const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF7F50'
        }
      }}
    >
      <Stack.Screen
        name='Login'
        component={Login}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='SignUp'
        component={SignUp}
        options={{
          headerTransparent: true,
          title: ''
        }}
      />

      <Stack.Screen
        name='Home'
        component={Home}
        options={({ navigation }) => ({
          backgroundColor: '#FF7F50',
          title: 'Sleep Sheep',
          headerTitleAlign: 'center',
          headerTitleStyle: { color: '#191970', fontWeight: 'bold' },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.push('Proffile')}
              activeOpacity={0.5}
            >
              <Image
                source={EmptyProffile}
                style={styles.proffileImage}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={() => navigation.push('CalendarPage')}
                activeOpacity={0.5}
              >
                <AntDesign
                  name='calendar'
                  style={styles.calendar}
                />
              </TouchableOpacity>
            </View>
          )
        })}

      />
      <Stack.Screen
        name='Proffile'
        component={Proffile}
        options={{
          backgroundColor: '#FF7F50',
          title: '',
          headerTitleAlign: 'center'
        }}
      />

      <Stack.Screen
        name='CalendarPage'
        component={CalendarPage}
        options={{
          backgroundColor: '#FF7F50',
          title: '',
          headerTitleAlign: 'center'
        }}
      />

      <Stack.Screen
        name='Questionnaire'
        component={Questionnarie}
        options={{
          headerTransparent: true,
          title: ''
        }}
      />

      <Stack.Screen
        name='EmailVerification'
        component={EmailVerification}
        options={{
          headerTransparent: true,
          title: ''
        }}
      />

      <Stack.Screen
        name='TextAndButton'
        component={TextAndButton}
        options={{
          headerShown: false
        }}
      />

    </Stack.Navigator>

  )
}

const styles = StyleSheet.create({
  calendar: {
    justifyContent: 'center',
    fontSize: 30,
    marginRight: 60
  },
  proffileImage: {
    justifyContent: 'center',
    marginLeft: 60,
    height: 30,
    width: 30
  }
})

export default MyStack
