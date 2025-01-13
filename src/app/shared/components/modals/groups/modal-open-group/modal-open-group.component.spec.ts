import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOpenGroupComponent } from './modal-open-group.component';

describe('ModalOpenGroupComponent', () => {
  let component: ModalOpenGroupComponent;
  let fixture: ComponentFixture<ModalOpenGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalOpenGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOpenGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
