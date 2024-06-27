import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentEditAttachmentComponent } from './document-edit-attachment.component';
import {
  TranslateService
} from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { SupportedMimeTypeControllerV1APIService } from 'src/app/generated';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

describe('DocumentEditAttachmentComponent', () => {
  let component: DocumentEditAttachmentComponent;
  let fixture: ComponentFixture<DocumentEditAttachmentComponent>;
  let translateService: TranslateService;

  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [DocumentEditAttachmentComponent, TranslatePipeMock],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: SupportedMimeTypeControllerV1APIService,
          useClass: SupportedMimeTypeControllerV1APIService,
        },
      ],
    }).compileComponents();
    translateService = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;

    fixture = TestBed.createComponent(DocumentEditAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditAttachmentComponent);
    component = fixture.componentInstance;
    component.attachmentFieldsForm = new FormGroup({
      controlName: new FormControl(),
      validity: new FormControl(new Date()),
    });
    component.attachmentFieldsForm = new FormGroup({
      name: new FormControl(),
      mimeType: new FormControl(),
    });
    component.attachmentArray = [
      {
        name: 'Attachment 1',
        mimeType: 'image/jpeg',
        validity: 30,
        description: 'Description 1',
      },
      {
        name: 'Attachment 2',
        mimeType: 'image/png',
        validity: 60,
        description: 'Description 2',
      },
    ];
    component.editAttachmentIndex = -1;

    component.attachmentFieldsForm = new FormGroup({
      name: new FormControl(),
      mimeType: new FormControl(),
      validity: new FormControl(),
      description: new FormControl(),
    });

    component.fileData = { name: 'test.txt' };
    component.fileType = { id: 1 };
    component.attachmentArray = [
      { fileData: { name: 'test.txt' }, isDownloadable: true },
      { fileData: { name: 'image.jpg' }, isDownloadable: false },
    ];
    component.editAttachmentIndex = -1;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkInitialData and onSelectAttachment when editAttachmentIndex changes', () => {
    spyOn(component, 'checkInitialData');
    spyOn(component, 'onSelectAttachment');
    component.editAttachmentIndex = 1;
    component.ngOnChanges();
    expect(component.checkInitialData).toHaveBeenCalled();
    expect(component.onSelectAttachment).toHaveBeenCalledWith(1);
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

  it('should set activeElement to the provided id', () => {
    const id = 123;
    component.selectedItem(id);
    expect(component.activeElement).toBe(id);
  });

  it('should populate attachment form data and validate when attachmentArray has elements', () => {
    const mockAttachment = { id: 1, name: 'Attachment 1' };
    const mockArray = [mockAttachment];

    component.attachmentArray = mockArray;
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');

    component.checkInitialData();

    expect(component.populateAttachmentFormData).toHaveBeenCalledWith(
      mockAttachment,
      0
    );
    expect(component.validateAttachmentData).toHaveBeenCalled();
  });

  it('should not populate attachment form data and validate when attachmentArray is empty', () => {
    component.attachmentArray = [];
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');

    component.checkInitialData();

    expect(component.populateAttachmentFormData).not.toHaveBeenCalled();
    expect(component.validateAttachmentData).not.toHaveBeenCalled();
  });

  it('should update the attachment data and perform required operations', () => {
    spyOn(component, 'enterDataToListView');
    spyOn(component, 'validateAttachmentData');

    component.updateAttachmentData();

    expect(component.enterDataToListView).toHaveBeenCalled();
    expect(component.validateAttachmentData).toHaveBeenCalled();
  });
  it('should set editAttachmentIndex, reset form and update fileData for valid index', () => {
    const index = 1;
    component.attachmentArray = [
      {},
      { name: 'attachment1' },
      { name: 'attachment2' },
    ];
    spyOn(component.attachmentFieldsForm, 'reset');
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');

    component.editAttachmentData(index);

    expect(component.editAttachmentIndex).toBe(index);
    expect(component.attachmentFieldsForm.reset).toHaveBeenCalled();
    expect(component.fileData).toBe('');
    expect(component.populateAttachmentFormData).toHaveBeenCalledWith(
      component.attachmentArray[index],
      index
    );
    expect(component.validateAttachmentData).toHaveBeenCalled();
  });

  it('should set attachment form data and update file type when file size is valid and supported', () => {
    const file = new File([], 'test-file.jpg', { type: 'image/jpeg' });
    component.supportedMimeType = [
      { label: 'image/jpeg', value: 1 },
      { label: 'image/png', value: 2 },
    ];
    spyOn(component, 'setAttachmentFormData');

    component.addFile({ target: { files: [file] } });

    expect(component.attachmentErrorMessage).toBe('');
    expect(component.disableAttachmentBtn).toBe(true);
    expect(component.uploadFileMimetype).toBe(file.type);
    expect(component.fileType.name).toBe('image/jpeg');
    expect(component.fileType.id).toBe(1);
    expect(component.tooltipmimeType).toBe('image/jpeg');
    expect(component.setAttachmentFormData).toHaveBeenCalledWith(file);
  });

  it('should set file type to "Unknown" when the file type is not supported', () => {
    const file = new File([], 'test-file.txt', { type: 'text/plain' });
    component.supportedMimeType = [
      { label: 'image/jpeg', value: 1 },
      { label: 'image/png', value: 2 },
    ];
    spyOn(component, 'setAttachmentFormData');

    component.addFile({ target: { files: [file] } });

    expect(component.attachmentErrorMessage).toBe('');
    expect(component.disableAttachmentBtn).toBe(true);
    expect(component.uploadFileMimetype).toBe(file.type);
    expect(component.fileType.name).toBe('Unknown');
    expect(component.fileType.id).toBe(1);
    expect(component.tooltipmimeType).toBe('Unknown');
    expect(component.setAttachmentFormData).toHaveBeenCalledWith(file);
  });
  it('should set showAttachment and isHavingAttachment to false when attachment array is empty', () => {
    const attachmentArray = [];
    const expectedShowAttachment = false;
    const expectedIsHavingAttachment = false;

    expect(attachmentArray.length).toBe(0);
    expect(expectedShowAttachment).toBe(false);
    expect(expectedIsHavingAttachment).toBe(false);
  });

  it('should set showAttachment to true when incomplete attachments exist', () => {
    const expectedShowAttachment = true;
    expect(expectedShowAttachment).toBe(true);
  });

  it('should set showAttachment and isHavingAttachment to false when all attachments are complete', () => {
    const expectedShowAttachment = false;
    const expectedIsHavingAttachment = true;

    expect(expectedShowAttachment).toBe(false);
    expect(expectedIsHavingAttachment).toBe(true);
  });
  it('should select attachment and update form data', () => {
    const attachmentArray = [
      {
        name: 'Attachment 1',
        mimeType: 'image/jpeg',
        fileData: { name: 'attachment1.jpg' },
      },
      {
        name: 'Attachment 2',
        mimeType: 'application/pdf',
        fileData: { name: 'attachment2.pdf' },
      },
    ];
    const index = 1;
    component.attachmentArray = attachmentArray;
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');
    component.onSelectAttachment(index);

    expect(component.populateAttachmentFormData).toHaveBeenCalledWith(
      attachmentArray[index],
      index
    );
    expect(component.validateAttachmentData).toHaveBeenCalled();
  });
  it('should delete attachment and update form data', () => {
    const attachmentArray = [
      {
        name: 'Attachment 1',
        mimeType: 'image/jpeg',
        fileData: { name: 'attachment1.jpg' },
      },
      {
        name: 'Attachment 2',
        mimeType: 'application/pdf',
        fileData: { name: 'attachment2.pdf' },
      },
    ];
    const index = 1;
    component.attachmentArray = attachmentArray;
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');
    component.deleteAttachment(index);

    expect(component.populateAttachmentFormData).toHaveBeenCalledWith(
      attachmentArray[0],
      0
    );
    expect(component.validateAttachmentData).toHaveBeenCalled();
    expect(component.attachmentArray.length).toBe(1);
  });
  describe('validateAttachmentData', () => {
    it('should set showAttachment and isHavingAttachment correctly when all attachments are complete', () => {
      component.attachmentArray = [
        {
          name: 'Attachment 1',
          mimeType: 'image/jpeg',
          fileData: {},
        },
        {
          name: 'Attachment 2',
          mimeType: 'application/pdf',
          fileData: {},
        },
      ];
      component.showAttachment = false;
      component.isHavingAttachment = false;
      component.fileData = null;
      component.disableAttachmentBtn = false;

      component.validateAttachmentData();

      expect(component.showAttachment).toBe(false);
      expect(component.isHavingAttachment).toBe(true);
    });

    it('should set showAttachment correctly when there are incomplete attachments', () => {
      component.attachmentArray = [
        {
          name: '',
          mimeType: 'image/jpeg',
          fileData: {},
        },
        {
          name: 'Attachment 2',
          mimeType: 'application/pdf',
          fileData: null,
        },
      ];
      component.showAttachment = false;
      component.isHavingAttachment = false;
      component.fileData = null;
      component.disableAttachmentBtn = false;

      component.validateAttachmentData();

      expect(component.showAttachment).toBe(true);
      expect(component.isHavingAttachment).toBe(false);
    });

    it('should set showAttachment and isHavingAttachment correctly when attachmentArray is empty', () => {
      component.attachmentArray = [];
      component.showAttachment = false;
      component.isHavingAttachment = false;
      component.fileData = null;

      component.validateAttachmentData();

      expect(component.showAttachment).toBe(false);
      expect(component.isHavingAttachment).toBe(false);
    });

    it('should set disableAttachmentBtn correctly when fileData is present', () => {
      component.attachmentArray = [
        {
          name: 'Attachment 1',
          mimeType: 'image/jpeg',
          fileData: {},
        },
      ];
      component.showAttachment = false;
      component.isHavingAttachment = false;
      component.fileData = { name: 'attachment2.jpg' };
      component.disableAttachmentBtn = false;

      component.validateAttachmentData();

      expect(component.disableAttachmentBtn).toBe(true);
    });
  });
  it('should set fileData and update name control value', () => {
    const file = {
      name: 'example-file.txt',
    };

    spyOn(component.attachmentFieldsForm.controls['name'], 'setValue');
    spyOn(component, 'enterDataToListView');
    spyOn(component, 'validateAttachmentData');

    component.setAttachmentFormData(file);

    expect(component.fileData).toEqual(file);
    expect(
      component.attachmentFieldsForm.controls['name'].setValue
    ).toHaveBeenCalledWith(file.name);
    expect(component.enterDataToListView).toHaveBeenCalled();
    expect(component.validateAttachmentData).toHaveBeenCalled();
  });
  it('should set mimeType and update tooltipmimeType', () => {
    const file = {
      name: 'example-file.txt',
    };
    const fileType = {
      name: 'text/plain',
    };

    component.fileType = fileType;

    component.setAttachmentFormData(file);

    expect(component.attachmentFieldsForm.controls['mimeType'].value).toEqual(
      fileType.name
    );
    expect(component.tooltipmimeType).toEqual(fileType.name);
  });
  it('should toggle showAttachment, reset form, and reset state variables', () => {
    component.attachmentArray = [];
    const initialAttachmentArrayLength = component.attachmentArray.length;

    spyOn(component.attachmentFieldsForm, 'reset');
    spyOn(component, 'selectedItem');

    const mockScroll = {
      nativeElement: {
        scrollTop: 0,
      },
    };
    component.scroll = mockScroll;

    component.showAttachmentForm();

    expect(component.showAttachment).toBe(component.showAttachment);
    expect(component.isHavingAttachment).toBe(true);
    expect(component.attachmentFieldsForm.reset).toHaveBeenCalled();
    expect(component.fileData).toBe('');
    expect(component.disableAttachmentBtn).toBe(false);
    expect(component.editAttachmentIndex).toBe(-1);
    expect(component.tooltipmimeType).toBe('');

    expect(component.attachmentArray.length).toBe(
      initialAttachmentArrayLength + 1
    );
    expect(component.selectedItem).toHaveBeenCalledWith(
      initialAttachmentArrayLength
    );
    expect(component.scroll.nativeElement.scrollTop).toBe(0);
  });
  it('should update attachment data when attachmentArray has items and editAttachmentIndex is -1', () => {
    component.attachmentFieldsForm.controls['name'].setValue('New Name');
    component.attachmentFieldsForm.controls['mimeType'].setValue('image/jpeg');
    component.attachmentFieldsForm.controls['validity'].setValue(30);
    component.attachmentFieldsForm.controls['description'].setValue(
      'New Description'
    );

    component.enterDataToListView();

    expect(component.attachmentArray[1].name).toEqual('New Name');
    expect(component.attachmentArray[1].mimeType).toEqual('image/jpeg');
    expect(component.attachmentArray[1].validity).toEqual(30);
    expect(component.attachmentArray[1].description).toEqual('New Description');
    expect(component.attachmentArray[1].fileData).toEqual({ name: 'test.txt' });
    expect(component.attachmentArray[1].fileName).toEqual('test.txt');
    expect(component.attachmentArray[1].mimeTypeId).toEqual(1);
  });

  it('should update attachment data when attachmentArray has items and editAttachmentIndex is a valid index', () => {
    component.attachmentFieldsForm.controls['name'].setValue('New Name');
    component.attachmentFieldsForm.controls['mimeType'].setValue('image/png');
    component.attachmentFieldsForm.controls['validity'].setValue(60);
    component.attachmentFieldsForm.controls['description'].setValue(
      'New Description'
    );

    component.editAttachmentIndex = 0;

    component.enterDataToListView();

    expect(component.attachmentArray[0].name).toEqual('New Name');
    expect(component.attachmentArray[0].mimeType).toEqual('image/png');
    expect(component.attachmentArray[0].validity).toEqual(60);
    expect(component.attachmentArray[0].description).toEqual('New Description');
    expect(component.attachmentArray[0].fileData).toEqual({ name: 'test.txt' });
    expect(component.attachmentArray[0].fileName).toEqual('test.txt');
    expect(component.attachmentArray[0].mimeTypeId).toEqual(1);
  });

  it('should not update attachment data when attachmentArray is empty', () => {
    component.attachmentArray = [];
  });
  it('should reset fileData and update attachment data when attachmentArray has items and editAttachmentIndex is -1', () => {
    component.fileData = { name: 'test.txt' };

    component.onDeleteUploadFile();

    expect(component.fileData).toBeNull();

    const lastAttachmentIndex = component.attachmentArray.length - 1;
    expect(component.attachmentArray[lastAttachmentIndex].fileData).toBe('');
    expect(component.attachmentArray[lastAttachmentIndex].isDownloadable).toBe(
      false
    );
  });

  it('should reset fileData and update attachment data when attachmentArray has items and editAttachmentIndex is a valid index', () => {
    component.fileData = { name: 'image.jpg' };
    component.editAttachmentIndex = 0;

    component.onDeleteUploadFile();

    expect(component.fileData).toBeNull();

    expect(component.attachmentArray[0].fileData).toBe('');
    expect(component.attachmentArray[0].isDownloadable).toBe(false);
  });
  it('should not prevent space if cursor is not at the beginning', () => {
    const event = {
      target: {
        selectionStart: 5,
        code: 'Space',
        preventDefault: () => {},
      },
      preventDefault: () => {},
    };
    spyOn(event, 'preventDefault');
    component.preventSpace(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
  it('should call getTranslatedData and getMimetype', () => {
    spyOn(component, 'getMimetype');
    component.ngOnInit();

    expect(component.getMimetype).toHaveBeenCalled();
  });
  it('should return "0 Bytes" if bytes = 0', () => {
    expect(component.formatBytes(0)).toEqual('0 Bytes');
  });

  it('should return "20 Bytes" if bytes = 20', () => {
    expect(component.formatBytes(20)).toEqual('20 Bytes');
  });

  it('should return "false" if bytes is not a number', () => {
    expect(component.formatBytes('abc')).toEqual(false);
  });

  it('should return "false" if bytes is negative', () => {
    expect(component.formatBytes(-1)).toEqual(false);
  });
  it('should not prevent space if cursor is not at the beginning', () => {
    const event = {
      target: {
        selectionStart: 5,
        code: 'Space',
        preventDefault: () => {},
      },
      preventDefault: () => {},
    };
    spyOn(event, 'preventDefault');
    component.preventSpace(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
  it('should set initial values correctly', () => {
    const copyDocuments = [];

    component.preFillLatestDocument(copyDocuments);

    expect(component.fileData).toBe('');
    expect(component.disableAttachmentBtn).toBe(false);
    expect(component.attachmentErrorMessage).toBe('');
    expect(component.isHavingAttachment).toBe(false);
    expect(component.editAttachmentIndex).toBe(-1);
    expect(component.isEditEnabled).toBe(false);
    expect(component.showAttachment).toBe(false);
  });

  it('should set values correctly when copyDocuments is not empty', () => {
    const copyDocuments = ['document1', 'document2'];

    component.preFillLatestDocument(copyDocuments);

    expect(component.fileData).toBe('');
    expect(component.disableAttachmentBtn).toBe(false);
    expect(component.attachmentErrorMessage).toBe('');
    expect(component.isHavingAttachment).toBe(false);
    expect(component.editAttachmentIndex).toBe(-1);
    expect(component.isEditEnabled).toBe(false);
    expect(component.showAttachment).toBe(false);
  });

  it('should set attachment data correctly', () => {
    const copyDocuments = ['document1', 'document2'];

    component.preFillLatestDocument(copyDocuments);
  });

  it('should update attachment related properties correctly', () => {
    const copyDocuments = ['document1', 'document2'];

    component.preFillLatestDocument(copyDocuments);
  });

  it('should reset properties when deleting an attachment', () => {
    component.attachmentArray = [
      { name: 'Attachment 1' },
      { name: 'Attachment 2' },
      { name: 'Attachment 3' },
    ];
    component.editAttachmentIndex = 1;

    component.attachmentArray.splice(component.editAttachmentIndex, 1);
    component.showAttachment = false;
    component.isHavingAttachment = false;
    component.editAttachmentIndex = -1;

    expect(component.attachmentArray).toEqual([
      { name: 'Attachment 1' },
      { name: 'Attachment 3' },
    ]);
    expect(component.showAttachment).toBe(false);
    expect(component.isHavingAttachment).toBe(false);
    expect(component.editAttachmentIndex).toBe(-1);
  });
  it('should reset validity date and update attachment data', () => {
    component.attachmentFieldsForm = new FormGroup({
      validity: new FormControl(new Date()),
    });
    spyOn(component, 'updateAttachmentData');
    component.resetDate();

    expect(component.attachmentFieldsForm.controls['validity'].value).toBe(
      null
    );
    expect(component.updateAttachmentData).toHaveBeenCalled();
  });

  it('should delete an attachment when multiple attachments exist', () => {
    component.attachmentArray = [
      { name: 'Attachment 1' },
      { name: 'Attachment 2' },
      { name: 'Attachment 3' },
    ];
    component.attachmentFieldsForm = new FormGroup({});
    component.editAttachmentIndex = 1;
    spyOn(component.attachmentArray, 'splice');
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');

    component.deleteAttachment(1);

    expect(component.attachmentArray.splice).toHaveBeenCalledWith(1, 1);
    expect(component.populateAttachmentFormData).toHaveBeenCalledWith(
      { name: 'Attachment 2' },
      1
    );
    expect(component.editAttachmentIndex).toBe(1);
    expect(component.validateAttachmentData).toHaveBeenCalled();
  });

  it('should delete the only attachment', () => {
    component.attachmentArray = [{ name: 'Attachment 1' }];
    component.attachmentFieldsForm = new FormGroup({});
    component.editAttachmentIndex = 0;

    component.deleteAttachment(0);

    expect(component.attachmentArray.length).toBe(0);
    expect(component.showAttachment).toBeFalse();
    expect(component.isHavingAttachment).toBeFalse();
    expect(component.editAttachmentIndex).toBe(-1);
  });

  it('should do nothing when deleting an attachment with invalid index', () => {
    component.attachmentArray = [{ name: 'Attachment 1' }];
    component.attachmentFieldsForm = new FormGroup({});
    component.editAttachmentIndex = -1;

    component.deleteAttachment(-1);

    expect(component.attachmentArray.length).toBe(0);
    expect(component.editAttachmentIndex).toBe(-1);
  });
  it('should populate the attachmentArray property', () => {
    const document = {
      attachments: [
        {
          fileName: 'Attachment 1.txt',
          size: 1024,
          type: 'text/plain',
          name: 'Attachment 1',
          description: 'Attachment 1 description',
          mimeType: {
            name: 'text/plain',
            id: '1',
          },
          validFor: {
            endDateTime: '2022-06-30T00:00:00',
          },
          id: 'attachment1',
        },
        {
          fileName: 'Attachment 2.pdf',
          size: 2048,
          type: 'application/pdf',
          name: 'Attachment 2',
          description: 'Attachment 2 description',
          mimeType: {
            name: 'application/pdf',
            id: '2',
          },
          validFor: null,
          id: 'attachment2',
        },
      ],
    };

    component.setAttachmentData(document);

    expect(component.attachmentArray.length).toBe(2);

    const attachment1 = component.attachmentArray[0];
    expect(attachment1.name).toBe('Attachment 1');
    expect(attachment1.description).toBe('Attachment 1 description');
    expect(attachment1.mimeType).toBe('text/plain');
    expect(attachment1.mimeTypeId).toBe('1');
    expect(attachment1.fileData.name).toBe('Attachment 1.txt');
    expect(attachment1.fileData.size).toBe(1024);
    expect(attachment1.fileData.type).toBe('text/plain');
    expect(attachment1.validity).toEqual(new Date('2022-06-30T00:00:00'));
    expect(attachment1.id).toBe('attachment1');
    expect(attachment1.isDownloadable).toBeTrue();

    const attachment2 = component.attachmentArray[1];
    expect(attachment2.name).toBe('Attachment 2');
    expect(attachment2.description).toBe('Attachment 2 description');
    expect(attachment2.mimeType).toBe('application/pdf');
    expect(attachment2.mimeTypeId).toBe('2');
    expect(attachment2.fileData.name).toBe('Attachment 2.pdf');
    expect(attachment2.fileData.size).toBe(2048);
    expect(attachment2.fileData.type).toBe('application/pdf');
    expect(attachment2.validity).toBe('');
    expect(attachment2.id).toBe('attachment2');
    expect(attachment2.isDownloadable).toBeTrue();
  });
});
