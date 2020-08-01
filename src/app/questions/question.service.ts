import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Question } from '../Models/Question.Model';
import { AngularFirestore } from '@angular/fire/firestore';
import { crud } from '../Services/crud.service';

@Injectable({
    providedIn: 'root'
})
export class questionService{

    constructor(private afs: AngularFirestore, private crud: crud){
    }
    //Properties
    crudSubscription = new Subscription
    questions: Question[]
    questionName
    questionSelected = new Subject<Question>();
    newQuestion = new Subject<void>();
    //Events
}