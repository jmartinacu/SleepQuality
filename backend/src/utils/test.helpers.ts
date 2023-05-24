import { faker } from '@faker-js/faker'
import { random } from './helpers'
import type { Session, User } from './database'
import type {
  CreateUserInput,
  CreateUserResponse,
  Gender,
  Role,
  UpdateUserStrictSchema
} from '../modules/user/user.schemas'

function fakeInputUser (): CreateUserInput {
  const genders = ['MASCULINE', 'FEMININE', 'NEUTER']
  const genderIndex = random(0, 2)
  const email = faker.internet.email()
  const password = 'asdfR2&tr'
  const birth = '15/01/1998-15:34'
  const gender = genders.at(genderIndex) as Gender
  const height = faker.datatype.number({ min: 1, max: 2.5, precision: 0.01 })
  const weight = faker.datatype.number({ min: 20, max: 200, precision: 0.01 })
  const chronicDisorders = faker.datatype.string()
  const name = faker.name.fullName()
  return {
    email,
    name,
    password,
    birth,
    gender,
    height,
    weight,
    chronicDisorders
  }
}

function fakeResponseUser ({
  lengthString = 10,
  maxNumber = 50
}):
  CreateUserResponse & { password: string } {
  const user = fakeInputUser()
  return {
    ...user,
    id: fakerString({ length: lengthString }),
    BMI: fakerNumber({ max: maxNumber })
  }
}

function fakeUser ({
  lengthString = 10,
  maxNumber = 50
}): User {
  const roles = ['USER', 'DOCTOR']
  const roleIndex = random(0, 1)
  const { birth: birthString, ...rest } = fakeResponseUser({ lengthString, maxNumber })
  const verificationCode = faker.datatype.string(20)
  const passwordResetCode = random(10000, 99999)
  const verified = faker.datatype.boolean()
  const role = roles.at(roleIndex) as Role
  const profilePicture = faker.datatype.string()
  const questionnairesToDo: string[] = []
  const createdAt = new Date()
  const updatedAt = new Date()
  return {
    ...rest,
    birth: new Date(birthString),
    verificationCode,
    passwordResetCode,
    verified,
    role,
    profilePicture,
    questionnairesToDo,
    createdAt,
    updatedAt,
    doctorId: null
  }
}

function fakeUpdateUser (): UpdateUserStrictSchema {
  const user = fakeInputUser()
  const { birth, email, name, password, ...rest } = user
  return {
    ...rest
  }
}

function fakerString ({ length = 10 }: { length?: number }): string {
  return faker.datatype.string(length)
}

function fakerNumber ({ max = 50 }: { max?: number }): number {
  return faker.datatype.number(max)
}

function fakerSession ({
  lengthString = 10,
  userId
}: {
  lengthString?: number
  userId?: string
}): Session {
  const id = faker.datatype.string(lengthString)
  const valid = faker.datatype.boolean()
  if (typeof userId === 'undefined') userId = faker.datatype.string(lengthString)
  const updatedAt = new Date()
  return {
    id,
    valid,
    updatedAt,
    userId,
    doctorId: null
  }
}

