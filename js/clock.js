function createShuffledArray(array) {

  const len = array.length;
  //console.log("len: ", len)
  const arrayResult = []
  for (let i = 0; i < len; i++)
    arrayResult.push(i)

  //console.log("arrayResult before shuffle: ", arrayResult)

  for (let i = len - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    const tmp = arrayResult[i];
    arrayResult[i] = arrayResult[j];
    arrayResult[j] = tmp
  }

  //console.log("arrayResult after shuffle: ", arrayResult)


  return arrayResult
}

const MULTIPLE_CHOICE_TYPE = 'multiple';
const TEXT_TYPE = 'text';

//const this.questionBundle = require("./this.questionBundle.json");
//let this.questionBundle = require("./this.questionBundle.json");
class ClockAndQA {
  constructor(params) {
    this.clockContainer = params.clockContainer;
    this.minuteElement = params.minuteElement;
    this.secondElement = params.secondElement;

    this.question = params.question;
    this.answer = params.answer;

    this.btnNext = params.btnNext;
    this.btnPre = params.btnPre;

    this.currentQuestion = params.currentQuestion;

    this.resultContainer = params.resultContainer;

    this.btnSubmit = params.btnSubmit;

    this.valueMinute = 0;
    this.valueSecond = 0;

    this.indexQuestion = 0;

    this.isCounting = false;
    this.isAnswerAlready = false;

    this.answerCheckList = [];
    this.resultList = [];
    this.booleanResultList = [];
    this.timeLeftList = [];

    this.setUpEvent();
  }

  questionBundle = [
    {
      type: MULTIPLE_CHOICE_TYPE,
      question: `1 + 1 = ?`,
      //for multiple choice
      correctAnswer: `d`,
      answerList: [{
          key: `a`,
          content: `10`,
        },
        {
          key: `b`,
          content: `1`,
        },
        {
          key: `c`,
          content: `3`,
        },
        {
          key: `d`,
          content: `2`,
        },
        {
          key: `e`,
          content: `20`,
        },
        {
          key: `f`,
          content: `21`,
        },
        {
          key: `g`,
          content: `22`,
        }
      ],
      timeLimit: 600 // seconds,
    },
    {
      type: MULTIPLE_CHOICE_TYPE,
      question: `a + b = ?`,
      //for multiple choice
      correctAnswer: `a`,
      answerList: [{
          key: `a`,
          content: `ab`,
        },
        {
          key: `b`,
          content: `ba`,
        },
        {
          key: `c`,
          content: `aa`,
        }
      ],
      timeLimit: 20 // seconds
    },
    {
      type: MULTIPLE_CHOICE_TYPE,
      question: `a + b + c = ?`,
      //for multiple choice
      correctAnswer: `a`,
      answerList: [{
          key: `a`,
          content: `abc`,
        },
        {
          key: `b`,
          content: `bac`,
        },
        {
          key: `c`,
          content: `aac`,
        }
      ],
      timeLimit: 70 // seconds
    },
    {
        type: `text`,
        question: `Which mouse walks on two legs?`,
        //for multiple choice
        correctAnswer: `mickey`,
        answerList: [],
        timeLimit: 70 // seconds
    }
  ]

  startCounting() {
    this.isCounting = true;
    return setInterval(() => {
      this.handleTimeDecrement();
    }, 1000);
  }

  stopCounting(savedInterval) {
    this.isCounting = false;
    return clearInterval(savedInterval);
  }

  normalizeTime(number) {
    return number < 10 ? ('0' + number) : number;
  }

  displayTime(second) {
    const minute = Math.floor(second / 60)

    second = second - minute * 60

    this.secondElement.innerHTML = this.normalizeTime(second);
    this.minuteElement.innerHTML = this.normalizeTime(minute);
  }

  checkResult() {
    for (let i = 0; i < this.questionsOrder.length; i++) {
      if(this.questionBundle[this.questionsOrder[i]].type === TEXT_TYPE){
        this.booleanResultList[i] = this.resultList[i];
        continue;
      }

      if (this.resultList[i] === this.questionBundle[this.questionsOrder[i]].correctAnswer) {
        this.booleanResultList[i] = true;
      } else {
        this.booleanResultList[i] = false;
      }
    }
  }

