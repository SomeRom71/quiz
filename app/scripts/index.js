import '../styles/main.scss'
import 'magnific-popup'
import '../styles/magnific.scss'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

// eslint-disable-next-line
services__btn.addEventListener( 'click' , function() {
  let element = document.getElementById('main')
  element.classList.add('quiz__start')
  quiz()
})

let quiz = (function () {
  const myQuestions = [
    {
      question: 'Вы являетесь:',
      answers: {
        a: 'Индивидуальным предпринимателем',
        b: 'Юридическим лицом'
      }
    },
    {
      question: 'У вашего бизнеса есть задолженность по налогам?',
      answers: {
        a: 'Да, задолженность имеется',
        b: 'Нет, отсутствует'
      }
    },
    {
      question: 'Как часто в вашем бизнесе необходима помощь юриста?',
      answers: {
        a: 'Требуются ежедневные консультации',
        b: 'Не чаще, чем 1 раз в неделю',
        c: 'Несколько раз в год'
      }
    },
    {
      question: 'Какие услуги Вам необхдимы?',
      answers: {
        a: 'Взыскание задолженности через суд',
        b: 'Устные консультации в офисе',
        c: 'Составление документов (жалобы, претензии)'
      }
    },
    {
      question: 'Как срочно Вам требуется юридическое сопровождение?',
      answers: {
        a: 'Очень срочно',
        b: 'Может подождать',
        с: 'Ищу на будущее'
      }
    }
  ]
  let letter
  function buildQuiz () {
    const output = []
    myQuestions.forEach((currentQuestion, questionNumber) => {
      const answers = []

      for (letter in currentQuestion.answers) {
        answers.push(
          `<label class='question__checkbox__label'>
             <input type='checkbox'>
             <span class='checkmark'></span>
             ${currentQuestion.answers[letter]}
           </label>`
        )
      }
      output.push(
        `<div class='slide'>
           <span>${currentQuestion.question}</span>
           <div class="question__checkbox">
              <div class='answers'> ${answers.join('')} </div>
           </div>
        </div>`
      )
    })

    quizContainer.innerHTML = output.join('')
  }

  function showSlide (n) {
    slides[currentSlide].classList.remove('active-slide')
    slides[n].classList.add('active-slide')
    currentSlide = n
    if (questionCount === 1) {
      discountSum.innerHTML = '0' + ' руб'
    } else {
      discountSum.innerHTML = questionCount * 1000 + ' руб'
    }

    questionNum.innerHTML = questionCount++

    if (currentSlide === slides.length - 1) {
      nextButton.style.display = 'none'
      submitButton.style.display = 'inline-block'
    } else {
      nextButton.style.display = 'inline-block'
    }
  }

  function showNextSlide () {
    showSlide(currentSlide + 1)
  }

  const quizContainer = document.getElementById('quiz')
  const submitButton = document.getElementById('submit')

  buildQuiz()

  const nextButton = document.getElementById('next')
  const slides = document.querySelectorAll('.slide')
  const questionNum = document.getElementById('question__num')
  const discountSum = document.getElementById('discount__sum')
  let currentSlide = 0
  let questionCount = 1

  showSlide(0)

  nextButton.addEventListener('click', showNextSlide)
})()
