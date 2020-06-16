class ClockAndQA {
    constructor(params) {
        this.clockContainer = params.clockContainer;
        this.minuteElement = params.minuteElement;
        this.secondElement = params.secondElement;

        this.question = params.question;
        this.answer = params.answer;

        this.listQuestion = ["Are u ok?", "U good?", "OK?", "How is the weather?", "How old are you?"];

        this.valueMinute = 0;
        this.valueSecond = 0;
        this.isCounting = false;
        this.isAnswerAlready = false;

        this.setUpEvent();
    }

    questionBundle = [{
            type: `multiple`,
            question: `1 + 1 = ?`,
            //for multiple choice
            correctAnswer: `a`,
            listAnswer: [{
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
            listAnswer: [{
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
        {
            type: `text`,
            question: `Chuột nào đi bằng 2 chân?`,
            //for multiple choice
            correctAnswer: `mickey`,
            listAnswer: [],
            timeLimit: 16 // seconds
        }
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

        return index = Math.floor(randomNum % listQuestions.length);
    }

    generateMultipleAnswer(questionSample) {
        //add tag lu
        this.answer.innerHTML = `<lu></lu>`
        //add tag li

        const answerWrapper = document.createElement("UL");

        for (let i = 0; i < questionSample.listAnswer.length; i++) {
            const node = document.createElement("LI"); // Create a <li> node
            const textnode = document.createTextNode(questionSample.listAnswer[i].content); // Create a text node
            node.appendChild(textnode); // Append the text to <li>

            const circleAnswer = document.createElement("I");
            circleAnswer.className = "far fa-circle"
            node.appendChild(circleAnswer)

            answerWrapper.appendChild(node);
        }
    }

    generateQuestion(questionBundle) {
        const index = chooseRandomQuestion(questionBundle)

        this.question.innerHTML = questionBundle[index].question

        if (questionBundle[index].type === `multiple`)
            generateMultipleAnswer(questionBundle[index])
        else
            generateTextAnswer(questionBundle[index])
    }

    setUpEvent() {
        this.setVisibilityQA();

        this.clockContainer.addEventListener('click', () => {

            if (!this.isCounting && !this.isAnswerAlready) {
                this.switchCounting();
                this.timer = this.startCounting();
                this.setVisibilityQA();
                this.question.innerHTML = this.chooseRandomQuestion(this.listQuestion);
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