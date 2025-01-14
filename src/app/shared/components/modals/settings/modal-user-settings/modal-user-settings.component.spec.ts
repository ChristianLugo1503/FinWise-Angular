import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserSettingsComponent } from './modal-user-settings.component';

describe('ModalUserSettingsComponent', () => {
  let component: ModalUserSettingsComponent;
  let fixture: ComponentFixture<ModalUserSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
