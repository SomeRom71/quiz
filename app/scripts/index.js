import '../styles/main.scss'
import 'magnific-popup'
import {ajax} from 'jquery'
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

let quizAnswers = []

const quiz = (function () {
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
           <span class="question__text">${currentQuestion.question}</span>
           <div class="question__checkbox">
              <div class='answers'> ${answers.join('')} </div>
           </div>
        </div>`
      )
    })

    quizContainer.innerHTML = output.join('')
  }

  function showSlide (n) {
    if (slides.length - 1 <= currentSlide) {
      questionContainer.classList.add('last-question')
      discountSum.innerHTML = '5000' + ' руб'
      questionCounterText.innerHTML = 'Вы ответили на все вопросы. Спасибо!'
      discountText.innerHTML = 'Для закрепления за Вами скидки 5000 рублей заполните форму слева!'
      questionProgress.style.width = 100 + '%'
    }

    slides[currentSlide].classList.remove('active-slide')
    slides[n].classList.add('active-slide')
    currentSlide = n

    if (questionCount === 1) {
      discountSum.innerHTML = '0' + ' руб'
      questionProgress.style.width = 2 + '%'
    } else {
      discountSum.innerHTML = (questionCount - 1) * 1000 + ' руб'
      questionProgress.style.width = 20 * currentSlide + '%'
    }

    if (currentSlide === slides.length - 1) {
      nextButton.innerHTML = '<p>Закончить опрос и получить <span>скидку 5000 руб</span></p>'
      nextButton.classList.add('question__btn_last')
    }

    questionNum.innerHTML = '&nbsp;' + questionCount++
  }

  function showNextSlide () {
    showSlide(currentSlide + 1)
  }

  const quizContainer = document.getElementById('quiz')
  const questionContainer = document.getElementById('question')
  const questionProgress = document.getElementById('question__progress__line')

  buildQuiz()

  const labels = document.querySelectorAll('label > input')
  const nextButton = document.getElementById('next')
  const slides = document.querySelectorAll('.slide')
  const questionNum = document.getElementById('question__num')
  const questionCounterText = document.getElementById('question__counter__text')
  const discountSum = document.getElementById('discount__sum')
  const discountText = document.getElementById('discount__text')
  let currentSlide = 0
  let questionCount = 1

  labels.forEach(function (item, i) {
    item.onclick = function () {
      quizAnswers.push(item.parentNode.textContent.trim())
      showNextSlide()
    }
  })

  showSlide(0)

  function showMessage () {
    alert('Выберите ответ!')
  }

  nextButton.addEventListener('click', showMessage)
  return quizAnswers
})()

const form = document.getElementById('form')

form.onsubmit = function (e) {
  const phone = document.getElementById('phone').value
  quizAnswers.push(phone)
  ajax({
    type: 'POST',
    data: {data: JSON.stringify(quizAnswers)},
    url: 'mail.php',
    success: function (data) {
    }
  })
  window.location.href = './thanks.html'
}
