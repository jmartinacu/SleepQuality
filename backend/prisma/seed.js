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
      'Did you take any over-the-counter or prescription medication(s) to help you sleep': 'PRIMARY_BOOL',
      'If so, list medication(s), dose, and time taken': 'SECONDARY_TEXT',
      Comments: 'SECONDARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [12],
        enum: ['Very poor', 'Poor', 'Fair', 'Good', 'Very good']
      },
      {
        questions: [13],
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
      // PREGUNTAR POR LA PREGUNTA DE ABAJO POR QUE LA PODEMOS CALCULAR AUTOMÁTICAMENTE
      'Body Mass Index more than 35 kg/m^2?': 'PRIMARY_BOOL',
      'Age older than 50?': 'PRIMARY_BOOL',
      'Neck size large? (Measured around Adams Apple) is your shirt collar 16 inches / 40 cm larger?': 'PRIMARY_BOOL',
      'Gender = Male?': 'PRIMARY_BOOL'
    }
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
    }
  },
  {
    name: 'Pittsburgh Sleep Quality Index',
    questions: {
      'During the past month, what time have you usually gone to bed at night?': 'PRIMARY_TEXT',
      'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?': 'PRIMARY_NUMBER',
      'During the past month, what time have you usually gotten up in the morning?': 'PRIMARY_NUMBER',
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
      'Other reason(s), please describe:': 'PRIMARY_TEXT',
      'During the past month, how often have you taken medicine to help you sleep (prescribed or "over the counter")?': 'PRIMARY_NUMBER',
      'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?': 'PRIMARY_NUMBER',
      'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?': 'PRIMARY_TEXT',
      'During the past month, how would you rate your sleep quality overall?': 'PRIMARY_TEXT',
      'Do you have a bed partner or room mate': 'PRIMARY_TEXT',
      'Loud snoring': 'SECONDARY_TEXT',
      'Long pauses between breaths while asleep': 'SECONDARY_TEXT',
      'Legs twitching or jerking while you sleep': 'SECONDARY_TEXT',
      'Episodes of disorientation or confusion during sleep': 'SECONDARY_TEXT',
      'Other restlessness while you sleep, please describe:': 'PRIMARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16],
        description: 'During the past month, how often have you had trouble sleeping because you...',
        enum: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Once or twice a week', 'Three or more times a week']
      },
      {
        questions: [17],
        descriptions: '',
        enum: ['No problem at all', 'Only a very slight problem', 'Somewhat of a problem', 'A very big problem']
      },
      {
        questions: [18],
        descriptions: '',
        enum: ['Very good', 'Fairly good', 'Fairly bad', 'Very bad']
      },
      {
        questions: [19],
        descriptions: '',
        enum: ['Not bed partner or room mate', 'Partner/room mate in other room', 'Partner in same room but not same bed', 'partner in same bed']
      },
      {
        questions: [20, 21, 22, 23],
        descriptions: 'If you have a room mate or bed partner, ask him/her how often in the past month you have had:',
        enum: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']
      }
    ]
  },
  {
    name: 'Perceived Stress Questionnaire',
    questions: {
      'You feel rested': 'PRIMARY_NUMBER',
      'You feel that too many demands are being made on you': 'PRIMARY_NUMBER',
      'You have too many things to do': 'PRIMARY_NUMBER',
      "You feel you're doing things you really like": 'PRIMARY_NUMBER',
      'You fear you may not manage to attain your goals': 'PRIMARY_NUMBER',
      'You feel calm': 'PRIMARY_NUMBER',
      'You feel frustrated': 'PRIMARY_NUMBER',
      'You are full of energy': 'PRIMARY_NUMBER',
      'You feel tense': 'PRIMARY_NUMBER',
      'Your problems seem to be pilling up': 'PRIMARY_NUMBER',
      "You feel you're in a hurry": 'PRIMARY_NUMBER',
      'You feel safe and protected': 'PRIMARY_NUMBER',
      'You have many worries': 'PRIMARY_NUMBER',
      'You enjoy yourself': 'PRIMARY_NUMBER',
      'You are afraid for the future': 'PRIMARY_NUMBER',
      'You are lighthearted': 'PRIMARY_NUMBER',
      'You feel mentally relaxing': 'PRIMARY_NUMBER',
      'You have trouble relaxing': 'PRIMARY_NUMBER',
      'Yoy have enough time for yourself': 'PRIMARY_NUMBER',
      'You feel under pressure from deadlines': 'PRIMARY_NUMBER'
    },
    additionalInformation: [
      {
        questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        relations: {
          1: 'Almost never',
          2: 'Some-times',
          3: 'Often',
          4: 'Usually'
        }
      }
    ]
  },
  {
    name: 'Athens Insomnia Scale',
    questions: {
      'Sleep induction (time it takes you to fall asleep after turning-off the lights)': 'PRIMARY_NUMBER',
      'Awakenings during the night': 'PRIMARY_NUMBER',
      'Final awakening earlier than desired': 'PRIMARY_NUMBER',
      'Total sleep duration': 'PRIMARY_NUMBER',
      'Overall quality of sleep (no matter how long you slept)': 'PRIMARY_NUMBER',
      'Sense of well-being during the day': 'PRIMARY_NUMBER',
      'Functioning (physical and mental) during the day': 'PRIMARY_NUMBER',
      'Sleepiness during the day': 'PRIMARY_NUMBER'
    },
    additionalInformation: [
      {
        questions: [1],
        relations: {
          0: 'No problem',
          1: 'Slightly delayed',
          2: 'Markedly delayed',
          3: 'Very delayed or did not sleep at all'
        }
      },
      {
        questions: [2],
        relations: {
          0: 'No problem',
          1: 'Minor problem',
          2: 'Considerable problem',
          3: 'Serious problem or did not sleep at all'
        }
      },
      {
        questions: [3],
        relations: {
          0: 'No earlier',
          1: 'A little earlier',
          2: 'Markedly earlier',
          3: 'Much earlier or did not sleep at all'
        }
      },
      {
        questions: [4],
        relations: {
          0: 'Sufficient',
          1: 'Slightly insufficient',
          2: 'Markedly insufficient',
          3: 'Very insufficient or did not sleep at all'
        }
      },
      {
        questions: [5],
        relations: {
          0: 'Satisfactory',
          1: 'Slightly unsatisfactory',
          2: 'Markedly unsatisfactory',
          3: 'Very unsatisfactory or did not sleep at all'
        }
      },
      {
        questions: [6, 7],
        relations: {
          0: 'Normal',
          1: 'Slightly decreased',
          2: 'Markedly decreased',
          3: 'Very decreased'
        }
      },
      {
        questions: [8],
        relations: {
          0: 'None',
          1: 'Mild',
          2: 'Considerable',
          3: 'Intense'
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
        questions: [1, 2, 4, 5, 6, 9, 10],
        enum: ['Very severe', 'Severe', 'Moderate', 'Mild', 'None']
      },
      {
        questions: [3],
        enum: ['No relief', 'Mild relief', 'Moderate relief', 'Either complete or almost complete relief', 'No RLS symptoms to be relieved']
      },
      {
        questions: [7],
        enum: ['Very often (This means 6 to 7 days a week)', 'Often (this means 4 to 5 days a week)', 'Sometimes (This means 2 to 3 days a week)', 'Occasionally (This means 1 day a week)', 'Never']
      },
      {
        questions: [8],
        enum: ['Very severe (This means 8 hours or more per 24 hour day)', 'Severe (this means 3 to 8 hours per 24 hour day)', 'Moderate (This means 1 to 3 hours per day 24 hour day)', 'Mild (This means less than 1 hour per 24 hour day)', 'None']
      }
    ]
  },
  {
    name: 'Insomnia Severity Index',
    questions: {
      'Difficulty falling asleep': 'PRIMARY_NUMBER',
      'Difficulty staying asleep': 'PRIMARY_NUMBER',
      'Problems waking up too early': 'PRIMARY_NUMBER',
      'How SATISFIED/DISSATISFIED are you with your CURRENT sleep pattern?': 'PRIMARY_NUMBER',
      'How NOTICEABLE to others do you think you sleep problem is in terms of impairing the quality of your life?': 'PRIMARY_NUMBER',
      'How WORRIED/DISTRESSED are you about your current sleep problem?': 'PRIMARY_NUMBER',
      'TO what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, etc.) CURRENTLY?': 'PRIMARY_NUMBER'
    },
    additionalInformation: [
      {
        questions: [1, 2, 3],
        relation: {
          0: 'None',
          1: 'Mild',
          2: 'Moderate',
          3: 'Severe',
          4: 'Very Severe'
        }
      },
      {
        questions: [4],
        relation: {
          0: 'Very Satisfied',
          1: 'Satisfied',
          2: 'Moderately Satisfied',
          3: 'Dissatisfied',
          4: 'Very Dissatisfied'
        }
      },
      {
        questions: [5],
        relation: {
          0: 'No at all Noticeable',
          1: 'A little',
          2: 'Somewhat',
          3: 'Much',
          4: 'Very Much Noticeable'
        }
      },
      {
        questions: [6],
        relation: {
          0: 'No at all Worried',
          1: 'A little',
          2: 'Somewhat',
          3: 'Much',
          4: 'Very Much Worried'
        }
      },
      {
        questions: [7],
        relation: {
          0: 'No at all Interfering',
          1: 'A little',
          2: 'Somewhat',
          3: 'Much',
          4: 'Very Much Interfering'
        }
      }
    ]
  }
]

async function main () {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
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

  for (const questionnaire of questionnaires) {
    const questionnaireDB = await prisma.questionnaire.upsert({
      where: { name: questionnaire.name },
      update: {},
      create: questionnaire
    })
    console.log(questionnaireDB)
  }
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
