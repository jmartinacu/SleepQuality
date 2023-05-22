const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const questionnaires = [
  {
    name: 'Consensus Sleep Diary',
    questions: {
      'What time did you get into bed?': 'PRIMARY_TEXT',
      'What did you you try to go to sleep?': 'PRIMARY_TEXT',
      'How long did it take you to fall asleep?': 'PRIMARY_TEXT',
      'How many times did you wake up, not counting your final awakening?': 'PRIMARY_NUMBER',
      'In total, how long did these awakenings last?': 'PRIMARY_NUMBER',
      'What time was your final awakening?': 'PRIMARY_TEXT',
      'After your final awakening, how long did you spend in bed trying to sleep?': 'PRIMARY_NUMBER',
      'Did you wake up earlier than you planed?': 'PRIMARY_BOOL',
      'If yes, how much earlier?': 'SECONDARY_NUMBER',
      'What time did you get out of bed for the day?': 'PRIMARY_TEXT',
      'In total, how long did you sleep?': 'PRIMARY_NUMBER',
      'How would you rate the quality of your sleep?': 'PRIMARY_TEXT',
      'How rested or refreshed did you feel when you woke-up for the day?': 'PRIMARY_TEXT',
      'How many times did you nap or doze': 'PRIMARY_NUMBER',
      'In total, how long did you nap or doze?': 'SECONDARY_NUMBER',
      'How many drinks containing alcohol did you have?': 'PRIMARY_NUMBER',
      'What time was your last alcohol drink?': 'SECONDARY_TEXT',
      'How many caffeinated drinks (coffee, tea, soda, energy drinks) did you have?': 'PRIMARY_NUMBER',
      'What time was your last caffeinated drink?': 'SECONDARY_TEXT',
      'Did you take any over-the-counter or prescription medication(s) to help you sleep?': 'PRIMARY_BOOL',
      'If so, list medication(s), dose, and time taken': 'SECONDARY_TEXT',
      Comments: 'SECONDARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [11],
        enum: ['Very poor', 'Poor', 'Fair', 'Good', 'Very good']
      },
      {
        questions: [12],
        enum: ['Not at all rested', 'Slightly rested', 'Somewhat rested', 'Well-rested', 'Very well-rested']
      }
    ]
  },
  {
    name: 'STOP-BANG',
    questions: {
      'Snoring? Do you Snore Loudly (loud enough to be heard through closed doors or your bed-partner-elbows you for snoring at night)?': 'PRIMARY_BOOL',
      'Tired? Do you often feel Tired, Fatigued, or Sleepy during the daytime (such as falling asleep during driving or talking to someone)?': 'PRIMARY_BOOL',
      'Observed? Has anyone Observed you Stop Breathing or Choking/Gasping during your sleep?': 'PRIMARY_BOOL',
      'Pressure? Do you have or are being treated for High Blood Pressure?': 'PRIMARY_BOOL',
      'Body Mass Index more than 35 kg/m^2?': 'PRIMARY_BOOL',
      'Age older than 50?': 'PRIMARY_BOOL',
      'Neck size large? (Measured around Adams Apple) is your shirt collar 16 inches / 40 cm larger?': 'PRIMARY_BOOL',
      'Gender = Male?': 'PRIMARY_BOOL'
    },
    additionalInformation: [
      {
        questions: [4, 5, 7],
        default: true
      }
    ]
  },
  {
    name: 'Epworth Sleepiness Scale',
    questions: {
      'Sitting and reading': 'PRIMARY_NUMBER',
      'Sitting and watching TV or a video': 'PRIMARY_NUMBER',
      'Sitting in a classroom at school during the morning': 'PRIMARY_NUMBER',
      'Sitting and riding in a car or bus for about half an hour': 'PRIMARY_NUMBER',
      'Lying down to rest or nap in the afternoon': 'PRIMARY_NUMBER',
      'Sitting and talking to someone': 'PRIMARY_NUMBER',
      'Sitting quietly by yourself after lunch': 'PRIMARY_NUMBER',
      'Sitting and eating a meal': 'PRIMARY_NUMBER'
    },
    additionalInformation: [
      {
        questions: [0, 1, 2, 3, 4, 5, 6, 7],
        relation: {
          'Would never fall asleep': 0,
          'Slight chance of falling asleep': 1,
          'Moderate chance of falling asleep': 2,
          'High chance of falling asleep': 3
        }
      }
    ]
  },
  {
    name: 'Pittsburgh Sleep Quality Index',
    questions: {
      'During the past month, what time have you usually gone to bed at night?': 'PRIMARY_TEXT',
      'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?': 'PRIMARY_NUMBER',
      'During the past month, what time have you usually gotten up in the morning?': 'PRIMARY_TEXT',
      'During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spent in bed.)': 'PRIMARY_NUMBER',
      'Cannot get to sleep within 30 minutes': 'PRIMARY_TEXT',
      'Wake up in the middle of the night or early morning': 'PRIMARY_TEXT',
      'Have to get up to use the bathroom': 'PRIMARY_TEXT',
      'Cannot breathe comfortably': 'PRIMARY_TEXT',
      'Cough or snore loudly': 'PRIMARY_TEXT',
      'Feel too cold': 'PRIMARY_TEXT',
      'Feel too hot': 'PRIMARY_TEXT',
      'Have bad dreams': 'PRIMARY_TEXT',
      'Have pain': 'PRIMARY_TEXT',
      'Other reason(s), please describe:': 'SECONDARY_TEXT',
      'During the past month, how often have you taken medicine to help you sleep (prescribed or "over the counter")?': 'PRIMARY_TEXT',
      'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?': 'PRIMARY_TEXT',
      'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?': 'PRIMARY_TEXT',
      'During the past month, how would you rate your sleep quality overall?': 'PRIMARY_TEXT',
      'Do you have a bed partner or room mate': 'PRIMARY_TEXT',
      'Loud snoring': 'SECONDARY_TEXT',
      'Long pauses between breaths while asleep': 'SECONDARY_TEXT',
      'Legs twitching or jerking while you sleep': 'SECONDARY_TEXT',
      'Episodes of disorientation or confusion during sleep': 'SECONDARY_TEXT',
      'Other restlessness while you sleep, please describe:': 'SECONDARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15],
        description: 'During the past month, how often have you had trouble sleeping because you...',
        enum: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week'],
        relation: {
          'Not during the past month': 0,
          'Less than once a week': 1,
          'Once or twice a week': 2,
          'Three or more times a week': 3
        }
      },
      {
        questions: [16],
        descriptions: '',
        enum: ['No problem at all', 'Only a very slight problem', 'Somewhat of a problem', 'A very big problem']
      },
      {
        questions: [17],
        enum: ['Very good', 'Fairly good', 'Fairly bad', 'Very bad'],
        relation: {
          'Very good': 0,
          'Fairly good': 1,
          'Fairly bad': 2,
          'Very bad': 3
        }
      },
      {
        questions: [18],
        descriptions: '',
        enum: ['Not bed partner or room mate', 'Partner/room mate in other room', 'Partner in same room but not same bed', 'partner in same bed']
      },
      {
        questions: [19, 20, 21, 22],
        descriptions: 'If you have a room mate or bed partner, ask him/her how often in the past month you have had:',
        enum: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']
      }
    ]
  },
  {
    name: 'Perceived Stress Questionnaire',
    questions: {
      'You feel rested': 'PRIMARY_TEXT',
      'You feel that too many demands are being made on you': 'PRIMARY_TEXT',
      'You have too many things to do': 'PRIMARY_TEXT',
      "You feel you're doing things you really like": 'PRIMARY_TEXT',
      'You fear you may not manage to attain your goals': 'PRIMARY_TEXT',
      'You feel calm': 'PRIMARY_TEXT',
      'You feel frustrated': 'PRIMARY_TEXT',
      'You are full of energy': 'PRIMARY_TEXT',
      'You feel tense': 'PRIMARY_TEXT',
      'Your problems seem to be pilling up': 'PRIMARY_TEXT',
      "You feel you're in a hurry": 'PRIMARY_TEXT',
      'You feel safe and protected': 'PRIMARY_TEXT',
      'You have many worries': 'PRIMARY_TEXT',
      'You enjoy yourself': 'PRIMARY_TEXT',
      'You are afraid for the future': 'PRIMARY_TEXT',
      'You are lighthearted': 'PRIMARY_TEXT',
      'You feel mentally relaxing': 'PRIMARY_TEXT',
      'You have trouble relaxing': 'PRIMARY_TEXT',
      'Yoy have enough time for yourself': 'PRIMARY_TEXT',
      'You feel under pressure from deadlines': 'PRIMARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        enum: ['Almost never', 'Some-times', 'Often', 'Usually'],
        relation: {
          'Almost never': 0,
          'Some-times': 1,
          Often: 2,
          Usually: 3
        }
      }
    ]
  },
  {
    name: 'Athens Insomnia Scale',
    questions: {
      'Sleep induction (time it takes you to fall asleep after turning-off the lights)': 'PRIMARY_TEXT',
      'Awakenings during the night': 'PRIMARY_TEXT',
      'Final awakening earlier than desired': 'PRIMARY_TEXT',
      'Total sleep duration': 'PRIMARY_TEXT',
      'Overall quality of sleep (no matter how long you slept)': 'PRIMARY_TEXT',
      'Sense of well-being during the day': 'PRIMARY_TEXT',
      'Functioning (physical and mental) during the day': 'PRIMARY_TEXT',
      'Sleepiness during the day': 'PRIMARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [0],
        enum: ['No problem', 'Slightly delayed', 'Markedly delayed', 'Very delayed or did not sleep at all'],
        relation: {
          'No problem': 0,
          'Slightly delayed': 1,
          'Markedly delayed': 2,
          'Very delayed or did not sleep at all': 3
        }
      },
      {
        questions: [1],
        enum: ['No problem', 'Minor problem', 'Considerable problem', 'Serious problem or did not sleep at all'],
        relation: {
          'No problem': 0,
          'Minor problem': 1,
          'Considerable problem': 2,
          'Serious problem or did not sleep at all': 3
        }
      },
      {
        questions: [2],
        enum: ['No earlier', 'A little earlier', 'Markedly earlier', 'Much earlier or did not sleep at all'],
        relation: {
          'No earlier': 0,
          'A little earlier': 1,
          'Markedly earlier': 2,
          'Much earlier or did not sleep at all': 3
        }
      },
      {
        questions: [3],
        enum: ['Sufficient', 'Slightly insufficient', 'Markedly insufficient', 'Very insufficient or did not sleep at all'],
        relation: {
          Sufficient: 0,
          'Slightly insufficient': 1,
          'Markedly insufficient': 2,
          'Very insufficient or did not sleep at all': 3
        }
      },
      {
        questions: [4],
        enum: ['Satisfactory', 'Slightly unsatisfactory', 'Markedly unsatisfactory', 'Very unsatisfactory or did not sleep at all'],
        relation: {
          Satisfactory: 0,
          'Slightly unsatisfactory': 1,
          'Markedly unsatisfactory': 2,
          'Very unsatisfactory or did not sleep at all': 3
        }
      },
      {
        questions: [5, 6],
        enum: ['Normal', 'Slightly decreased', 'Markedly decreased', 'Very decreased'],
        relation: {
          Normal: 0,
          'Slightly decreased': 1,
          'Markedly decreased': 2,
          'Very decreased': 3
        }
      },
      {
        questions: [7],
        enum: ['None', 'Mild', 'Considerable', 'Intense'],
        relation: {
          None: 0,
          Mild: 1,
          Considerable: 2,
          Intense: 3
        }
      }
    ]
  },
  {
    name: 'International Restless Legs Scale',
    questions: {
      'Overall, how would you rate the RLS discomfort in you legs or arms?': 'PRIMARY_TEXT',
      'Overall, how would you rate the need to move around because of your RLS symptoms?': 'PRIMARY_TEXT',
      'Overall, how much relief of your RLS arm or leg discomfort did you get from moving around?': 'PRIMARY_TEXT',
      'How severe was your sleep disturbance due to your RLS symptoms?': 'PRIMARY_TEXT',
      'How severe was your tiredness or sleepiness during the day to your RLS symptoms?': 'PRIMARY_TEXT',
      'How severe was your RLS as a whole?': 'PRIMARY_TEXT',
      'How often did you get RLS symptoms?': 'PRIMARY_TEXT',
      'When you had RLS symptoms, how severe were they on average?': 'PRIMARY_TEXT',
      'Overall, how severe was the impact of your RLS symptoms on your ability to carry out your daily affairs, for example carrying out a satisfactory family, home, social, school or work life?': 'PRIMARY_TEXT',
      'How severe was your mood disturbance due to your RLS symptoms - for example angry, depressed, sad, anxious or irritable?': 'PRIMARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [0, 1, 3, 4, 5, 8, 9],
        enum: ['Very severe', 'Severe', 'Moderate', 'Mild', 'None'],
        relation: {
          'Very severe': 4,
          Severe: 3,
          Moderate: 2,
          Mild: 1,
          None: 0
        }
      },
      {
        questions: [2],
        enum: ['No relief', 'Mild relief', 'Moderate relief', 'Either complete or almost complete relief', 'No RLS symptoms to be relieved'],
        relation: {
          'No relief': 4,
          'Mild relief': 3,
          'Moderate relief': 2,
          'Either complete or almost complete relief': 1,
          'No RLS symptoms to be relieved': 0
        }
      },
      {
        questions: [6],
        enum: ['Very often (This means 6 to 7 days a week)', 'Often (this means 4 to 5 days a week)', 'Sometimes (This means 2 to 3 days a week)', 'Occasionally (This means 1 day a week)', 'Never'],
        relation: {
          'Very often (This means 6 to 7 days a week)': 4,
          'Often (this means 4 to 5 days a week)': 3,
          'Sometimes (This means 2 to 3 days a week)': 2,
          'Occasionally (This means 1 day a week)': 1,
          Never: 0
        }
      },
      {
        questions: [7],
        enum: ['Very severe (This means 8 hours or more per 24 hour day)', 'Severe (this means 3 to 8 hours per 24 hour day)', 'Moderate (This means 1 to 3 hours per day 24 hour day)', 'Mild (This means less than 1 hour per 24 hour day)', 'None'],
        relation: {
          'Very severe (This means 8 hours or more per 24 hour day)': 4,
          'Severe (this means 3 to 8 hours per 24 hour day)': 3,
          'Moderate (This means 1 to 3 hours per day 24 hour day)': 2,
          'Mild (This means less than 1 hour per 24 hour day)': 1,
          None: 0
        }
      }
    ]
  },
  {
    name: 'Insomnia Severity Index',
    questions: {
      'Difficulty falling asleep': 'PRIMARY_TEXT',
      'Difficulty staying asleep': 'PRIMARY_TEXT',
      'Problems waking up too early': 'PRIMARY_TEXT',
      'How SATISFIED/DISSATISFIED are you with your CURRENT sleep pattern?': 'PRIMARY_TEXT',
      'How NOTICEABLE to others do you think you sleep problem is in terms of impairing the quality of your life?': 'PRIMARY_TEXT',
      'How WORRIED/DISTRESSED are you about your current sleep problem?': 'PRIMARY_TEXT',
      'To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, etc.) CURRENTLY?': 'PRIMARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [0, 1, 2],
        enum: ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'],
        relation: {
          None: 0,
          Mild: 1,
          Moderate: 2,
          Severe: 3,
          'Very Severe': 4
        }
      },
      {
        questions: [3],
        enum: ['Very Satisfied', 'Satisfied', 'Moderately Satisfied', 'Dissatisfied', 'Very Dissatisfied'],
        relation: {
          'Very Satisfied': 0,
          Satisfied: 1,
          'Moderately Satisfied': 2,
          Dissatisfied: 3,
          'Very Dissatisfied': 4
        }
      },
      {
        questions: [4],
        enum: ['No at all Noticeable', 'A little', 'Somewhat', 'Much', 'Very Much Noticeable'],
        relation: {
          'No at all Noticeable': 0,
          'A little': 1,
          Somewhat: 2,
          Much: 3,
          'Very Much Noticeable': 4
        }
      },
      {
        questions: [5],
        enum: ['No at all Worried', 'A little', 'Somewhat', 'Much', 'Very Much Worried'],
        relation: {
          'No at all Worried': 0,
          'A little': 1,
          Somewhat: 2,
          Much: 3,
          'Very Much Worried': 4
        }
      },
      {
        questions: [6],
        enum: ['No at all Interfering', 'A little', 'Somewhat', 'Much', 'Very Much Interfering'],
        relation: {
          'No at all Interfering': 0,
          'A little': 1,
          Somewhat: 2,
          Much: 3,
          'Very Much Interfering': 4
        }
      }
    ]
  }
]

async function main () {
  await prisma.answer.deleteMany()
  await prisma.user.deleteMany()
  await prisma.questionnaire.deleteMany()
  // TODO: HASH ADMIN PASSWORD
  // IDEA ELIMINAR LA CREACION DEL ADMIN DE AQUI Y LUEGO CREAR EL ADMIN USANDO LA
  // UTILIDAD FASTIFY.INJECT
  const admin = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'Admin',
      birth: new Date(),
      role: 'ADMIN',
      gender: 'NEUTER',
      height: 3,
      weight: 100,
      password: 'f^4p#XS71BtqLQrvtT&',
      BMI: 100,
      verified: true,
      chronicDisorders: ''
    }
  })

  console.log({ admin })

  const questionnaireDB = await prisma.questionnaire.createMany({
    data: questionnaires
  })
  console.log(questionnaireDB)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