  getContentNotNullAnswer() {
    if(this.questionBundle[this.questionsOrder[i]].type === TEXT_TYPE){
      return this.resultList[i];
    }else{
     return this.questionBundle[this.questionsOrder[i]]
      .answerList.find(answer => answer.key === this.resultList[i]).content;
    }
  }

  getContentAnswer(i){
    if(!this.resultList[i]){
      return 'No answer';
    }
    
    return getContentNotNullAnswer();
  }

  renderResult() {
    this.resultContainer.innerHTML = "";


    for (let i = 0; i < this.questionBundle.length; i++) {
      const subResult = document.createElement("div");
      subResult.className += "sub-result";

      const numberQuestion = document.createElement("p");
      let content = document.createTextNode("Question " + i + ": ");
      numberQuestion.appendChild(content)
      subResult.appendChild(numberQuestion)

      const resultQuestion = document.createElement("p");

      let stringContent = this.questionBundle[this.questionsOrder[i]].question + " " + this.getContentAnswer(i)
      

      content = document.createTextNode(stringContent);
      if (this.booleanResultList[i] == true) {
        resultQuestion.className += "answer correct";
      } else if(this.booleanResultList[i] == false){
        resultQuestion.className += "answer wrong";
      }else {
        resultQuestion.className +=  "answer";
      }

      resultQuestion.appendChild(content);

      subResult.appendChild(resultQuestion);

      console.log("sub result: ", subResult);

      this.resultContainer.appendChild(subResult);
    }
  }

  finishTest() {
    this.isAnswerAlready = true;
    this.isCounting = false;

    this.stopCounting(this.timer);
    this.displayTime(0);

    this.setVisibilityQA();

    this.resultContainer.style.display = "block"

    this.checkResult();

    this.renderResult();
  }

  checkTimeOut() {
    for (let i = 0; i < this.timeLeftList.length; i++) {
      if (this.timeLeftList[i] > 0)
        return false;
    }

    return true;
  }

  handleTimeDecrement() {
    let second = this.timeLeftList[this.indexQuestion];

    if (second === 0) {
      this.stopCounting(this.timer);
      this.disableTextAnswer();

      if (this.checkTimeOut())
        this.finishTest();
      return
    }

    second--
    this.timeLeftList[this.indexQuestion] = second;
    this.displayTime(second)
  }

  setVisibilityQA() {
    if (!this.isCounting) {
      this.question.style.display = "none";
      this.answer.style.display = "none";
      this.btnNext.style.display = "none";
      this.btnPre.style.display = "none";
      this.currentQuestion.style.display = "none";
      this.btnSubmit.style.display = "none";
    } else {
      this.question.style.display = "block";
      this.answer.style.display = "block";
      this.btnNext.style.display = "flex";
      this.btnPre.style.display = "flex";
      this.currentQuestion.style.display = "flex";
      this.btnSubmit.style.display = "block";
    }
  }

  switchCounting() {
    this.isCounting = !this.isCounting;
  }

  chooseRandomQuestion(listQuestions) {
    const randomNum = Math.random() * 1000;

    return Math.floor(randomNum % listQuestions.length);
  }

  resetTimer() {
    this.stopCounting(this.timer);
    if (!this.isCounting) {
      this.timer = this.startCounting();
    }
  }

  resetSelectAnswer(checklist) {
    checklist.forEach(element => {
      element.childNodes[0].className = "far fa-circle"
    })
  }

  resetIsCounting() {
    this.isCounting = (this.timeLeftList[this.indexQuestion] === 0);
  }

  setUpPanelQuestion() {
    this.currentQuestion.childNodes[3].innerHTML = (this.indexQuestion + 1) + "/" + this.questionBundle.length;
  }

  setUpQuestion() {
    this.resetSelectAnswer(this.answerCheckList);

    this.resetIsCounting();

    this.resetTimer();

    this.generateQuestion(this.questionBundle, this.questionsOrder[this.indexQuestion]);
  }

  goToNextQuestion() {
    if (this.indexQuestion + 1 >= this.questionBundle.length) {
      return;
    }
    this.indexQuestion++;
    this.setUpQuestion();
  }

  goToPreQuestion() {
    if (this.indexQuestion - 1 <= -1)
      return;

    this.indexQuestion--;

    this.setUpQuestion();
  }

