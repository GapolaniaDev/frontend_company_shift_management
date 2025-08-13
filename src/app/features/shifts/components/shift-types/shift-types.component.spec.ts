import { ComponentFixture, TestBed } from '@angular/core/testing';

import {ShiftTypesComponent} from "@features/shifts";

describe('ShiftTypesComponent', () => {
  let component: ShiftTypesComponent;
  let fixture: ComponentFixture<ShiftTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
