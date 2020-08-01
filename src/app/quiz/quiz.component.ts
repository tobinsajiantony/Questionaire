import { Component, OnInit, OnDestroy } from '@angular/core';
import { crud } from '../Services/crud.service';
import { Subscription } from 'rxjs';
import { Question } from '../Models/Question.Model';
import { quizService } from '../Services/quiz.service';
import { database } from 'firebase';
import { appService } from '../Services/app.service';
import { QuizAndUserValuesModel } from '../Models/QuizAndUserValues.model';
import { authService } from '../Services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {

  constructor(private crud: crud, private quizService: quizService
    , private appService: appService, private authService: authService) { }

  ngOnInit(): void {
    this.crud.getCollectionQuerying('userResults', 'email', this.authService.getUserEmail()).subscribe(data => {
      if (data.length > 0) {
        this.viewAnswers = true;
        this.testFinished = true;
        console.log(data)
        this.questions = data[0].questions
        this.quizService.answerModeSubject.next();
      }
      else {
        this.quizService.getQuestions()
        this.testTimeSubscription = this.crud.getCollection('Time').subscribe(data => {
          this.testTime = data[0].time;
          this.timeLeft = this.calculateTimeLeft(this.testTime)
          this.warningTIme = data[0].warningTime;
          console.log(this.testTime)
          this.enableTest = true
        })
        this.questionsSubscription = this.quizService.questionsSubject.subscribe(data => {
          this.questions = data
        })
        this.modalResponseSubscription = this.appService.modalResponseSubject.subscribe(data => {
          if (data === 'stopTestConfirmed') {
            this.submitTest();
          }
          else if (data === 'viewAnswersClicked') {
            this.finishTest();
          }
        })

        this.nextQuestionClickedSubscription = this.quizService.questionClicked.subscribe((data) => {
          this.questionId = data.questionId
        })
      }
    })

  }

  ngOnDestroy() {
    this.questionsSubscription.unsubscribe();
    this.testTimeSubscription.unsubscribe();
    this.modalResponseSubscription.unsubscribe();
    this.nextQuestionClickedSubscription.unsubscribe();
  }

  //properties
  isHover = ''
  questionsSubscription = new Subscription
  testTimeSubscription = new Subscription
  modalResponseSubscription = new Subscription
  nextQuestionClickedSubscription = new Subscription
  questions: Question[]
  questionId = ''
  enableTest = false
  testTime: number
  warningTIme: number
  warning = false
  timeLeft: string
  testStarted = false
  testFinished = false
  viewAnswers = false
  timer

  //Events
  questionClicked(questionId: string) {
    this.questionId = questionId
    console.log(questionId);
    this.quizService.questionClicked.next(this.questions.find(x => x.questionId === this.questionId));
  }

  //Methods
  startTestClicked() {
    if (this.testStarted === false) {
      this.testStarted = true
      this.timer = setInterval(() => {
        if (this.testTime > 0) {
          this.testTime = this.testTime - 1000
          this.timeLeft = this.calculateTimeLeft(this.testTime)
          if (this.testTime < this.warningTIme)
            this.warning = true
        }
        else {
          this.submitTest();
        }
      }, 1000)
    }
    else if (this.testStarted === true) {
      this.appService.modalSubject.next({
        title: 'Are you sure ?',
        body: 'Once submited you cannot continue test and your current progress will be saved and considered for evaluation',
        actionButtonText: 'Submit Test',
        key: 'stopTestConformation'
      })
    }
  }

  submitTest() {
    clearInterval(this.timer);
    this.testFinished = true
    let questionCount = this.quizService.getNoOfAnswers()
    let questionAndUserValues: QuizAndUserValuesModel = new QuizAndUserValuesModel(
      new Date().toDateString(), this.authService.getUserEmail(), this.questions
    )
    this.crud.saveCommonDocument('userResults', questionAndUserValues).then(() => {
      this.appService.modalSubject.next({
        title: 'Congradulations !',
        body: 'You got ' + questionCount.noOfnoOfCorrectAnswers + ' out of ' + questionCount.noOfQuestions + ' questions correct.',
        actionButtonText: 'View Answers',
        key: 'testSubmittedModal'
      })
    })
  }

  finishTest() {
    this.viewAnswers = true
    this.quizService.updateAnswerMode()
    this.questions.forEach(x => {

    })
  }

  calculateTimeLeft(miliseconds: number) {
    let hours = parseInt(((this.testTime / (1000 * 60 * 60)) % 24).toString());
    let minutes = parseInt(((this.testTime / (1000 * 60)) % 60).toString())
    let seconds = parseInt(((this.testTime / 1000) % 60).toString())
    return '' + hours + ' : ' + minutes + ' : ' + seconds
  }
}
