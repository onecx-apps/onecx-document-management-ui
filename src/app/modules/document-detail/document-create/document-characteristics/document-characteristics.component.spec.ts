import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { DocumentCharacteristicsComponent } from './document-characteristics.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl, FormGroup, FormArray } from '@angular/forms';

describe('DocumentCharacteristicsComponent', () => {
  let component: DocumentCharacteristicsComponent;
  let fixture: ComponentFixture<DocumentCharacteristicsComponent>;
  let genericFormArray: FormArray;
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
      declarations: [DocumentCharacteristicsComponent, TranslatePipeMock],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: MessageService, useClass: MessageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    genericFormArray = new FormArray([
      new FormGroup({
        id: new FormControl('1'),
        name: new FormControl('   John Doe   '),
        value: new FormControl('   Value   '),
      }),
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateForm if charactersticsArray is not null or undefined', () => {
    const mockCharacteristicsArray = ['characteristic1', 'characteristic2'];
    component.charactersticsArray = mockCharacteristicsArray;
    spyOn(component, 'updateForm');
  });

  it('should not call updateForm if charactersticsArray is null', () => {
    component.charactersticsArray = null;
    spyOn(component, 'updateForm');
    expect(component.updateForm).not.toHaveBeenCalled();
  });

  it('should not call updateForm if charactersticsArray is undefined', () => {
    component.charactersticsArray = undefined;
    spyOn(component, 'updateForm');
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

  it('should prevent space when selectionStart is 0 and code is "Space"', () => {
    const event = {
      target: {
        selectionStart: 0,
        code: 'Space',
        preventDefault: jasmine.createSpy('preventDefault'),
      },
    };
    component.preventSpace(event);
    expect(event.target.preventDefault).not.toHaveBeenCalled();
  });

  it('should trim name and value properties', () => {
    component.genericFormArray = genericFormArray;
    component.trimSpace();
    expect(component.genericFormArray.controls[0].value.name).toBe('John Doe');
    expect(component.genericFormArray.controls[0].value.value).toBe('Value');
  });

  it('should not modify the id property', () => {
    component.genericFormArray = genericFormArray;
    component.trimSpace();
    expect(component.genericFormArray.controls[0].value.id).toBe('1');
  });

  it('should prevent default when selectionStart is 0 and code is Space', () => {
    const eventMock = {
      target: {
        selectionStart: 0,
      },
      code: 'Space',
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.preventSpace(eventMock);
    expect(eventMock.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent default when selectionStart is not 0 or code is not Space', () => {
    const eventMock = {
      target: {
        selectionStart: 5,
      },
      code: 'KeyA',
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.preventSpace(eventMock);
    expect(eventMock.preventDefault).not.toHaveBeenCalled();
  });

  it('should clear charactersticsArray', () => {
    component.charactersticsArray = [1, 2, 3];
    component.ngOnDestroy();
    expect(component.charactersticsArray.length).toBe(0);
  });

  it('should reverse and update charactersticsArray', () => {
    component.charactersticsArray = [];
    component.genericFormArray = {
      value: [1, 2, 3],
    } as FormArray<any>;
    component.ngOnDestroy();
    expect(component.charactersticsArray).toEqual([3, 2, 1]);
  });
});