const correctAnswers = [
  {
    name: 'Consensus Sleep Diary',
    answers: {
      'What time did you get into bed?': 'Around 1 am',
      'What did you you try to go to sleep?': 'I went to sleep very late, at 1:30 am',
      'How long did it take you to fall asleep?': 'I feel asleep in 10 minutes',
      'How many times did you wake up, not counting your final awakening?': 0,
      'In total, how long did these awakenings last?': 0,
      'What time was your final awakening?': 'Around 7 am',
      'After your final awakening, how long did you spend in bed trying to sleep?': 0,
      'Did you wake up earlier than you planed?': true,
      'If yes, how much earlier?': 30,
      'What time did you get out of bed for the day?': 'At 7:30 am',
      'In total, how long did you sleep?': 330,
      'How would you rate the quality of your sleep?': 'Good',
      'How rested or refreshed did you feel when you woke-up for the day?': 'Slightly rested',
      'How many times did you nap or doze': 2,
      'In total, how long did you nap or doze?': 40,
      'How many drinks containing alcohol did you have?': 2,
      'What time was your last alcohol drink?': 'Was three days ago',
      'How many caffeinated drinks (coffee, tea, soda, energy drinks) did you have?': 0,
      'What time was your last caffeinated drink?': null,
      'Did you take any over-the-counter or prescription medication(s) to help you sleep?': false,
      'If so, list medication(s), dose, and time taken': null,
      Comments: 'No Comments'
    }
  },
  {
    name: 'STOP-BANG',
    answers: {
      'Snoring? Do you Snore Loudly (loud enough to be heard through closed doors or your bed-partner-elbows you for snoring at night)?': false,
      'Tired? Do you often feel Tired, Fatigued, or Sleepy during the daytime (such as falling asleep during driving or talking to someone)?': false,
      'Observed? Has anyone Observed you Stop Breathing or Choking/Gasping during your sleep?': false,
      'Pressure? Do you have or are being treated for High Blood Pressure?': false,
      'Body Mass Index more than 35 kg/m^2?': true,
      'Age older than 50?': false,
      'Neck size large? (Measured around Adams Apple) is your shirt collar 16 inches / 40 cm larger?': true,
      'Gender = Male?': true
    }
  },
  {
    name: 'Epworth Sleepiness Scale',
    answers: {
      'Sitting and reading': 'Slight chance of falling asleep',
      'Sitting and watching TV or a video': 'Moderate chance of falling asleep',
      'Sitting in a classroom at school during the morning': 'Slight chance of falling asleep',
      'Sitting and riding in a car or bus for about half an hour': 'Moderate chance of falling asleep',
      'Lying down to rest or nap in the afternoon': 'High chance of falling asleep',
      'Sitting and talking to someone': 'Would never fall asleep',
      'Sitting quietly by yourself after lunch': 'Moderate chance of falling asleep',
      'Sitting and eating a meal': 'Would never fall asleep'
    }
  },
  {
    name: 'Consensus Sleep Diary',
    answers: {
      'What time did you get into bed?': 'Around 1 am',
      'What did you you try to go to sleep?': 'I went to sleep very late, at 1:30 am',
      'How long did it take you to fall asleep?': 'I feel asleep in 10 minutes',
      'How many times did you wake up, not counting your final awakening?': 0,
      'In total, how long did these awakenings last?': "I didn't have any awakening",
      'What time was your final awakening?': 'Around 7 am',
      'After your final awakening, how long did you spend in bed trying to sleep?': "I don't try to sleep after the awakening",
      'Did you wake up earlier than you planed?': true,
      'If yes, how much earlier?': '30 minutes',
      'What time did you get out of bed for the day?': 'At 7:30 am',
      'In total, how long did you sleep?': '6 hours 12 minutes',
      'How would you rate the quality of your sleep?': 'Good',
      'How rested or refreshed did you feel when you woke-up for the day?': 'Slightly rested',
      'How many times did you nap or doze': 2,
      'In total, how long did you nap or doze?': '1 hour',
      'How many drinks containing alcohol did you have?': 2,
      'What time was your last alcohol drink?': 'Was three days ago',
      'How many caffeinated drinks (coffee, tea, soda, energy drinks) did you have?': 0,
      'What time was your last caffeinated drink?': null,
      'Did you take any over-the-counter or prescription medication(s) to help you sleep?': false,
      'If so, list medication(s), dose, and time taken': null,
      Comments: 'No Comments'
    }
  },
  {
    name: 'Perceived Stress Questionnaire',
    answers: {
      'You feel rested': 'Usually', // ENUM
      'You feel that too many demands are being made on you': 'Usually', // ENUM
      'You have too many things to do': 'Usually', // ENUM
      "You feel you're doing things you really like": 'Usually', // ENUM
      'You fear you may not manage to attain your goals': 'Often', // ENUM
      'You feel calm': 'Often', // ENUM
      'You feel frustrated': 'Some-times', // ENUM
      'You are full of energy': 'Often', // ENUM
      'You feel tense': 'Often', // ENUM
      'Your problems seem to be pilling up': 'Often', // ENUM
      "You feel you're in a hurry": 'Usually', // ENUM
      'You feel safe and protected': 'Usually', // ENUM
      'You have many worries': 'Often', // ENUM
      'You enjoy yourself': 'Usually', // ENUM
      'You are afraid for the future': 'Often', // ENUM
      'You are lighthearted': 'Usually', // ENUM
      'You feel mentally relaxing': 'Often', // ENUM
      'You have trouble relaxing': 'Some-times', // ENUM
      'Yoy have enough time for yourself': 'Often', // ENUM
      'You feel under pressure from deadlines': 'Usually' // ENUM
    }
  },
  {
    name: 'Athens Insomnia Scale',
    answers: {
      'Sleep induction (time it takes you to fall asleep after turning-off the lights)': 'No problem',
      'Awakenings during the night': 'No problem',
      'Final awakening earlier than desired': 'A little earlier',
      'Total sleep duration': 'Slightly insufficient',
      'Overall quality of sleep (no matter how long you slept)': 'Slightly unsatisfactory',
      'Sense of well-being during the day': 'Slightly decreased',
      'Functioning (physical and mental) during the day': 'Slightly decreased',
      'Sleepiness during the day': 'Considerable'
    }
  },
  {
    name: 'International Restless Legs Scale',
    answers: {
      'Overall, how would you rate the RLS discomfort in you legs or arms?': 'Severe', // ENUM
      'Overall, how would you rate the need to move around because of your RLS symptoms?': 'Moderate', // ENUM
      'Overall, how much relief of your RLS arm or leg discomfort did you get from moving around?': 'Either complete or almost complete relief', // ENUM
      'How severe was your sleep disturbance due to your RLS symptoms?': 'Moderate', // ENUM
      'How severe was your tiredness or sleepiness during the day to your RLS symptoms?': 'Mild', // ENUM
      'How severe was your RLS as a whole?': 'Moderate', // ENUM
      'How often did you get RLS symptoms?': 'Sometimes (This means 2 to 3 days a week)', // ENUM
      'When you had RLS symptoms, how severe were they on average?': 'Moderate (This means 1 to 3 hours per day 24 hour day)', // ENUM
      'Overall, how severe was the impact of your RLS symptoms on your ability to carry out your daily affairs, for example carrying out a satisfactory family, home, social, school or work life?': 'Mild', // ENUM
      'How severe was your mood disturbance due to your RLS symptoms - for example angry, depressed, sad, anxious or irritable?': 'Moderate' // ENUM
    }
  },
  {
    name: 'Insomnia Severity Index',
    answers: {
      'Difficulty falling asleep': 'Mild', // ENUM
      'Difficulty staying asleep': 'Moderate', // ENUM
      'Problems waking up too early': 'Moderate', // ENUM
      'How SATISFIED/DISSATISFIED are you with your CURRENT sleep pattern?': 'Moderately Satisfied', // ENUM
      'How NOTICEABLE to others do you think you sleep problem is in terms of impairing the quality of your life?': 'A little', // ENUM
      'How WORRIED/DISTRESSED are you about your current sleep problem?': 'Somewhat', // ENUM
      'To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, etc.) CURRENTLY?': 'A little' // ENUM
    }
  }
]

export {
  fakeInputUser,
  fakeResponseUser,
  fakeUser,
  fakeUpdateUser,
  fakerString,
  fakerNumber,
  fakerSession,
  correctAnswers
}
