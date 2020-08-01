import { Component, OnInit } from '@angular/core';
import { questionService } from './question.service';
import { Question } from '../Models/Question.Model';
import { Subscription } from 'rxjs';
import { crud } from '../Services/crud.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor(private questionService : questionService,private crud: crud) { }

  ngOnInit(): void {
    this.crudSubscription = this.crud.getCollection('Questions').subscribe(data => {
      this.questions = data
  }, error => {
      alert(error);
  })
  }
  //Properties
  isHover = ''
  questionId = ''
  questions
  crudSubscription = new Subscription()

  //Methods
  questionClicked(index: string){
    this.questionId = index
    this.questionService.questionSelected.next(this.questions.find(x => x.questionId === this.questionId));
  }

  addNewQuestion(){
    this.questionService.newQuestion.next();
  }
}
