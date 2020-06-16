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

    startCounting() {
        return setInterval(() => {
            this.handleTimeIncrement();
        }, 1000);
    }

    stopCounting(savedInterval) {
        return clearInterval(savedInterval);
    }

    normalizeTime(number){
        return number < 10 ? ('0'+ number) : number;
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

    chooseRandomQuestion() {
        const randomNum = Math.random()* 1000;

        const index = Math.floor(randomNum%this.listQuestion.length);

        return this.listQuestion[index];
    }

    setUpEvent() {
        this.setVisibilityQA();

        this.clockContainer.addEventListener('click', () => {

            if (!this.isCounting && !this.isAnswerAlready) {
                this.switchCounting();
                this.timer = this.startCounting();
                this.setVisibilityQA();
                this.question.innerHTML = this.chooseRandomQuestion();
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