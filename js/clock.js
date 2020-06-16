class ClockAndQA {
    constructor(params) {
        this.clockContainer = params.clockContainer;
        this.minuteElement = params.minuteElement;
        this.secondElement = params.secondElement;

        this.question = params.question;
        this.answer = params.answer;

        this.valueMinute = 0;
        this.valueSecond = 0;
        this.isCounting = false;
        this.isAnswerAlready = false;

        this.setUpEvent();
    }

    resultList = [];

    questionBundle = [{
            type: `multiple`,
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
            timeLimit: 16 // seconds
        },
        {
            type: `multiple`,
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
        return setInterval(() => {
            this.handleTimeIncrement();
        }, 1000);
    }

    stopCounting(savedInterval) {
        return clearInterval(savedInterval);
    }

    normalizeTime(number) {
        return number < 10 ? ('0' + number) : number;
    }

    displayTime(minute, second) {
        this.secondElement.innerHTML = this.normalizeTime(second);
        this.minuteElement.innerHTML = this.normalizeTime(minute);
    }

    handleTimeIncrement() {
        this.valueSecond++;
        if (this.valueSecond === 60) {
            this.valueSecond = 0;
            this.valueMinute++;
        }
        this.displayTime(this.valueMinute, this.valueSecond)
    }

    setVisibilityQA() {
        if (!this.isCounting) {
            this.question.style.display = "none";
            this.answer.style.display = "none";
        } else {
            this.question.style.display = "block";
            this.answer.style.display = "block";
        }
    }

    switchCounting() {
        this.isCounting = !this.isCounting;
    }

    chooseRandomQuestion(listQuestions) {
        const randomNum = Math.random() * 1000;

        this.indexQuestion = Math.floor(randomNum % listQuestions.length);
    }

    handleClickAnswer(key){


        setAnswerIsClick()
    }

    setAnswerIsClick(){

    }

    generateMultipleAnswer(questionSample) {
        const answerWrapper = document.createElement("UL");

        for (let i = 0; i < questionSample.answerList.length; i++) {

            const node = document.createElement("LI"); // Create a <li> node

            const circleAnswer = document.createElement("I");
            circleAnswer.className = "far fa-circle"
            circleAnswer.setAttribute("key", questionSample.answerList[i].key)
            circleAnswer.addEventListener('click', function () {
                handleClickAnswer(this.getAttribute("key"))
                //setAnswerIsClick(this.getAttribute("key"))
            })
            node.appendChild(circleAnswer)

            const textnode = document.createTextNode(questionSample.answerList[i].content); // Create a text node
            node.appendChild(textnode); // Append the text to <li>

            answerWrapper.appendChild(node);
        }

        this.answer.appendChild(answerWrapper)
    }

    generateQuestion(questionBundle, index) {
        console.log("generate question")

        //const index = this.chooseRandomQuestion(questionBundle)

        //this.chooseRandomQuestion(questionBundle)

        this.question.innerHTML = questionBundle[index].question

        if (questionBundle[index].type === `multiple`)
            this.generateMultipleAnswer(questionBundle[index])
        else
            this.generateTextAnswer(questionBundle[index])
    }

    setUpEvent() {
        this.setVisibilityQA();

        this.clockContainer.addEventListener('click', () => {

            if (!this.isCounting && !this.isAnswerAlready) {
                this.switchCounting();
                this.timer = this.startCounting();
                this.setVisibilityQA();
                this.generateQuestion(this.questionBundle, this.indexQuestion = 0)
            }
        })

        this.answer.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.switchCounting();
                this.isAnswerAlready = true;
                clearInterval(this.timer);
            }
        });
    }
}