import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewCategoryComponent } from './modal-new-category.component';

describe('ModalNewCategoryComponent', () => {
  let component: ModalNewCategoryComponent;
  let fixture: ComponentFixture<ModalNewCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
