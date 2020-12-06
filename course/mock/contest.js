import Mock from 'mockjs'
import shuffle from 'lodash/shuffle'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import { API_CONTEST_PREFIX, API_CONTEST_QUESTIONS_PREFIX } from '../src/url-prefixes'

const studentMatchHistory = [
  {
    matchId: 1,
    contestId: 1,
    timeStamp: Date.now(),
    courseId: 1,
    title: 'haha',
    participantNumber: 3,
    startTime: Date.now(),
    endTime: Date.now(),
    chapter: 3,
    description: 'sdgsdfgsdfgsdfsdf',
    rank: 3,
    score: 10,
  },
  {
    matchId: 2,
    contestId: 2,
    timeStamp: Date.now(),
    courseId: 2,
    title: 'haha',
    participantNumber: 3,
    startTime: Date.now(),
    endTime: Date.now(),
    chapter: 3,
    description: 'sdgsdfgsdfgsdfsdf',
    rank: 3,
    score: 10,
  },
  {
    matchId: 3,
    contestId: 3,
    timeStamp: Date.now(),
    courseId: 3,
    title: 'haha',
    participantNumber: 3,
    startTime: Date.now(),
    endTime: Date.now(),
    chapter: 3,
    description: 'sdgsdfgsdfgsdfsdf',
    rank: 3,
    score: 10,
  },
]

const studentMatchDetail = Mock.mock({
  userId: 1,
  contestId: '@integer',
  matchId: 1,
  courseId: '@integer',
  timeStamp: Date.now(),
  title: '@ctitle',
  publisherId: '@integer',
  participantNumber: 3,
  startTime: Date.now(),
  endTime: Date.now(),
  'chapter|1-10': 1,
  description: '@csentence',
  rank: 2,
  'score|1-20': 1,
  participants: [
    {
      userId: '@integer',
      nickname: '@cname',
      avatar: '@image',
      rank: 2,
    },
    {
      userId: 1,
      nickname: '@cname',
      avatar: '@image',
      rank: 1,
    },
    {
      userId: '@integer',
      nickname: '@cname',
      avatar: '@image',
      rank: 3,
    },
  ],
  questionAndAnswers: [
    {
      question: {
        questionId: '@integer',
        questionType: 0,
        'questionChapter|1-10': 0,
        questionContent: '@cparagraph',
        questionAnswer: 'A',
        questionChoiceAContent: '@csentence',
        questionChoiceBContent: '@csentence',
        questionChoiceCContent: '@csentence',
        questionChoiceDContent: '@csentence',
      },
      answer: 'A',
    },
    {
      question: {
        questionId: '@integer',
        questionType: 0,
        'questionChapter|1-10': 0,
        questionContent: '@csentence',
        questionAnswer: 'B',
        questionChoiceAContent: '@csentence',
        questionChoiceBContent: '@csentence',
        questionChoiceCContent: '@csentence',
        questionChoiceDContent: '@csentence',
      },
      answer: 'C',
    },
    {
      question: {
        questionId: '@integer',
        questionType: 0,
        'questionChapter|1-10': 0,
        questionContent: '@csentence',
        questionAnswer: 'C',
        questionChoiceAContent: '@csentence',
        questionChoiceBContent: '@csentence',
        questionChoiceCContent: '@csentence',
        questionChoiceDContent: '@csentence',
      },
      answer: 'C',
    },
    {
      question: {
        questionId: '@integer',
        questionType: 0,
        'questionChapter|1-10': 0,
        questionContent: '@csentence',
        questionAnswer: 'D',
        questionChoiceAContent: '@csentence',
        questionChoiceBContent: '@csentence',
        questionChoiceCContent: '@csentence',
        questionChoiceDContent: '@csentence',
      },
      answer: 'B',
    },
    {
      question: {
        questionId: '@integer',
        questionType: 1,
        'questionChapter|1-10': 0,
        questionContent: '@csentence',
        questionAnswer: 'ABC',
        questionChoiceAContent: '@cparagraph',
        questionChoiceBContent: '@csentence',
        questionChoiceCContent: '@csentence',
        questionChoiceDContent: '@csentence',
      },
      answer: 'AC',
    },
  ],
})

