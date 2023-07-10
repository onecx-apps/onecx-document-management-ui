// Core imports
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Third party imports
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';

// Application imports
import {
  DocumentControllerV1APIService,
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  GetDocumentByCriteriaRequestParams,
} from '../../../generated';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss'],
})
export class CriteriaComponent implements OnInit {
  @Input()
  criteria: GetDocumentByCriteriaRequestParams;
  @Output()
  criteriaSubmitted = new EventEmitter<GetDocumentByCriteriaRequestParams>();
  @Output()
  resetEmitter = new EventEmitter();

  criteriaGroup: UntypedFormGroup;
  allDocumentTypes: DocumentTypeDTO[];
  channelItems: SelectItem[];
  documentStates: SelectItem[];
  documentTypes: SelectItem[];
  output: string[];

  channelName = null;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly documentTypeV1Service: DocumentTypeControllerV1APIService,
    private readonly documentV1Service: DocumentControllerV1APIService
  ) {}

  public ngOnInit(): void {
    this.initFormGroup();
    this.loadAllDocumentTypes();
    this.loadAllChannels();
  }
  /**
   * function emits the criteria group value
   */
  public submitCriteria(): void {
    if (this.criteriaGroup.invalid) {
      return;
    }
    this.criteriaSubmitted.emit(this.criteriaGroup.value);
  }
  /**
   * function to reset the search
   */
  public resetFormGroup(): void {
    this.resetEmitter.emit();
  }
  /**
   * function to initialize search criteria as a null value
   */
  private initFormGroup(): void {
    this.criteriaGroup = this.formBuilder.group({
      channelName: null,
      name: null,
      typeId: null,
    });
  }

  /**
   * Wrapper method for loadAllDocumentTypes() to write Unit Test for this private method
   */
  public loadAllDocumentTypesWrapper(): void {
    this.loadAllDocumentTypes();
  }

  /**
   * Wrapper method for loadAllChannels() to write Unit Test for this private method
   */
  public loadAllChannelsWrapper(): void {
    this.loadAllChannels();
  }

  /**
   * function to load all document types
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
}
