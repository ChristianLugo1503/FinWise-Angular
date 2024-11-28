import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesByCategoryComponent } from './expenses-by-category.component';

describe('ExpensesByCategoryComponent', () => {
  let component: ExpensesByCategoryComponent;
  let fixture: ComponentFixture<ExpensesByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesByCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