let currentContest = {}

const questions = (function () {
  const res = []
  const options = ['A', 'B', 'C', 'D']
  const QUESTION_COUNT = 176
  const random = Mock.Random
  for (let i = 0; i < QUESTION_COUNT; ++i) {
    const questionType = random.natural(0, 1)

    let questionAnswer = ''
    if (!questionType) {
      questionAnswer = options[random.natural(0, options.length - 1)]
    } else {
      const answerCnt = random.natural(2, options.length)
      questionAnswer = shuffle(options).slice(0, answerCnt).join('')
    }

    res.push(
      Mock.mock({
        questionId: '@id',
        questionType,
        'questionChapter|1-10': 1,
        questionContent: '@csentence',
        questionAnswer,
        questionChoiceAContent: '@csentence',
        questionChoiceBContent: '@csentence',
        questionChoiceCContent: '@csentence',
        questionChoiceDContent: '@csentence',
      }),
    )
  }

  return res
})()

const students = (function () {
  const res = []
  const STUDENTS_COUNT = 67
  for (let i = 0; i < STUDENTS_COUNT; ++i) {
    res.push(
      Mock.mock({
        userId: '@id',
        email: '@email',
        personal_id: '@id',
        realname: '@cname',
        nickname: '@cname',
        avatar: '@image',
        universityId: '@id',
        schoolId: '@id',
      }),
    )
  }

  return res
})()

const contests = (function () {
  const res = []
  const CONTESTS_COUNT = 8
  const timeStr = new Date().toISOString()

  for (let i = 0; i < CONTESTS_COUNT; ++i) {
    res.push(
      Mock.mock({
        contestId: '@id',
        courseId: 1,
        publisherId: '@id',
        title: '@ctitle',
        'participantNumber|2-4': 1,
        startTime: timeStr,
        endTime: timeStr,
        'chapter|1-10': 1,
        description: '@cparagraph',
      }),
    )
  }

  return res
})()

const matches = (function () {
  const res = []
  const random = Mock.Random
  const timeStr = new Date().toISOString()
  contests.forEach((contest) => {
    const { participantNumber } = contest

    const matchesCount = random.natural(10, 40)

    for (let i = 0; i < matchesCount; ++i) {
      const participants = shuffle(students).slice(0, participantNumber)
      const scores = new Array(participantNumber)
        .fill(null)
        .map(() => random.natural(0, 20))
        .sort()
        .reverse()

      res.push(
        Mock.mock({
          ...contest,
          matchId: '@id',
          timeStamp: timeStr,
          participants: participants.map((p, index) => ({
            ...p,
            rank: index + 1,
            score: scores[index],
          })),
        }),
      )
    }
  })

  return res
})()

