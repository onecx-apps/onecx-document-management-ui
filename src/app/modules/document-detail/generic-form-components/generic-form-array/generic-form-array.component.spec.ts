import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AttachmentDTO } from 'src/app/generated';

import { GenericFormArrayComponent } from './generic-form-array.component';

describe('BasicFormArrayComponent', () => {
  let component: GenericFormArrayComponent<AttachmentDTO>;
  let fixture: ComponentFixture<GenericFormArrayComponent<AttachmentDTO>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericFormArrayComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
