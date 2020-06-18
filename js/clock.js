function createShuffledArray(array) {

    const len = array.length;
    console.log("len: ", len)
    const arrayResult = []
    for (let i = 0; i < len; i++)
        arrayResult.push(i)

    console.log("arrayResult before shuffle: ", arrayResult)

    for (let i = len - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        const tmp = arrayResult[i];
        arrayResult[i] = arrayResult[j];
        arrayResult[j] = tmp
    }

    console.log("arrayResult after shuffle: ", arrayResult)


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

        this.question = params.question;
        this.answer = params.answer;

        this.btnNext = params.btnNext;
        this.btnPre = params.btnPre;

        this.currentQuestion = params.currentQuestion;

        this.valueMinute = 0;
        this.valueSecond = 0;

        this.indexQuestion = 0;

        this.isCounting = false;
        this.isAnswerAlready = false;

        this.setUpEvent();
    }

    answerCheckList = []

    resultList = [];

    timeLeftList = [];

    questionBundle = [{
            type: MULTIPLE_CHOICE_TYPE,
            question: `1 + 1 = ?`,
            //for multiple choice
            correctAnswer: `a`,
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
            timeLimit: 8 // seconds,
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
            timeLimit: 9 // seconds
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
            timeLimit: 16 // seconds
        },
        // {
        //     type: `text`,
        //     question: `Chuột nào đi bằng 2 chân?`,
        //     //for multiple choice
        //     correctAnswer: `mickey`,
        //     answerList: [],
        //     timeLimit: 16 // seconds
        // }
    ]

    startCounting() {
        console.log("begin count")
        this.isCounting = true;
        return setInterval(() => {
            this.handleTimeDecrement();
        }, 1000);
    }

    stopCounting(savedInterval) {
        console.log("stop count")
        this.isCounting = false;
        return clearInterval(savedInterval);
    }

    normalizeTime(number) {
        return number < 10 ? ('0' + number) : number;
    }

    displayTime(second) {
        console.log("display time: ", second)

        const minute = Math.floor(second / 60)
        
        second = second - minute*60

        this.secondElement.innerHTML = this.normalizeTime(second);
        this.minuteElement.innerHTML = this.normalizeTime(minute);
    }

    handleTimeDecrement() {
        let second = this.timeLeftList[this.indexQuestion];

        if(second === 0){
            console.log("handleTimeDecrement stop timer")
            
            this.stopCounting(this.timer);
            console.log("this timer when stop: ", this.timer)
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
        } else {
            this.question.style.display = "block";
            this.answer.style.display = "block";
            this.btnNext.style.display = "flex";
            this.btnPre.style.display = "flex";
            this.currentQuestion.style.display = "flex";
        }
    }

    switchCounting() {
        this.isCounting = !this.isCounting;
    }

    chooseRandomQuestion(listQuestions) {
        const randomNum = Math.random() * 1000;

        return Math.floor(randomNum % listQuestions.length);
    }

    resetTimer(){
        this.stopCounting(this.timer);
        if(!this.isCounting){
            console.log("reset timer")
            this.timer = this.startCounting();
        }
    }

    resetSelectAnswer(checklist){
        checklist.forEach(element => {
            // console.log("classname: ", element.childNodes)

            element.childNodes[0].className = "far fa-circle"
        })
    }

    resetIsCounting(){
        this.isCounting = (this.timeLeftList[this.indexQuestion] === 0);
    }

    setUpPanelQuestion(){
        console.log(this.currentQuestion.childNodes)

        this.currentQuestion.childNodes[3].innerHTML = (this.indexQuestion + 1) + "/" + this.questionBundle.length;
    }

    setUpQuestion(){
        this.resetSelectAnswer(this.answerCheckList);

        this.resetIsCounting();

        this.resetTimer();

        this.generateQuestion(this.questionBundle, this.questionsOrder[this.indexQuestion]);

    }

    goToNextQuestion() {
        console.log("Go to next question")
        
        //this.generateQuestion(this.questionBundle, this.questionsOrder[this.indexQuestion]);
        if(this.indexQuestion + 1 >= this.questionBundle.length){
            //this.indexQuestion++;
            return;
        }

        this.indexQuestion++;
      this.setUpQuestion();

    

        // if(this.indexQuestion == this.questionBundle.length)
        //     return;
    }

    goToPreQuestion() {
        
        if(this.indexQuestion - 1 <= -1)
            return;

        this.indexQuestion--;

        this.setUpQuestion();
    }

    handleClickAnswer(answerItem) {
        //hightlight the circle 

        if(!this.isCounting){
            return
        }

        this.resetSelectAnswer(this.answerCheckList)

        answerItem.childNodes[0].className = "fas fa-circle"

        this.saveResult(answerItem.getAttribute("key"))

        //this.goToNextQuestion()
    }

    saveResult(key) {
        this.resultList[this.indexQuestion] = key;
        console.log(this.resultList)
    }

    generateMultipleAnswer(questionSample) {
        const $this = this;

        //const answerWrapper = document.createElement("UL");

        for (let i = 0; i < questionSample.answerList.length; i++) {
            //show circle as much as answer
            this.answerCheckList[i].style.display = "flex"
            //set attribute foreach circle
            this.answerCheckList[i].setAttribute("key", questionSample.answerList[i].key);

            if(questionSample.answerList[i].key === this.resultList[this.indexQuestion])
                this.answerCheckList[i].childNodes[0].className = "fas fa-circle";

            this.answerCheckList[i].childNodes[1].innerHTML = questionSample.answerList[i].content;
        }
    }

    generateTextAnswer() {
        const $this = this;
        //const answerInput = document.createElement("INPUT");
        answerInput.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                //this.switchCounting();
                //this.isAnswerAlready = true;

                this.stopCounting($this.timer)
                //clearInterval($this.timer);

                saveResult(this.innerHTML)
            }
        })

        this.answer.appendChild(answerInput)
    }

    generateQuestion(questionBundle, index) {
        console.log("generate question")

        console.log("timeleft: ", this.timeLeftList)

        console.log("index: ", index)

        this.setUpPanelQuestion();

        this.displayTime(this.timeLeftList[this.indexQuestion])

        this.question.innerHTML = questionBundle[index].question

        if (questionBundle[index].type === `multiple`)
            this.generateMultipleAnswer(questionBundle[index])
        else
            this.generateTextAnswer()
    }

    setUpAnswerArea() {
        const $this = this;

        const answerWrapper = document.createElement("UL");

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

            //const textnode = document.createTextNode(questionSample.answerList[i].content);

            //answerItem.appendChild(textnode); 

            answerWrapper.appendChild(answerItem);

            this.answerCheckList.push(answerItem);
        }

        this.answer.appendChild(answerWrapper)

        this.answerTextInput = document.createElement("INPUT");
        this.answerTextInput.style.display = 'none';

        this.answerTextInput.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                //this.switchCounting();
                //this.isAnswerAlready = true;
                // clearInterval($this.timer);

                this.stopCounting();

                $this.saveResult(this.innerHTML);

                $this.goToNextQuestion();
            }
        })

        //this.answerTextInput = answerText;

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
    }
}