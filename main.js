//selectElement

let countSpan = document.querySelector(".quiz-info .count span"); 
let spans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            
            //creatBullet + set number count
            createBullets(questionsCount);

            //create Answer + questions;
            addQuestionData(questionsObject[currentIndex], questionsCount);

            // Start CountDown
            countdown(3, questionsCount);

            // click on submit
            submitButton.addEventListener("click", () => {
                let theRightAnswer = questionsObject[currentIndex].right_answer; 
                
                //increase current index
                currentIndex++;

                // check anwser
                checkAnswer(theRightAnswer, questionsCount);

                // remove all body 
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                //create Answer + questions;
                addQuestionData(questionsObject[currentIndex], questionsCount);

                //handle span bulletes
                handleBullets() 

                // Start CountDown
                clearInterval(countdownInterval);
                countdown(3, questionsCount);
                
                showResult(questionsCount);
            })
        }
    }


    myRequest.open("Get", "quetions.json");
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    //create bulltes 
    for (let i = 0; i < num; i++){
        let span = document.createElement("span");
        if (i == 0) {
            span.classList.add("on")
        }
        spans.appendChild(span);
    }
};

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(obj.title));

    quizArea.appendChild(questionTitle);

    // add Answer
    for (let i = 1; i <= 4; i++){
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";

        let radioInput = document.createElement("input");
        radioInput.name = "questions";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        if (i == 1) {
            radioInput.checked = true;
        }

        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${i}`;

        theLabel.appendChild(document.createTextNode(obj[`answer_${i}`]));

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        answersArea.appendChild(mainDiv);

    }
    }

}

function checkAnswer(rAnswer , count) {
    let answers = document.getElementsByName("questions"); 
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++){
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    };

    if (rAnswer === theChoosenAnswer) {
        rightAnswer++;
    }
}

function handleBullets() {
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpan);

    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.classList.add("on");
        }
    })
}

function showResult(count) {
    let theResult;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswer > (count / 2) && rightAnswer < count) {
            theResult = `<span class="good">Good</span>,${rightAnswer} from ${count}`
        } else if (rightAnswer === count) {
            theResult = `<span class="perfect">Prefect</span>,All Answer IS P  refect`;
        } else {
            theResult = `<span class="bad">Bad</span>,${rightAnswer} from ${count}`;
        } 
        resultContainer.innerHTML = theResult; 
        resultContainer.style.padding = '10px';
        resultContainer.style.backgroundColor = "#fff";
        resultContainer.style.marginTop = "10px";
    }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}