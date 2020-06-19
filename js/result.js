class resultArea {
    constructor(params) {
       
        this.resultContainer = params.resultContainer;

        this.btnSubmit = params.btnSubmit;

        this.setUpEvent();
    }

    resultList = [];

    answerCheckList = [];

    booleanResultList = [];

    saveResult(key) {
        this.resultList[this.indexQuestion] = key;
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

      getContentAnswer(i){
        let stringContent = '';
    
        if(!this.resultList[i]){
          return 'No answer';
        }
    
        console.log(this.questionBundle[this.questionsOrder[i]].type);
    
        if(this.questionBundle[this.questionsOrder[i]].type === TEXT_TYPE){
          console.log("text result");
          console.log("this result list: ", this.resultList)
          console.log("this i: ", i)
          console.log("this answer: ", this.resultList[i]);
          stringContent = this.resultList[i];
        }else{
         stringContent = this.questionBundle[this.questionsOrder[i]]
          .answerList.find(answer => answer.key === this.resultList[i]).content;
        }
        console.log("stringContent: ", stringContent);
        console.log("question: ", this.questionBundle[this.questionsOrder[i]].question);
    
        return stringContent;
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

      setUpEvent() {
        this.btnSubmit.addEventListener('click', () => {
            this.finishTest();
          })
      }
}