import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuOpen = false;
  screenIsMobile: boolean = false;

  @Output() menuOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Alterna el estado del menú
  }

  ngOnInit(): void {
    this.checkScreenSize(); // Define si es móvil o desktop al cargar la página
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    this.screenIsMobile = window.innerWidth < 1024; // lg breakpoint en Tailwind (1024px)
  }

  private setDefaultMenuState(): void {
    if (!this.screenIsMobile) {
      this.menuOpen = true;
      this.menuOpenChange.emit(this.menuOpen); // Emitimos el estado inicial
    } else {
      this.menuOpen = false;
      this.menuOpenChange.emit(this.menuOpen); // Emitimos el estado inicial
    }
  }
}
