import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentEditCharacteristicsComponent } from './document-edit-characteristics.component';
import { TranslateService } from '@ngx-translate/core';
import { providePortalMessageServiceMock } from '@onecx/portal-integration-angular/mocks';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';

describe('DocumentEditCharacteristicsComponent', () => {
  let component: DocumentEditCharacteristicsComponent;
  let fixture: ComponentFixture<DocumentEditCharacteristicsComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      declarations: [DocumentEditCharacteristicsComponent, TranslatePipeMock],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        providePortalMessageServiceMock(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trim the name and value', () => {
    const form = new FormGroup({
      genericFormArray: new FormArray([
        new FormGroup({
          id: new FormControl('1'),
          name: new FormControl('   John   '),
          value: new FormControl('   Value   '),
        }),
      ]),
    });
    component.genericFormArray = form.get('genericFormArray') as FormArray;
    component.trimSpace();
    const trimmedName = component.genericFormArray.controls[0].value.name;
    const trimmedValue = component.genericFormArray.controls[0].value.value;
    expect(trimmedName).toBe('John');
    expect(trimmedValue).toBe('Value');
  });

  it('should not modify the name and value if they have no leading or trailing spaces', () => {
    const form = new FormGroup({
      genericFormArray: new FormArray([
        new FormGroup({
          id: new FormControl('1'),
          name: new FormControl('John'),
          value: new FormControl('Value'),
        }),
      ]),
    });
    component.genericFormArray = form.get('genericFormArray') as FormArray;
    component.trimSpace();
    const unchangedName = component.genericFormArray.controls[0].value.name;
    const unchangedValue = component.genericFormArray.controls[0].value.value;
    expect(unchangedName).toBe('John');
    expect(unchangedValue).toBe('Value');
  });

  it('should not prevent space key press at the middle or end of the input', () => {
    const event = {
      target: {
        selectionStart: 5,
        code: 'Space',
        preventDefault: jasmine.createSpy('preventDefault'),
      },
    };
    component.preventSpace(event);
    expect(event.target.preventDefault).not.toHaveBeenCalled();
  });
});
