import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewGroupComponent } from './modal-new-group.component';

describe('ModalNewGroupComponent', () => {
  let component: ModalNewGroupComponent;
  let fixture: ComponentFixture<ModalNewGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
