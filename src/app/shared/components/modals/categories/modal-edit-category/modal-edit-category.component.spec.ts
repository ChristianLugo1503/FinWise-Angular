import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditCategoryComponent } from './modal-edit-category.component';

describe('ModalEditCategoryComponent', () => {
  let component: ModalEditCategoryComponent;
  let fixture: ComponentFixture<ModalEditCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
