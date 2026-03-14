import { Injectable } from '@angular/core';
import { Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private authService: AuthService,
    private router: Router,

  ) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    // route: ActivatedRoute,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this.authService.isLoggedIn();
    if (this.authService.isLoggedIn()) {
      // console.log(next, state)
      // if (this.getStatus(state)) {
        return true;
      // } else {
        // this.router.navigate(['/dashboard']);
        // return false;
      // }
      // console.log('das', this.authService.isLoggedIn());
      // this.router.navigateByUrl('/dashboard');
      // this.router.navigate(['/dashboard']);
    } else {
      // console.log('login');
      // this.router.navigateByUrl('/login');
      this.router.navigate(['/login']);
      return false;
    }
  }

  getStatus(state) {
    if (state.url == '/dashboard') {
      return true;
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
