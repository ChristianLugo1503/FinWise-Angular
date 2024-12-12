import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecsCategoriesComponent } from './specs-categories.component';

describe('SpecsCategoriesComponent', () => {
  let component: SpecsCategoriesComponent;
  let fixture: ComponentFixture<SpecsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecsCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
