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
  const birth = '1998-01-15'
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
  return {
    ...rest,
    birth: new Date(birthString),
    verificationCode,
    passwordResetCode,
    verified,
    role,
    profilePicture,
    questionnairesToDo
  }
}

function fakeUpdateUser (): UpdateUserStrictSchema {
  const user = fakeInputUser()
  const roles = ['USER', 'DOCTOR']
  const roleIndex = random(0, 1)
  const role = roles.at(roleIndex) as Role
  const { birth, email, name, password, ...rest } = user
  return {
    ...rest,
    role
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
    userId
  }
}

const correctAnswers = [
  {
    name: 'Consensus Sleep Diary',
    questions: {
      'What time did you get into bed?': 'Around 1 am',
      'What did you you try to go to sleep?': 'I went to sleep very late, at 1:30 am',
      'How long did it take you to fall asleep?': 'I feel asleep in 10 minutes',
      'How many times did you wake up, not counting your final awakening?': 0,
      'In total, how long did these awakenings last?': null,
      'What time was your final awakening?': 'Around 7 am',
      'After your final awakening, how long did you spend in bed trying to sleep?': 0,
      'Did you wake up earlier than you planed?': true,
      'If yes, how much earlier?': 30,
      'What time did you get out of bed for the day?': 'At 7:30 am',
      'In total, how long did you sleep?': 330,
      'How would you rate the quality of your sleep?': 'Good', // ENUM
      'How rested or refreshed did you feel when you woke-up for the day?': 'ENUM', // ENUM
      'How many times did you nap or doze': 2,
      'In total, how long did you nap or doze?': 40,
      'How many drinks containing alcohol did you have?': 2,
      'What time was your last alcohol drink?': 'Was three days ago',
      'How many caffeinated drinks (coffee, tea, soda, energy drinks) did you have?': 0,
      'What time was your last caffeinated drink?': null,
      'Did you take any over-the-counter or prescription medication(s) to help you sleep': false,
      'If so, list medication(s), dose, and time taken': null,
      Comments: 'No Comments'
    }
  },
  {
    name: 'STOP-BANG',
    questions: {
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
    questions: {
      'Sitting and reading': 1,
      'Sitting and watching TV or a video': 2,
      'Sitting in a classroom at school during the morning': 1,
      'Sitting and riding in a car or bus for about half an hour': 2,
      'Lying down to rest or nap in the afternoon': 3,
      'Sitting and talking to someone': 0,
      'Sitting quietly by yourself after lunch': 2,
      'Sitting and eating a meal': 0
    }
  },
  {
    name: 'Pittsburgh Sleep Quality Index',
    questions: {
      'During the past month, what time have you usually gone to bed at night?': 'At 1 am',
      'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?': 20,
      'During the past month, what time have you usually gotten up in the morning?': 7.30,
      'During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spent in bed.)': 5,
      'Cannot get to sleep within 30 minutes': 'Not during the past month', // ENUM
      'Wake up in the middle of the night or early morning': 'Less than once a week', // ENUM
      'Have to get up to use the bathroom': 'Not during the past month', // ENUM
      'Cannot breathe comfortably': 'Not during the past month', // ENUM
      'Cough or snore loudly': 'Not during the past month', // ENUM
      'Feel too cold': 'Not during the past month', // ENUM
      'Feel too hot': 'Not during the past month', // ENUM
      'Have bad dreams': 'Less than once a week', // ENUM
      'Have pain': 'Not during the past month', // ENUM
      'Other reason(s), please describe:': null,
      'During the past month, how often have you taken medicine to help you sleep (prescribed or "over the counter")?': 'Not during the past month', // ENUM
      'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?': 'Not during the past month', // ENUM
      'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?': 'Somewhat of a problem', // ENUM
      'During the past month, how would you rate your sleep quality overall?': 'Fairly good', // ENUM
      'Do you have a bed partner or room mate': 'Not bed partner or room mate', // ENUM
      'Loud snoring': 'SECONDARY_TEXT', // ENUM
      'Long pauses between breaths while asleep': null, // ENUM
      'Legs twitching or jerking while you sleep': null, // ENUM
      'Episodes of disorientation or confusion during sleep': null, // ENUM
      'Other restlessness while you sleep, please describe:': 'I am so sleepy after lunch meal'
    }
  },
  {
    name: 'Perceived Stress Questionnaire',
    questions: {
      'You feel rested': 3,
      'You feel that too many demands are being made on you': 3,
      'You have too many things to do': 3,
      "You feel you're doing things you really like": 3,
      'You fear you may not manage to attain your goals': 2,
      'You feel calm': 2,
      'You feel frustrated': 1,
      'You are full of energy': 2,
      'You feel tense': 2,
      'Your problems seem to be pilling up': 2,
      "You feel you're in a hurry": 3,
      'You feel safe and protected': 3,
      'You have many worries': 2,
      'You enjoy yourself': 3,
      'You are afraid for the future': 2,
      'You are lighthearted': 3,
      'You feel mentally relaxing': 2,
      'You have trouble relaxing': 1,
      'Yoy have enough time for yourself': 2,
      'You feel under pressure from deadlines': 3
    }
  },
  {
    name: 'Athens Insomnia Scale',
    questions: {
      'Sleep induction (time it takes you to fall asleep after turning-off the lights)': 0,
      'Awakenings during the night': 0,
      'Final awakening earlier than desired': 1,
      'Total sleep duration': 1,
      'Overall quality of sleep (no matter how long you slept)': 1,
      'Sense of well-being during the day': 1,
      'Functioning (physical and mental) during the day': 1,
      'Sleepiness during the day': 2
    }
  },
  {
    name: 'International Restless Legs Scale',
    questions: {
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
    questions: {
      'Difficulty falling asleep': 1,
      'Difficulty staying asleep': 2,
      'Problems waking up too early': 2,
      'How SATISFIED/DISSATISFIED are you with your CURRENT sleep pattern?': 2,
      'How NOTICEABLE to others do you think you sleep problem is in terms of impairing the quality of your life?': 1,
      'How WORRIED/DISTRESSED are you about your current sleep problem?': 2,
      'To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, etc.) CURRENTLY?': 1
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
