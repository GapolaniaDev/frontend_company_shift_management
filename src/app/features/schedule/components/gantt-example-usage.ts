// Ejemplo de uso de los componentes del Gantt
// Este archivo muestra cómo implementar y usar la nueva estructura de componentes

import { Component } from '@angular/core';
import { GanttContainerComponent, Employee, Shift, ViewMode } from './gantt-container/gantt-container.component';

@Component({
  selector: 'app-schedule-example',
  standalone: true,
  imports: [GanttContainerComponent],
  template: `
    <app-gantt-container
      [employees]="employees"
      [currentDate]="currentDate"
      [viewMode]="viewMode"
      [isLoading]="isLoading"
      [error]="error"
      (shiftClick)="onShiftClick($event)"
      (cellClick)="onCellClick($event)"
      (addShift)="onAddShift()">
    </app-gantt-container>
  `
})
export class ScheduleExampleComponent {
  employees: Employee[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: 'https://replicate.delivery/xezq/2Iy4nfF7Z8wf0kBxjSXaiiK9WMvGrFrRMax8o8Y0bdcUr9YUA/out-0.png',
      shifts: {
        '2025-08-01': [
          { id: '1', type: 'morning', startTime: '6', endTime: '2', code: 'A', location: 'HQ' },
          { id: '2', type: 'morning', startTime: '6', endTime: '2', code: 'B', location: 'HQ' },
          { id: '3', type: 'morning', startTime: '6', endTime: '2', code: 'C', location: 'HQ' }
        ],
        '2025-08-05': [
          { id: '4', type: 'morning', startTime: '6', endTime: '2', code: 'M', location: 'HQ' }
        ],
        '2025-08-12': [
          { id: '5', type: 'morning', startTime: '6', endTime: '2', code: 'M', location: 'HQ' }
        ]
      }
    },
    {
      id: '2', 
      name: 'Mike Davis',
      avatar: 'https://replicate.delivery/xezq/8kv9bKZxJg7DMhBBYI6j2AZh2TefkNUbFFoI20QsZD0Ur9YUA/out-0.png',
      shifts: {
        '2025-08-02': [
          { id: '6', type: 'night', startTime: '10', endTime: '6', code: 'N', location: 'HQ' }
        ],
        '2025-08-10': [
          { id: '7', type: 'night', startTime: '10', endTime: '6', code: 'N', location: 'HQ' }
        ],
        '2025-08-06': [
          { id: '8', type: 'morning', startTime: '6', endTime: '2', code: 'M', location: 'HQ' }
        ],
        '2025-08-15': [
          { id: '9', type: 'afternoon', startTime: '2', endTime: '10', code: 'A', location: 'HQ' }
        ]
      }
    }
  ];

  currentDate = new Date(2025, 7, 1); // Agosto 2025
  viewMode: ViewMode = 'month';
  isLoading = false;
  error: string | null = null;

  onShiftClick(event: { shift: Shift; employee: Employee; date: string }): void {
    console.log('Shift clicked:', event);
    // Aquí manejarías la lógica para editar el turno
  }

  onCellClick(event: { employee: Employee; date: string }): void {
    console.log('Cell clicked:', event);
    // Aquí manejarías la lógica para agregar un turno en esa fecha
  }

  onAddShift(): void {
    console.log('Add shift clicked');
    // Aquí manejarías la lógica para agregar un nuevo turno
  }
}

/* 
JERARQUÍA DE COMPONENTES CREADA:

GanttContainer (Contenedor principal)
├── ControlsBar (Barra de controles superior)
├── GanttHeader (Cabecera del calendario)
│   ├── GanttMonthHeader (Muestra el mes/año)
│   └── GanttDayHeader (Lista de días numerados)
└── GanttRow[] (Una fila por empleado)
    ├── GanttRowHeader (Nombre y foto del empleado)
    └── GanttRowCells (Celdas del empleado)
        └── GanttCell[] (Una celda por día)
            └── ShiftBlock[] (Bloques de turnos)

CARACTERÍSTICAS IMPLEMENTADAS:
✅ Componentes modulares y reutilizables
✅ TailwindCSS aplicado con celdas de 52px mínimas
✅ Estructura expandible para vistas mes/semana/día
✅ Colores por tipo de turno (naranja=mañana, azul=tarde, indigo=noche)
✅ Scroll horizontal y sticky headers
✅ Eventos para interacción (clicks en turnos y celdas)
✅ Interfaces TypeScript para tipado fuerte
✅ Arquitectura preparada para funcionalidades futuras

CÓMO USAR:
1. Importar GanttContainerComponent en tu componente padre
2. Proporcionar datos de empleados con sus turnos
3. Manejar eventos de clicks en turnos y celdas
4. Personalizar colores y estilos según necesidades

PRÓXIMOS PASOS SUGERIDOS:
- Conectar con tu servicio de datos existente
- Implementar filtros y búsqueda
- Agregar tooltips y modals
- Implementar drag & drop para turnos
- Agregar animaciones y transiciones
*/