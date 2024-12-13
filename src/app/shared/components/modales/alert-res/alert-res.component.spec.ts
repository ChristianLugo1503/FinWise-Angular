import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertRESComponent } from './alert-res.component';

describe('AlertRESComponent', () => {
  let component: AlertRESComponent;
  let fixture: ComponentFixture<AlertRESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertRESComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertRESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
