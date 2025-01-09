import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCategoryComponent } from './input-category.component';

describe('InputCategoryComponent', () => {
  let component: InputCategoryComponent;
  let fixture: ComponentFixture<InputCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
