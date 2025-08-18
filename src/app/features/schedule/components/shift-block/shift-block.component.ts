import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Shift {
  id: string;
  type: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  code: string;
  location?: string;
}

@Component({
  selector: 'app-shift-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shift-block.component.html',
  styleUrl: './shift-block.component.css'
})
export class ShiftBlockComponent {
  @Input() shift!: Shift;
  @Input() isSelected: boolean = false;
  @Input() isHovered: boolean = false;

  @Output() shiftClick = new EventEmitter<Shift>();
  @Output() shiftHover = new EventEmitter<Shift>();

  @HostBinding('class') get cssClass() {
    return this.getShiftTypeClasses();
  }

  getShiftTypeClasses(): string {
    const baseClasses = 'border-l-4 mb-1 flex flex-col justify-center items-center cursor-pointer transition-colors';
    
    switch (this.shift.type) {
      case 'morning':
        return `${baseClasses} bg-orange-100 border-orange-500 text-orange-800 hover:bg-orange-200`;
      case 'afternoon':
        return `${baseClasses} bg-blue-100 border-blue-500 text-blue-800 hover:bg-blue-200`;
      case 'night':
        return `${baseClasses} bg-indigo-100 border-indigo-500 text-indigo-800 hover:bg-indigo-200`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-500 text-gray-800 hover:bg-gray-200`;
    }
  }

  getTimeDisplay(): string {
    return `${this.shift.startTime}-${this.shift.endTime}`;
  }

  getCodeTextColor(): string {
    switch (this.shift.type) {
      case 'morning':
        return 'text-orange-600';
      case 'afternoon':
        return 'text-blue-600';
      case 'night':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  }

  onClick(): void {
    this.shiftClick.emit(this.shift);
  }

  onMouseEnter(): void {
    this.shiftHover.emit(this.shift);
  }
}