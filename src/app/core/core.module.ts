import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    ModalComponent,
    FooterComponent,
  ],
  imports: [CommonModule],
  exports: [HeaderComponent, HomeComponent, ModalComponent, FooterComponent],
})
export class CoreModule {}
