class QuestionAnswer {

    constructor(params){
    this.question = params.question;
    this.answer = params.answer;

    this.btnNext = params.btnNext;
    this.btnPre = params.btnPre;

    this.currentQuestion = params.currentQuestion;
    this.indexQuestion = 0;

    this.setUpEvent();

}

chooseRandomQuestion(listQuestions) {
    const randomNum = Math.random() * 1000;

    return Math.floor(randomNum % listQuestions.length);
  }

  resetSelectAnswer(checklist) {
    checklist.forEach(element => {
      element.childNodes[0].className = "far fa-circle"
    })
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

  generateMultipleAnswer(questionSample) {
    const $this = this;
    this.answerTextInput.style.display = "none";
    this.answerWrapper.style.display = "block";

    for (let i = 0; i < questionSample.answerList.length; i++) {
      //show circle as much as answer
      this.answerCheckList[i].style.display = "flex"
      //set attribute foreach circle
      this.answerCheckList[i].setAttribute("key", questionSample.answerList[i].key);

      if (questionSample.answerList[i].key === this.resultList[this.indexQuestion])
        this.answerCheckList[i].childNodes[0].className = "fas fa-circle";

      this.answerCheckList[i].childNodes[1].innerHTML = questionSample.answerList[i].content;
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

    this.question.innerHTML = questionBundle[index].question

    if (questionBundle[index].type === MULTIPLE_CHOICE_TYPE)
      this.generateMultipleAnswer(questionBundle[index])
    else
      this.generateTextAnswer()
  }

  setUpAnswerArea() {
    const $this = this;

    this.answerWrapper = document.createElement("UL");

    for (let i = 0; i < NUMBER_CHECK_ITEM; i++) {

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
  
  }
}