export default {
  [`GET ${API_CONTEST_PREFIX}/matches/:matchId`]: studentMatchDetail,
  [`GET ${API_CONTEST_PREFIX}/matches`]: studentMatchHistory,
  [`GET ${API_CONTEST_PREFIX}/contest`]: (req, res) => {
    const contest = omit(currentContest, ['questions'])

    res.json(contest)
  },
  [`GET ${API_CONTEST_QUESTIONS_PREFIX}/questions`]: (req, res) => {
    let { pageSize, pageNum, questionType } = req.query

    pageSize = +pageSize
    pageNum = +pageNum

    const attrs = ['questionId', 'questionType', 'questionChapter', 'questionContent']

    let resQuestions = questions
    let total = resQuestions.length

    if (questionType) {
      questionType = +questionType

      resQuestions = resQuestions.filter((q) => q.questionType === questionType)
      total = resQuestions.length
    }

    resQuestions = resQuestions
      .slice((pageNum - 1) * pageSize, Math.min(pageNum * pageSize, resQuestions.length))
      .map((q) => pick(q, attrs))

    res.json({
      questions: resQuestions,
      pagination: {
        pageSize,
        pageNum,
        total,
      },
    })
  },
  [`GET ${API_CONTEST_QUESTIONS_PREFIX}/question/:questionType/:questionId`]: (req, res) => {
    const { questionId } = req.params

    const question = questions.find((q) => q.questionId === questionId)

    res.json(question)
  },
  [`DELETE ${API_CONTEST_QUESTIONS_PREFIX}/question/:questionType/:questionId`]: (req, res) => {
    const { questionId } = req.params

    const targetQuestionIndex = questions.findIndex((q) => q.questionId === questionId)

    if (targetQuestionIndex !== -1) {
      questions.splice(targetQuestionIndex, 1)
    }

    res.json({ message: 'OK' })
  },
  [`PUT ${API_CONTEST_QUESTIONS_PREFIX}/question/:questionType/:questionId`]: (req, res) => {
    const { questionId } = req.params
    const data = req.body

    const targetQuestionIndex = questions.findIndex((q) => q.questionId === questionId)

    let targetQuestion = {}

    if (targetQuestionIndex !== -1) {
      targetQuestion = questions[targetQuestionIndex]
      questions[targetQuestionIndex] = {
        ...targetQuestion,
        ...omit(data, ['questionId']),
      }
    }

    res.json(targetQuestion)
  },
  [`POST ${API_CONTEST_QUESTIONS_PREFIX}/question`]: (req, res) => {
    const data = req.body
    const newQuestion = {
      ...data.question,
      questionId: Mock.mock('@id'),
    }

    questions.push(newQuestion)
    res.json(newQuestion)
  },
  [`POST ${API_CONTEST_PREFIX}/contest`]: (req, res) => {
    const { contest } = req.body

    let contestQuestions = null

    if (contest.randomQuestions) {
      contestQuestions = shuffle(questions).slice(0, 5)
    } else {
      contestQuestions = contest.questions.map(({ questionId }) =>
        questions.find((q) => q.questionId === questionId),
      )
    }

    currentContest = {
      ...omit(contest, ['randomQuestions', 'questions']),
      questions: contestQuestions,
      publisherId: 1,
    }

    res.json({ message: 'ok' })
  },
  [`GET ${API_CONTEST_PREFIX}/contest/all`]: { contests },
  [`GET ${API_CONTEST_PREFIX}/students`]: (req, res) => {
    let { pageSize, pageNum } = req.query

    pageSize = +pageSize
    pageNum = +pageNum

    res.json({
      students: students.slice(
        (pageNum - 1) * pageSize,
        Math.min(pageNum * pageSize, students.length),
      ),
      pagination: {
        pageNum,
        pageSize,
        total: students.length,
      },
    })
  },
  [`GET ${API_CONTEST_PREFIX}/matchesByContest`]: (req, res) => {
    /* eslint-disable-next-line */
    let { pageSize, pageNum, contestId } = req.query

    pageSize = +pageSize
    pageNum = +pageNum

    const contestMatches = matches.filter((m) => m.contestId === contestId)

    res.json({
      matches: contestMatches.slice(
        (pageNum - 1) * pageSize,
        Math.min(pageNum * pageSize, contestMatches.length),
      ),
      pagination: {
        pageNum,
        pageSize,
        total: contestMatches.length,
      },
    })
  },
  [`GET ${API_CONTEST_PREFIX}/matchesByStudent`]: (req, res) => {
    const { studentId } = req.query

    const student = students.find((s) => s.userId === studentId)
    const studentMatches = matches.filter((match) =>
      match.participants.map((p) => p.userId).includes(studentId),
    )

    res.json({
      student,
      matches: studentMatches.map((m) => ({
        ...omit(m, ['participants']),
        ...pick(
          m.participants.find((p) => p.userId === studentId),
          ['rank', 'score'],
        ),
      })),
    })
  },
}
