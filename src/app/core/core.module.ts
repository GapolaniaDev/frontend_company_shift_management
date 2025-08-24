import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "@shared/components/header/header.component";
import {HomeComponent} from "@features/public/home/home.component";
import {ModalComponent} from "@shared/components/modal/modal.component";
import {FooterComponent} from "@shared/components/footer/footer.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderComponent,
    HomeComponent,
    ModalComponent,
    FooterComponent,
  ],
  exports: [HeaderComponent, HomeComponent, ModalComponent, FooterComponent],
})
export class CoreModule {
}