  handleClickAnswer(answerItem) {
    if (!this.isCounting) {
      return
    }

    this.resetSelectAnswer(this.answerCheckList)

    answerItem.childNodes[0].className = "fas fa-circle"

    this.saveResult(answerItem.getAttribute("key"))
  }

  saveResult(key) {
    this.resultList[this.indexQuestion] = key;
  }

  generateMultipleAnswer(questionSample) {
    const $this = this;
    this.answerTextInput.style.display = "none";
    this.answerWrapper.style.display = "block";

    const answerListLength = questionSample.answerList.length
    for (let i = 0; i < answerListLength; i++) {
      //show circle as much as answer
      this.answerCheckList[i].style.display = "flex";
      //set attribute foreach circle
      this.answerCheckList[i].setAttribute("key", questionSample.answerList[i].key);

      if (questionSample.answerList[i].key === this.resultList[this.indexQuestion])
        this.answerCheckList[i].childNodes[0].className = "fas fa-circle";

      this.answerCheckList[i].childNodes[1].innerHTML = questionSample.answerList[i].content;
    }
    for(let i = answerListLength; i < this.answerCheckList.length; i++){
      this.answerCheckList[i].style.display = "none";
    } 
  }

  disableTextAnswer(){
    this.answerTextInput.disabled = true;
  }

  generateTextAnswer() {
    this.answerWrapper.style.display = "none";
    this.answerTextInput.style.display = "block";
    this.answerTextInput.value = this.resultList[this.indexQuestion] || '';
  }

  generateQuestion(questionBundle, index) {
    this.setUpPanelQuestion();

    this.displayTime(this.timeLeftList[this.indexQuestion])

    this.question.innerHTML = this.questionBundle[index].question

    if (this.questionBundle[index].type === MULTIPLE_CHOICE_TYPE)
      this.generateMultipleAnswer(this.questionBundle[index])
    else
      this.generateTextAnswer()
  }

  getTheBiggestAmountAnswers() {
    let max = 0;

    for(let i = 0; i < this.questionBundle.length; i++){
      if(max < this.questionBundle[i].answerList.length)
        max = this.questionBundle[i].answerList.length;
    }

    return max;
  }

  setUpAnswerArea() {
    const $this = this;

    this.answerWrapper = document.createElement("UL");

    const biggestAmountAnswers = this.getTheBiggestAmountAnswers();

    for (let i = 0; i < biggestAmountAnswers; i++) {

      const answerItem = document.createElement("LI");
      answerItem.style.display = 'none';

      const circleAnswer = document.createElement("I");
      circleAnswer.className = "far fa-circle";

      circleAnswer.addEventListener('click', function () {
        $this.handleClickAnswer(answerItem);
      })

      answerItem.appendChild(circleAnswer);

      answerItem.appendChild(document.createElement("P"))

      this.answerWrapper.appendChild(answerItem);

      this.answerCheckList.push(answerItem);
    }
    

    this.answer.appendChild(this.answerWrapper)

    this.answerTextInput = document.createElement("INPUT");
    this.answerTextInput.style.display = 'none';

    this.answerTextInput.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        console.log("inner html: ", this.value);

        $this.saveResult(this.value);
      }
    })

    this.answer.appendChild(this.answerTextInput);
  }

  setUpEvent() {
    

    this.setUpAnswerArea();

    this.setVisibilityQA();

    this.questionsOrder = createShuffledArray(this.questionBundle)

    for (let i = 0; i < this.questionsOrder.length; i++) {
      this.timeLeftList[i] = this.questionBundle[this.questionsOrder[i]].timeLimit
    }

    this.clockContainer.addEventListener('click', () => {

      if (!this.isCounting && !this.isAnswerAlready) {
        this.switchCounting();
        this.timer = this.startCounting();
        this.setVisibilityQA();
        this.generateQuestion(this.questionBundle, this.questionsOrder[this.indexQuestion])
      }
    })

    this.btnNext.addEventListener('click', () => {
      this.goToNextQuestion()
    })

    this.btnPre.addEventListener('click', () => {
      this.goToPreQuestion()
    })

    this.btnSubmit.addEventListener('click', () => {
      this.finishTest();
    })
  }


}