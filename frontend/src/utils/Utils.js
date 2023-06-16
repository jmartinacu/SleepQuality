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

export const parseWebDateToString = (date) => {
  const result = date.split('-')
  if (result.length === 3) {
    return `${result[2]}/${result[1]}/${result[0]}-00:00`
  }
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

export const DataURIToBlob = (dataURI) => {
  const splitDataURI = dataURI.split(',')
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i) }

  return new Blob([ia], { type: mimeString })
}

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}
