import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, RequiredValidator, Validators, AbstractControl } from '@angular/forms';
import { questionService } from '../question.service';
import { Subscription } from 'rxjs';
import { Question } from 'src/app/Models/Question.Model';
import { crud } from 'src/app/Services/crud.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit,OnDestroy {

  constructor(private questionService : questionService, private crud: crud) { }
  
  //hooks
  ngOnInit(): void {

    //initialise form
    this.questionEditForm = new FormGroup({
      'questionId': new FormControl(),
      'question': new FormControl(null,Validators.required),
      'options' : new FormArray([],this.customValidator)
    });

    //subjects
    this.subscription = this.questionService.questionSelected.subscribe(question => {
      this.initialiseForm(question);
    })
    this.newSubscription = this.questionService.newQuestion.subscribe(index =>{
      this.initialiseNewForm();
    })
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  //properties
  editMode = false
  newMode = false
  questionId
  question: Question
  questionEditForm: FormGroup
  subscription: Subscription
  newSubscription: Subscription

  //methods
  get options(){
    return (<FormArray>this.questionEditForm.get('options')).controls;
  }

  initialiseForm(question: Question){
    this.onFormClear()
    this.editMode = true;
    this.newMode = false;
    this.question  = question
    this.questionId = question.questionId

    this.questionEditForm.patchValue({
      questionId: this.question.questionId,
      question: this.question.question,
    });
    
    (<FormArray>this.questionEditForm.get('options')).clear();
    this.question.options.forEach(option => {
      (<FormArray>this.questionEditForm.get('options')).push(
        new FormGroup({
          'optionId': new FormControl(option.optionId),
          'optionValue': new FormControl(option.optionValue,[Validators.required]),
          'isAnswer': new FormControl(option.isAnswer)
        })
      )
    });
  }

  initialiseNewForm(){
    this.onFormClear()
    this.newMode = true;
    this.editMode = false;
  }

  //events
  onSubmitForm(){
    if(this.newMode){
      let Id = this.crud.generateDocumentId();
      this.questionEditForm.value['questionId'] = Id
    }
      this.crud.saveDocument('Questions', this.questionEditForm.value).then( value =>{
        this.onFormClear()
      })
    }

  addOptions(){
    (<FormArray>this.questionEditForm.get('options')).push(
      new FormGroup({
        'optionId': new FormControl(this.crud.generateDocumentId()),
        'optionValue': new FormControl(null,[Validators.required]),
        'isAnswer': new FormControl(false)
      })
    )
  }

  deleteOption(index){
    (<FormArray>this.questionEditForm.get('options')).removeAt(index)
  }

  onFormClear(){
    this.questionEditForm.reset();
    (<FormArray>this.questionEditForm.get('options')).clear();
    this.editMode = false
    this.newMode = false
  }

  onFormDelete(){
    this.crud.deleteDocument('Questions', this.questionId)
    this.onFormClear()
  }

  //validators
  customValidator(controls: FormArray){
    let count = 0;
    for(let control of controls.controls){
      if(control.get('isAnswer').value === true)
      count++;
    }
    if(count > 1)
    return {'optionError': true, 'countGreater': true}
    if(count === 0)
    return {'optionError': true, 'countZero': true}
    else
    return null
  }

}
