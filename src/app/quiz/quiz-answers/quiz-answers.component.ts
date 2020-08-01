import { Component, OnInit } from '@angular/core';
import { quizService } from 'src/app/Services/quiz.service';
import { Subscription } from 'rxjs';
import { Question } from 'src/app/Models/Question.Model';

@Component({
  selector: 'app-quiz-answers',
  templateUrl: './quiz-answers.component.html',
  styleUrls: ['./quiz-answers.component.css']
})
export class QuizAnswersComponent implements OnInit {

  constructor(private quizService: quizService) { }

  ngOnInit(): void {
    this.subscription = this.quizService.questionClicked.subscribe(data => {
      this.quizMode = true
      this.question = data
      this.userValue = data.userValue
    })
    this.quizService.answerModeSubject.subscribe(data => {
      this.answerMode = true
    })
    //playground
  }

  //properties
  subscription = new Subscription
  answerModeSubscription = new Subscription
  question: Question
  quizMode = false
  answerMode = false
  userValue = ''
  //methods

  //events
  optionClicked(optionId: string){
    this.userValue = optionId
    this.quizService.updateQuestionUserValue(this.question.questionId, this.userValue)
  }

  clearClick(){
    this.userValue = null
    this.quizService.updateQuestionUserValue(this.question.questionId, this.userValue)
  }

  nextClick(){
    this.quizService.getNextQuestion(this.question.questionId);
  }
}
