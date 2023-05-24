import AsyncStorage from '@react-native-async-storage/async-storage'

export const parseDateToString = (date) => {
  const dateStringBackend = date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  const [dateString, timeString] = dateStringBackend.split(',')
  return `${dateString}-${timeString.trim()}`
}

export const getItemFromStorage = async (item, set) => {
  try {
    await AsyncStorage.getItem(item, (error, result) => {
      if (result) {
        set(result)
      } else {
        console.log(JSON.stringfy(error))
      }
    })
  } catch (error) {
    console.log(error)
  }
}
