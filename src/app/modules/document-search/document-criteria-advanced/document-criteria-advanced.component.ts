// Core imports
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Third party imports
import { SelectItem } from 'primeng/api';

// Application imports
import {
  DocumentControllerV1APIService,
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  GetDocumentByCriteriaRequestParams,
  LifeCycleState,
} from 'src/app/generated';

@Component({
  selector: 'app-document-criteria-advanced',
  templateUrl: './document-criteria-advanced.component.html',
  styleUrls: ['./document-criteria-advanced.component.scss'],
})
export class DocumentCriteriaAdvancedComponent implements OnInit {
  @Input()
  criteria: GetDocumentByCriteriaRequestParams;
  @Output() criteriaSubmitted =
    new EventEmitter<GetDocumentByCriteriaRequestParams>();
  @Output() resetEmitter = new EventEmitter();

  criteriaGroup: UntypedFormGroup;
  allDocumentTypes: DocumentTypeDTO[];
  channelItems: SelectItem[];
  documentStatus: SelectItem[];
  documentTypes: SelectItem[];

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly documentTypeV1Service: DocumentTypeControllerV1APIService,
    private readonly documentV1Service: DocumentControllerV1APIService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.loadAllDocumentTypes();
    this.loadAllChannels();
    this.loadDocumentStatus();
  }
  /**
   *
   * @returns criteria group value
   */
  public submitCriteria(): void {
    if (this.criteriaGroup.invalid) {
      return;
    }
    if (this.criteriaGroup.value.startDate) {
      this.criteriaGroup.value.startDate.setHours(0, 0, 0, 0);
    }
    if (this.criteriaGroup.value.endDate) {
      this.criteriaGroup.value.endDate.setHours(23, 59, 59, 999);
    }

    this.criteriaSubmitted.emit(this.criteriaGroup.value);
  }
  /**
   * function to emit reset form group
   */
  public resetFormGroup(): void {
    this.resetEmitter.emit();
  }
  /**
   * function to initiate form for advance search
   */
  private initFormGroup(): void {
    this.criteriaGroup = this.formBuilder.group({
      channelName: null,
      name: null,
      typeId: null,
      state: null,
      id: null,
      startDate: null,
      endDate: null,
      createdBy: null,
      objectReferenceId: null,
      objectReferenceType: null,
    });
  }

  /**
   * Wrapper method for loadAllDocumentTypes() to write Unit Test for this private method
   */
  public loadAllDocumentTypesWrapper(): void {
    this.loadAllDocumentTypes();
  }

  /**
   * Wrapper method for loadAllChannels(); to write Unit Test for this private method
   */
  public loadAllChannelWrapper(): void {
    this.loadAllChannels();
  }
  /**
   * function to load all document types to show in the dropdown for document type in advance search
   */
  private loadAllDocumentTypes(): void {
    this.documentTypeV1Service.getAllTypesOfDocument().subscribe((results) => {
      this.allDocumentTypes = results;
      this.documentTypes = results.map((type) => ({
        label: type.name,
        value: type.id,
      }));
    });
  }
  /**
   * function to get all the channels
   */
  private loadAllChannels(): void {
    this.documentV1Service.getAllChannels().subscribe((result) => {
      this.channelItems = result.map((el) => {
        return { label: el.name, value: el.name };
      });
    });
  }
  /**
   * function to load all document status
   */
  private loadDocumentStatus(): void {
    this.documentStatus = Object.keys(LifeCycleState).map((key) => ({
      label: LifeCycleState[key],
      value: key,
    }));
  }
  /**
   * function to reset the fields
   */
  fieldReset(controlName: string) {
    this.criteriaGroup?.controls[controlName].reset();
  }
}
