import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { appService } from './app.service';

@Injectable({
    providedIn: 'root'
})

export class authService {
    constructor(private afa: AngularFireAuth, private appService: appService, private router: Router) {
    }

    //properties
    private user: firebase.User
    subscription

    getUser() {
        return this.user
    }

    loginUser(email: string, password: string) {
        this.subscription = this.afa.signInWithEmailAndPassword(email, password).then(data => {
            if (data) {
                this.user = data.user
                if (this.user.displayName === 'student')
                    this.router.navigate(['quiz'])
                else
                    this.router.navigate(['questions'])
                this.appService.logoutSubject.next(true);
            }
        }).catch(error => {
            this.appService.modalSubject.next({
                title: 'Oops!',
                body: error.message,
                actionButtonText: 'OK',
                key: 'loginError'
            })
        })
    }

    signUpUser(email: string, password: string) {
        this.afa.createUserWithEmailAndPassword(email, password).then((data) => {
            data.user.updateProfile({
                displayName: 'student'
            }).then(() => {
                this.user = data.user
                if (this.user.displayName === 'student')
                    this.router.navigate(['quiz'])
                else
                    this.router.navigate(['questions'])
                this.appService.logoutSubject.next(true);
            })

        }).catch(error => {
            this.appService.modalSubject.next({
                title: 'Oops!',
                body: error.message,
                actionButtonText: 'OK',
                key: 'loginError'
            })
        })
    }

    getUserEmail(){
        return this.user.email
    }

    logout(){
        this.user = null
        this.router.navigate(['login'])
        this.appService.logoutSubject.next(false);
    }
}
