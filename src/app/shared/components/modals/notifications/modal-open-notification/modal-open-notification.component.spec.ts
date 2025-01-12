import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOpenNotificationComponent } from './modal-open-notification.component';

describe('ModalOpenNotificationComponent', () => {
  let component: ModalOpenNotificationComponent;
  let fixture: ComponentFixture<ModalOpenNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalOpenNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOpenNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
