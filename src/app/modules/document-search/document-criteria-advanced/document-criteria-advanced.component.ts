import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import {
  DocumentTypeDTO,
  DocumentTypeControllerV1APIService,
  DocumentControllerV1APIService,
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
  public criteria: GetDocumentByCriteriaRequestParams;
  @Output() criteriaSubmitted =
    new EventEmitter<GetDocumentByCriteriaRequestParams>();
  @Output() public resetEmitter = new EventEmitter();
  criteriaGroup: UntypedFormGroup;
  public documentTypes: SelectItem[];
  public channelItems: SelectItem[];
  public documentStatus: SelectItem[];
  public allDocumentTypes: DocumentTypeDTO[];

  constructor(
    private fb: UntypedFormBuilder,

    private readonly documentTypeRestApi: DocumentTypeControllerV1APIService,
    private readonly documentRestApi: DocumentControllerV1APIService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.loadAllDocumentTypes();
    this.loadAllChannels();
    this.loadDocumentStatus();
  }

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

  public resetFormGroup(): void {
    this.resetEmitter.emit();
  }

  private initFormGroup(): void {
    this.criteriaGroup = this.fb.group({
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

  private loadAllDocumentTypes(): void {
    this.documentTypeRestApi.getAllTypesOfDocument().subscribe((results) => {
      this.allDocumentTypes = results;
      this.documentTypes = results.map((type) => ({
        label: type.name,
        value: type.id,
      }));
    });
  }

  private loadAllChannels(): void {
    this.documentRestApi.getAllChannels().subscribe((result) => {
      this.channelItems = result.map((el) => {
        return { label: el.name, value: el.name };
      });
    });
  }
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
