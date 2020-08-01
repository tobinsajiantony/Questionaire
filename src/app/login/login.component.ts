import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { appService } from '../Services/app.service';
import { Router } from '@angular/router';
import { authService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: authService, private appService: appService) { }

  ngOnInit(): void {
  }

  //properties
  loginMode = true

  //methods
  switchLoginMode(){
    this.loginMode = !this.loginMode
  }


  //events
  submitLogin(loginForm: NgForm){
    let value: {'email': string, 'password': string, 'reenterPassword': string} = loginForm.value
    console.log(loginForm.value)
    if(!this.loginMode){
      if(value.password === value.reenterPassword){
        this.authService.signUpUser(value.email, value.password)
      }
      else{
        this.appService.modalSubject.next({ 
          title: 'oops!',
          body: 'The re-entered password seems to be incorrect. Please try again.',
          actionButtonText: 'OK',
          key: 'signUpError' })
      }
    }
    else{
      this.authService.loginUser(value.email, value.password)
    }
  }
}
