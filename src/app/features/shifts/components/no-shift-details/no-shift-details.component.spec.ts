import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoShiftDetailsComponent} from './no-shift-details.component';

describe('NoShiftDetailsComponent', () => {
  let component: NoShiftDetailsComponent;
  let fixture: ComponentFixture<NoShiftDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoShiftDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoShiftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
