import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root' // Asegúrate de que 'providedIn: root' está declarado
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false); // Estado inicial: `false`
  public isLoading = this.loadingSubject.asObservable(); // Observable que el loader escuchará

  constructor() {}

  show() {
    this.loadingSubject.next(true); // Cambiar el estado a `true` (mostrar loader)
  }

  hide() {
    this.loadingSubject.next(false); // Cambiar el estado a `false` (ocultar loader)
  }
}
