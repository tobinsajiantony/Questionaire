import { Component, OnInit } from '@angular/core';
import { authService } from './Services/auth.service';
import { Subscription } from 'rxjs';
import { appService } from './Services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: authService, private appService: appService){
  }

  ngOnInit(): void {
    this.logoutSubscripton = this.appService.logoutSubject.subscribe( data => {
      this.shownav = data
    })
  }

  title = 'Questionaire';
  shownav = false;
  logoutSubscripton: Subscription

  //events
  logout(){
    this.authService.logout()
  }
}
