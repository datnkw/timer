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
const NUMBER_CHECK_ITEM = 4;

class ClockAndQA {
  constructor(params) {
    this.clockContainer = params.clockContainer;
    this.minuteElement = params.minuteElement;
    this.secondElement = params.secondElement;

    
    this.valueMinute = 0;
    this.valueSecond = 0;

    this.isCounting = false;
    this.isAnswerAlready = false;

    this.setUpEvent();
  }

  timeLeftList = [];

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
        }
      ],
      timeLimit: 3 // seconds,
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
      timeLimit: 2 // seconds
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
      timeLimit: 2 // seconds
    },
    {
        type: `text`,
        question: `Which mouse walks with 2 feet?`,
        //for multiple choice
        correctAnswer: `mickey`,
        answerList: [],
        timeLimit: 3 // seconds
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

  resetTimer() {
    this.stopCounting(this.timer);
    if (!this.isCounting) {
      this.timer = this.startCounting();
    }
  }

  resetIsCounting() {
    this.isCounting = (this.timeLeftList[this.indexQuestion] === 0);
  }

  setUpEvent() {
    this.setVisibilityQA();
  }
}