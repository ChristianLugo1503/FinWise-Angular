import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAbonoSavingComponent } from './modal-abono-saving.component';

describe('ModalAbonoSavingComponent', () => {
  let component: ModalAbonoSavingComponent;
  let fixture: ComponentFixture<ModalAbonoSavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAbonoSavingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAbonoSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
