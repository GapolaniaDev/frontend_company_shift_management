import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShiftSettingsComponent} from './shift-settings.component';

describe('ShiftSettingsComponent', () => {
  let component: ShiftSettingsComponent;
  let fixture: ComponentFixture<ShiftSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
