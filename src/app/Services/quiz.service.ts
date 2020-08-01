import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Question } from '../Models/Question.Model';
import { crud } from './crud.service';

@Injectable({
    providedIn: 'root'
})
export class quizService {

    constructor(private crud: crud) { }
    //properties
    questionClicked = new Subject<Question>();
    questions: Question[]
    questionsSubject = new Subject<Question[]>()
    answerModeSubject = new Subject<void>();
    answerMode = false
    noOfCorrectAnswers: number = 0
    //methods
    getQuestions() {
        this.crud.getCollection('Questions').subscribe(data => {
            this.questions = data
            this.questionsSubject.next(this.questions);
        })
    }

    updateAnswerMode() {
        this.answerMode = true
        this.answerModeSubject.next();
    }

    updateQuestionUserValue(questionId: string, optionId: string) {
        if (!this.answerMode) {
            this.questions.find(x => x.questionId === questionId).userValue = optionId
            if (optionId != null) {
                if (this.questions.find(x => x.questionId === questionId).options.find(y => y.isAnswer === true).optionId === optionId) {
                    this.questions.find(x => x.questionId === questionId).isCorrect = true
                }
                else {
                    this.questions.find(x => x.questionId === questionId).isCorrect = false
                }
                console.log(this.questions.find(x => x.questionId === questionId))
                this.questionsSubject.next(this.questions);
            }
            else {
                this.questions.find(x => x.questionId === questionId).isCorrect = null
            }
        }
    }

    getNoOfAnswers() {
        this.questions.forEach(question => {
            if (question.isCorrect === true)
                this.noOfCorrectAnswers++
        })
        return {
            'noOfQuestions': this.questions.length,
            'noOfnoOfCorrectAnswers': this.noOfCorrectAnswers
        }
    }

    getNextQuestion(questionId: string) {
        let index = this.questions.findIndex(x => x.questionId === questionId)
        if (index != (this.questions.length - 1))
            this.questionClicked.next(this.questions[index + 1]);
        else
            this.questionClicked.next(this.questions[0]);
    }
}