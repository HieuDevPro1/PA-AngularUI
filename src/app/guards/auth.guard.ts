import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): Promise<boolean> | boolean => {
  const userService = inject(UsersService)
  const router = inject(Router)
  
  return new Promise((resolve,reject)=>{
  userService.getCurrentUser()
    .then(user=>{
      resolve(true)
    }, 
    err=>{
    resolve(false);
    router.navigate(["/login"]);
    }
  )
  }) 
};

