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

export const handleAnswersToGraphicByNQuestion = (lista, n) => {
  const map = new Map()
  if (n === 0 || n === 5 || n === 9) {
    map.set('Monday', 'No Data')
    map.set('Tuesday', 'No Data')
    map.set('Wednesday', 'No Data')
    map.set('Thursday', 'No Data')
    map.set('Friday', 'No Data')
    map.set('Saturday', 'No Data')
    map.set('Sunday', 'No Data')
  } else {
    map.set('Monday', 0)
    map.set('Tuesday', 0)
    map.set('Wednesday', 0)
    map.set('Thursday', 0)
    map.set('Friday', 0)
    map.set('Saturday', 0)
    map.set('Sunday', 0)
  }
  for (let i = 0; i < 7; i++) {
    const answer = lista[i]
    if (answer !== undefined) {
      const answersToRender = Object.entries(answer.answers)
        .reduce((accumulator, current) => {
          const obj = {
            question: current[0],
            answer: current[1]
          }
          accumulator.push(obj)
          return accumulator
        }, [])
      const date = new Date(answer.createdAt)
      switch (date.getDay()) {
        case 1 :
          map.set('Monday', answersToRender[n].answer)
          break
        case 2:
          map.set('Tuesday', answersToRender[n].answer)
          break
        case 3:
          map.set('Wednesday', answersToRender[n].answer)
          break
        case 4:
          map.set('Thursday', answersToRender[n].answer)
          break
        case 5:
          map.set('Friday', answersToRender[n].answer)
          break
        case 6:
          map.set('Saturday', answersToRender[n].answer)
          break
        case 0:
          map.set('Sunday', answersToRender[n].answer)
          break
      }
    }
  }
  return map
}

// export const checkPermissionsToExport = async (url, token) => {
//   try {
//     const isPermittedExternalStorage = await PermissionsAndroid.check(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//     )

//     if (!isPermittedExternalStorage) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage permission',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK'
//         }
//       )
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         exportToExcell(url, token)
//         console.log('Permission granted')
//       } else {
//         console.log('Permission denied')
//       }
//     }
//   } catch (err) {
//     console.log('Error while checking permission')
//     console.log(err)
//   }
// }
