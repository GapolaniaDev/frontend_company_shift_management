import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";

import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private LoginService: LoginService) {
  }

  ngOnInit(): void {
    this.LoginService.getData().subscribe(data => {
      console.log(data);
    });
  }

}
