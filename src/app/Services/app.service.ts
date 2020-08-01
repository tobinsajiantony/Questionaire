import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class appService{
  //properties
  modalSubject = new Subject<{title: string, 
    body: string, 
    actionButtonText: string,
    key: string}>();

  modalResponseSubject = new Subject<string>();
  logoutSubject = new Subject<boolean>();
}