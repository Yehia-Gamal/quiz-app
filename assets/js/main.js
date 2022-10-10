// Select Elements
let countSpan = document.querySelector(".quiz-app .count span");
let bullets = document.querySelector(".quiz-app .bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitButton = document.querySelector(".submut-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// .addEventListener("click", function () {
//   console.log("submut-button");
// });

// Set Options
let currentIdex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequset = new XMLHttpRequest();

  myRequset.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      // console.log(questionsObject);
      let questionsCount = questionsObject.length;
      // console.log(questionsCount);

      // Create Bullets + Set Questions Count
      createBullets(questionsCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIdex], questionsCount);

      // Start Countdown
      countdown(90, questionsCount);

      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIdex].right_answer;

        // Increase Index
        currentIdex++;

        // Check The Answer
        checkAnswer(theRightAnswer, questionsCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObject[currentIdex], questionsCount);

        // Handle Bullets Class
        handleBullets();

        // Start Coundown
        clearInterval(countdownInterval);
        countdown(90, questionsCount);

        // Show Results
        showResults(questionsCount);
      };
    }
  };

  myRequset.open("GET", "assets/json/html_questions.json", true);
  myRequset.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullt = document.createElement("span");

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullt);

    // Check If Its First Span
    if (i === 0) {
      theBullt.className = "on";
    }
  }
}

function addQuestionData(obj, count) {
  if (currentIdex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let qusetionText = document.createTextNode(obj.title);

    // Append Text To h2 Heading
    questionTitle.appendChild(qusetionText);

    // Append The h2 Heading To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Add Style CSS With Bootstrap Class
    questionTitle.classList.add("m-0");

    quizArea.className = "text-center bg-white p-3 pb-0 mt-3";

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer p-3";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.type = "radio";
      radioInput.name = "questions";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute + Class Name
      theLabel.htmlFor = `answer_${i}`;
      theLabel.className = "position-relative fs-6 fw-bold";

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label

      theLabel.appendChild(theLabelText);

      // Add Input Radio + Label To 'aswer' mainDiv

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);

      // Add Style CSS With Bootstrap Class
      answersArea.className = "bg-white p-3";
    }
  }
}

function checkAnswer(rAnswer, count) {
  // console.log(rAnswer);
  // console.log(count);

  let answers = document.getElementsByName("questions");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  // console.log(`Right Answer Is : ${rAnswer}`);
  // console.log(`Choosen Answer Is : ${theChoosenAnswer}`);

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("Good Answers");
  } else {
    console.log("Bad Answers");
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpan);
  arrayOfSpans.forEach((span, index) => {
    if (currentIdex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;

  if (currentIdex === count) {
    console.log("Questions Is Finshed");

    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span> Questions, ${rightAnswers} From ${count}.`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span> Questions, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span> Questions, ${rightAnswers} From ${count}.`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.className = "results p-3 mt-3 bg-white";
  }
}

function countdown(duration, count) {
  if (currentIdex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        console.log("The Time Is Finshed");
        submitButton.onclick();
      }
    }, 1000);
  }
}
