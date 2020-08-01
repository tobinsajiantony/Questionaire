import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { authService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class userAuthGuard implements CanActivate{
  constructor(private authService: authService, private router: Router){
  }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let user = this.authService.getUser()
        if(user != null){
          return true
        }
        else{
          this.router.navigate(['login'])
          console.log('false')
          return false
        }
    }
}