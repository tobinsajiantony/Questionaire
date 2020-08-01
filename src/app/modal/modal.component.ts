import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { appService } from '../Services/app.service';

declare var $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  constructor(private appService: appService) { }

  ngOnInit(): void {
    this.modalSubscription = this.appService.modalSubject.subscribe(data => {
      this.title = data.title
      this.body = data.body
      this.actionButtonText = data.actionButtonText
      this.key = data.key
      $('#myModal').modal('show')
    })
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
  }

  //properties
  title: string
  body: string
  key: string
  actionButtonText
  modalSubscription = new Subscription

  //Methods

  //Events
  modalActionClicked(){
    if(this.key === 'stopTestConformation'){
      $('#myModal').modal('toggle')
      this.appService.modalResponseSubject.next('stopTestConfirmed')
      //redirect code
    }
    else if(this.key === 'testSubmittedModal'){
      $('#myModal').modal('toggle')
      this.appService.modalResponseSubject.next('viewAnswersClicked')
    }
    else if(this.key === 'loginError'){
      $('#myModal').modal('toggle')
    }
    else if(this.key === 'signUpError'){
      $('#myModal').modal('toggle')
    }
  }
}
