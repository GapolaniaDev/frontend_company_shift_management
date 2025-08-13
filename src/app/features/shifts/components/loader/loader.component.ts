import { Component } from '@angular/core'
import {LoaderService} from "@core/services/loader.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}

  get isLoading() {
    return this.loaderService.isLoading;
  }
}
