import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AttachmentDTO } from 'src/app/generated';

import { GenericFormGroupComponent } from './generic-form-group.component';

describe('GenericFormGroupComponent', () => {
  let component: GenericFormGroupComponent<AttachmentDTO>;
  let fixture: ComponentFixture<GenericFormGroupComponent<AttachmentDTO>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericFormGroupComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
