import cron from 'node-cron'
import prisma, { Questionnaire, User } from '../utils/database'

const everyDayCron = '0 0 * * *'

const addConsensusDiary = (): void => {
  void (
    async () => {
      const users = (await prisma.user.findMany()).filter(user => user.role !== 'ADMIN')
      const { id: idMorning } = await prisma.questionnaire.findFirst({
        where: {
          name: 'Consensus Sleep Diary Morning'
        }
      }) as Questionnaire
      const { id: idNight } = await prisma.questionnaire.findFirst({
        where: {
          name: 'Consensus Sleep Diary Night'
        }
      }) as Questionnaire
      const usersWithoutConsensusDiaryMorning = users.filter(user => {
        return !user.questionnairesToDo.includes(idMorning)
      })
      const usersWithoutConsensusDiaryNight = users.filter(users => {
        return !users.questionnairesToDo.includes(idNight)
      })
      await Promise.all(usersWithoutConsensusDiaryMorning.map(async user => {
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            questionnairesToDo: [...user.questionnairesToDo, idMorning]
          }
        })
      }))
      await Promise.all(usersWithoutConsensusDiaryNight.map(async user => {
        const { questionnairesToDo } = await prisma.user.findUnique({
          where: {
            id: user.id
          }
        }) as User
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            questionnairesToDo: [...questionnairesToDo, idNight]
          }
        })
      }))
    }
  )()
}

const addConsensusDiaryTask = cron.schedule(everyDayCron, addConsensusDiary)

export default addConsensusDiaryTask
