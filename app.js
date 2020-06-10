const phoneBtn = document.getElementById("phone");
const fiftyBtn = document.getElementById("fifty");
const audienceBtn = document.getElementById("phone");
const question = document.getElementById("question");
const answers = document.getElementById("answers");
const moneyWon = document.querySelector("money-won");
const output = document.querySelector(".output");

let correctAnswer;
let counter = -1;

// Fisher-yates algo for shuffling arrays
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const url = `https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple`;

//
const getQuestions = () => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const result = data.results;
      const questions = result.map(item => decodeHTML(item["question"])); // questions for the quiz
      const correct_answers = result.map(item => [decodeHTML(item["correct_answer"])]); // correct answer for each question
      const incorrect_answers = result.map(item => item["incorrect_answers"]); // incorrect options for each question

      let answersArray = [];
      const myQuestions = [];
      // loop through one of the arrays to join correct and incorrect answers
      for (let i = 0; i < correct_answers.length; i++) {
        answersArray.push(correct_answers[i].concat(incorrect_answers[i]));
        myQuestions.push([questions[i], correct_answers[i].concat(incorrect_answers[i]), ...correct_answers[i]]);
      }

      //randomise the content of the array
      answersArray.forEach(item => shuffle(item));

      console.log(myQuestions);

      //start displaying questions here
      function init() {
        nextQuestion();
      }

      //
      function nextQuestion() {
        const total = myQuestions.length;
        // answeredCorrect = 0;

        // counter increments for each question answered
        counter = counter + 1;

        //checks if the counter is less than total
        //once counter is not less than total, means
        //all questions have been answered correctly
        if (counter < total) {
          showQuestion(counter);
        } else {
          alert("Congrats you're a millionaire");
        }
      }

      //function that displays each question
      function showQuestion(counter) {
        let currentQuestion = myQuestions[counter][0];
        question.innerText = currentQuestion;
        answers.innerHTML = `
            <div class="answer-text"><span>A:</span>${answersArray[counter][0]}</div>
            <div class="answer-text"><span>B:</span>${answersArray[counter][1]}</div>
            <div class="answer-text"><span>C:</span>${answersArray[counter][2]}</div>
            <div class="answer-text"><span>D:</span>${answersArray[counter][3]}</div>`;

        const options = document.querySelectorAll(".answer-text");
        options.forEach(option =>
          option.addEventListener("click", e => {
            checkAnswer(e, counter);
          })
        );
      }

      //UI display for wrong and right answers
      function updateUI(target, correctOption, userChoice) {
        console.log(target, correctOption);
        target.classList.add(userChoice === correctOption ? "right" : "wrong");
        target.classList.add(userChoice === correctOption ? "blinking" : "blinkingWrong");
      }

      //checks if each option selected is wrong or right
      function checkAnswer(e, counter) {
        const target = e.target;
        const parentElement = target.parentElement;
        let children = parentElement.querySelectorAll(".answer-text");

        const userSelect = e.target.innerText.slice(2);
        const currentPrize = document.querySelector(".active");

        const correctChoice = myQuestions[counter][2];
        let correctChoiceDiv = "";
        for (let i = 0; i < children.length; i++) {
          if (children[i].innerText.includes(correctChoice)) {
            correctChoiceDiv = children[i];
          }
        }

        if (userSelect === correctChoice) {
          updateUI(target, correctChoice, userSelect);

          setTimeout(() => {
            nextQuestion();
            currentPrize.classList.remove("active");
            currentPrize.previousElementSibling.classList.add("active");
          }, 3000);
        } else {
          // alert("You lose");
          output.style.display = "block";
          updateUI(target, correctChoice, userSelect);
          correctChoiceDiv.classList.add("blinking");

          setTimeout(() => {
            restart();
          }, 3000);
        }
      }

      //restarts the game
      function restart() {
        counter = -1;

        location.reload();
      }
      init();
    });
};
getQuestions();

// remove all html encoded characters from string
const decodeHTML = function (html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
