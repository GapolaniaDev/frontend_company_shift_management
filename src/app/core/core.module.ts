import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "@core/components/header/header.component";
import {HomeComponent} from "@core/components/home/home.component";
import {ModalComponent} from "@core/components/modal/modal.component";
import {FooterComponent} from "@core/components/footer/footer.component";

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
