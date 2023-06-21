const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const questionnaires = [
  {
    name: 'Consensus Sleep Diary Morning',
    questions: {
      'What time did you get into bed?': 'PRIMARY_TEXT',
      'What did you try to go to sleep?': 'PRIMARY_TEXT',
      'How long did it take you to fall asleep (in minutes)?': 'PRIMARY_TEXT',
      'How many times did you wake up, not counting your final awakening?': 'PRIMARY_NUMBER',
      'In total, how long did these awakenings last (in minutes)?': 'PRIMARY_TEXT',
      'What time was your final awakening?': 'PRIMARY_TEXT',
      'After your final awakening, how long did you spend in bed trying to sleep?': 'PRIMARY_TEXT',
      'Did you wake up earlier than you planed?': 'PRIMARY_BOOL',
      'If yes, how much earlier?': 'SECONDARY_TEXT',
      'What time did you get out of bed for the day?': 'PRIMARY_TEXT',
      'In total, how long did you sleep?': 'PRIMARY_TEXT',
      'How would you rate the quality of your sleep?': 'PRIMARY_TEXT',
      'How rested or refreshed did you feel when you woke-up for the day?': 'PRIMARY_TEXT'
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
    ],
    instructions: 'General Instructions:\n\nWhat is a Sleep Diary? A sleep diary is designed to gather information about your daily sleep pattern.\nHow often and when do I fill out the sleep diary? It is necessary for you to complete your sleep diary every day. If possible, the sleep diary should be completed within one hour of getting out of bed in the morning. The Nighttime Sleep Diary can be completed before you go to bed at night.\nWhat should I do if I miss a day? If you forget to fill in the diary or are unable to finish it, leave the diary blank for that day.\nWhat if something unusual affects my sleep or how I feel in the daytime? If your sleep or daytime functioning is affected by some unusual event (such as an illness, or an emergency) you may make brief notes on your diary.\nWhat do the words "bed" and "day" mean on the diary? This diary can be used for people who are awake or asleep at unusual times. In the sleep diary, the word "day" is the time when you choose or are required to be awake. The term "bed" means the place where you usually sleep.\nWill answering these questions about my sleep keep me awake? This is not usually a problem. You should not worry about giving exact times, and you should not watch the clock. Just give your best estimate.\n\nMorning Sleep Diary Item Instructions:\n\nUse the guide below to clarify what is being asked for each item of the Sleep Diary.\n\n1. What time did you get into bed? Write the time that you got into bed. This may not be the time you began "trying" to fall asleep.\n2. What time did you try to go to sleep? Record the time that you began "trying" to fall asleep.\n3. How long did it take you to fall asleep? Beginning at the time you wrote in question 2, how long did it take you to fall asleep.\n4. How many times did you wake up, not counting your final awakening? How many times did you wake up between the time you first fell asleep and your final awakening?\n5. In total, how long did these awakenings last? What was the total time you were awake between the time you first fell asleep and your final awakening. For example, if you woke 3 times for 20 minutes, 35 minutes, and 15 minutes, add them all up (20+35+15= 70 min or 1 hr and 10 min).\n6a. What time was your final awakening? Record the last time you woke up in the morning.\n6b. After your final awakening, how long did you spend in bed trying to sleep? After the last time you woke-up (Item #6a), how many minutes did you spend in bed trying to sleep? For example, if you woke up at 8 am but continued to try and sleep until 9 am, record 1 hour.\n6c. Did you wake up earlier than you planned? If you woke up or were awakened earlier than you planned, check yes. If you woke up at your planned time, check no.\n6d. If yes, how much earlier? If you answered "yes" to question 6c, write the number of minutes you woke up earlier than you had planned on waking up. For example, if you woke up 15 minutes before the alarm went off, record 15 minutes here.\n7. What time did you get out of bed for the day? What time did you get out of bed with no further attempt at sleeping? This may be different from your final awakening time (e.g. you may have wok at 6:35 a.m. but did not get out of bed to start your day until 7:20 a.m.)\n8. In total, how long did you sleep? This should just be your best estimate, based on when you went to bed and woke up, how long it took you to fall asleep, and how long you were awake. You do not need to calculate this by adding and subtracting; just give your best estimate.\n9. How would you rate the quality of your sleep? "Sleep Quality" is your sense of whether your sleep was good or poor.\n10. How restful or refreshed did you feel when you woke up for the day? This refers to how you felt after you were done sleeping for the night, during the first few minutes that you were awake.'
  },
  {
    name: 'Consensus Sleep Diary Night',
    questions: {
      'How many times did you nap or doze': 'PRIMARY_NUMBER',
      'In total, how long did you nap or doze?': 'SECONDARY_TEXT',
      'How many drinks containing alcohol did you have?': 'PRIMARY_NUMBER',
      'What time was your last alcohol drink?': 'SECONDARY_TEXT',
      'How many caffeinated drinks (coffee, tea, soda, energy drinks) did you have?': 'PRIMARY_NUMBER',
      'What time was your last caffeinated drink?': 'SECONDARY_TEXT',
      'Did you take any over-the-counter or prescription medication(s) to help you sleep?': 'PRIMARY_BOOL',
      'If so, list medication(s), dose, and time taken': 'SECONDARY_TEXT',
      Comments: 'SECONDARY_TEXT'
    },
    additionalInformation: [],
    instructions: 'General Instructions:\n\nWhat is a Sleep Diary? A sleep diary is designed to gather information about your daily sleep pattern.\nHow often and when do I fill out the sleep diary? It is necessary for you to complete your sleep diary every day. If possible, the sleep diary should be completed within one hour of getting out of bed in the morning. The Nighttime Sleep Diary can be completed before you go to bed at night.\nWhat should I do if I miss a day? If you forget to fill in the diary or are unable to finish it, leave the diary blank for that day.\nWhat if something unusual affects my sleep or how I feel in the daytime? If your sleep or daytime functioning is affected by some unusual event (such as an illness, or an emergency) you may make brief notes on your diary.\nWhat do the words "bed" and "day" mean on the diary? This diary can be used for people who are awake or asleep at unusual times. In the sleep diary, the word "day" is the time when you choose or are required to be awake. The term "bed" means the place where you usually sleep.\nWill answering these questions about my sleep keep me awake? This is not usually a problem. You should not worry about giving exact times, and you should not watch the clock. Just give your best estimate.\n\nNighttime Sleep Diary Item Instructions:\n\nPlease complete the following items before you go to bed.\n\n11a. How many times did you nap or doze? A nap is a time you decided to sleep during the day, whether in bed or not in bed. "Dozing" is a time you may have nodded off for a few minutes, without meaning to, such as while watching TV. Count all the times you napped or dozed at any time from when you first got out of bed in the morning until you got into bed again at night.\n11b. In total, how long did you nap or doze? Estimate the total amount of time you spent napping or dozing, in hours and minutes. For instance, if you napped twice, once for 30 minutes and once for 60 minutes, and dozed for 10 minutes, you would answer "1 hour 40 minutes." If you did not nap or doze, write "N/A" (not applicable).\n12a. How many drinks containing alcohol did you have? Enter the number of alcoholic drinks you had where 1 drink is defined as one 12 oz beer (can), 5 oz wine, or 1.5 oz liquor (one shot).\n12b. What time was your last drink? If you had an alcoholic drink yesterday, enter the time of day in hours and minutes of your last drink. If you did not have a drink, write "N/A" (not applicable).\n13a. How many caffeinated drinks (coffee, tea, soda, energy drinks) did you have? Enter the number of caffeinated drinks (coffee, tea, soda, energy drinks) you had where for coffee and tea, one drink = 6-8 oz; while for caffeinated soda one drink = 12 oz.\n13b. What time was your last drink? If you had a caffeinated drink, enter the time of day in hours and minutes of your last drink. If you did n have a caffeinated drink, "N/A" (not applicable).\n14. Did you take any over-the-counter or prescription medication(s) to help you sleep? If so, list medication(s), dose, and time taken: List the medication name, how much and when you took EACH different medication you took tonight to help you sleep. Include medication available over the counter, prescription medications, and herbals (example: "Sleepwell 50 mg 11 pm"). If every night is the same, write "same" after the first day.\n15. Comments If you have anything that you would like to say that is relevant to your sleep feel free to write it here.'
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
      'Neck size large? (Measured around Adams Apple) is your shirt collar 40 cm larger?': 'PRIMARY_BOOL',
      'Gender = Male?': 'PRIMARY_BOOL'
    },
    additionalInformation: [
      {
        questions: [4, 5, 7],
        default: true
      }
    ],
    instructions: 'Obstructive sleep apnea (OSA) is the most prevalent sleep-breathing disturbance, affecting 24% of men and 9% of women in the general population.\n\nAn estimated 82% of men and 92% of women with moderate-to severe OSA have not been diagnosed.\n\nSleep Apnea Events:\n\nAs a complete cessation of breathing (apnea) or a marked reduction in airflow (hypopnea) during sleep, and are considered clinically relevant if they last more than 10 s. The episodes of apneas and hypopneas may persist for 30-60s in some individuals.\n\nObstructive Sleep Apnea: \n\n- Repetitive obstruction of the upper airway often resulting in oxygen desaturation and arousals from sleep\n- excessive daytime sleepiness\n- unrefreshing sleep\n- poor concentration\n- fatigue\n\nStop-Bang Item Instruction:\n\n4. Body Mass Index more than 35 kg/m^2? The Body Mass Index is weight in kilograms divided by height in meters squared. '
  },
  {
    name: 'Epworth Sleepiness Scale',
    questions: {
      'Sitting and reading': 'PRIMARY_TEXT',
      'Sitting and watching TV or a video': 'PRIMARY_TEXT',
      'Sitting in a classroom at school during the morning': 'PRIMARY_TEXT',
      'Sitting and riding in a car or bus for about half an hour': 'PRIMARY_TEXT',
      'Lying down to rest or nap in the afternoon': 'PRIMARY_TEXT',
      'Sitting and talking to someone': 'PRIMARY_TEXT',
      'Sitting quietly by yourself after lunch': 'PRIMARY_TEXT',
      'Sitting and eating a meal': 'PRIMARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [0, 1, 2, 3, 4, 5, 6, 7],
        enum: ['Would never fall asleep', 'Slight chance of falling asleep', 'Moderate chance of falling asleep', 'High chance of falling asleep'],
        relation: {
          'Would never fall asleep': 0,
          'Slight chance of falling asleep': 1,
          'Moderate chance of falling asleep': 2,
          'High chance of falling asleep': 3
        }
      }
    ],
    instructions: 'General Instructions:\n\nHow likely are you to doze off or fall asleep in the following situations, in contrast to feeling just tired?\nThis refers to your usual way of life in recent times.\nEven if you haven\'t done some of these things recently try to work out how they would have affected you.'
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
        description: '',
        enum: ['No problem at all', 'Only a very slight problem', 'Somewhat of a problem', 'A very big problem'],
        relation: {
          'No problem at all': 0,
          'Only a very slight problem': 1,
          'Somewhat of a problem': 2,
          'A very big problem': 3
        }
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
        description: '',
        enum: ['Not bed partner or room mate', 'Partner/room mate in other room', 'Partner in same room but not same bed', 'partner in same bed']
      },
      {
        questions: [19, 20, 21, 22],
        description: 'If you have a room mate or bed partner, ask him/her how often in the past month you have had:',
        enum: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week']
      }
    ],
    instructions: 'General Instructions:\n\nThe following questions relate to your usual sleep habits during the past month only. Your answers should indicate the most accurate reply for the majority of days and nights in the past month. Please answer all questions.'
  },
  {
    name: 'Perceived Stress Questionnaire',
    questions: {
      'You feel rested': 'PRIMARY_TEXT',
      'You feel that too many demands are being made on you': 'PRIMARY_TEXT',
      'You have too much to do': 'PRIMARY_TEXT',
      "You feel you're doing things that you really like": 'PRIMARY_TEXT',
      'You fear that you will not be able to achieve your goals': 'PRIMARY_TEXT',
      'You feel calm': 'PRIMARY_TEXT',
      'You feel frustrated': 'PRIMARY_TEXT',
      'You are full of energy': 'PRIMARY_TEXT',
      'You feel tense': 'PRIMARY_TEXT',
      'Your problems seem to be pilling up': 'PRIMARY_TEXT',
      'You feel rushed': 'PRIMARY_TEXT',
      'You feel safe and secure': 'PRIMARY_TEXT',
      'You have many worries': 'PRIMARY_TEXT',
      'You have fun': 'PRIMARY_TEXT',
      'You are afraid of the future': 'PRIMARY_TEXT',
      'You are light hearted': 'PRIMARY_TEXT',
      'You feel mentally exhausted': 'PRIMARY_TEXT',
      'You have trouble relaxing': 'PRIMARY_TEXT',
      'You have enough time for yourself': 'PRIMARY_TEXT',
      'You feel under pressure from deadlines': 'PRIMARY_TEXT'
    },
    additionalInformation: [
      {
        questions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        enum: ['Almost never', 'Sometimes', 'Frequent', 'Mostly'],
        relation: {
          'Almost never': 1,
          Sometimes: 2,
          Frequent: 3,
          Mostly: 4
        }
      }
    ],
    instructions: 'General Instructions:\n\nBelow you will find a series of findings. Please read each one and select from the four responses the one that indicates how often the statement applies to your life in the past 2 weeks. For each observation, please check the box under the answer you have chosen. There are no right or wrong answers. Think please do not think twice and do not leave out any question.'
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
    ],
    instructions: 'General Instructions:\n\nThis scale is intended to record your own assessment of any sleep difficulty you might have experienced. Please, check (by circling the appropriate number) the items below to indicate your estimate of any difficulty, provided that it occurred at least three times per week during the last month.'
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
    ],
    instructions: 'General instructions:\n\nThe IRLS is composed of 10 items. It gives a global score for all 10 items that is most commonly used as an overall severity score. 9 of the 10 items investigate two dimensions of the RLS severity.'
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
    ],
    instructions: 'General instructions:\n\nThe Insomnia Severity Index has seven questions. The seven answers are added up to get a total score.For each question, please CIRCLE the number that best describes your answer.Please rate the CURRENT (i.e. LAST 2 WEEKS) SEVERITY of your insomnia problem(s).'
  }
]

async function main () {
  await prisma.answer.deleteMany()
  await prisma.user.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.session.deleteMany()
  await prisma.questionnaire.deleteMany()
  await prisma.questionnaireAlgorithm.deleteMany()
  await prisma.questionnaire.createMany({
    data: questionnaires
  })
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
