import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import {
  DocumentControllerV1APIService,
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  GetDocumentByCriteriaRequestParams,
  LifeCycleState,
} from '../../../generated';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss'],
})
export class CriteriaComponent implements OnInit {
  @Input()
  public criteria: GetDocumentByCriteriaRequestParams;
  @Output()
  public criteriaSubmitted = new EventEmitter<GetDocumentByCriteriaRequestParams>();
  @Output()
  public resetEmitter = new EventEmitter();
  public criteriaGroup: UntypedFormGroup;
  public documentTypes: SelectItem[];
  public allDocumentTypes: DocumentTypeDTO[];
  public documentStates: SelectItem[];
  public channelItems: SelectItem[];
  public output: string[];
  public channelName = null;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly translateService: TranslateService,
    private readonly documentTypeRestApi: DocumentTypeControllerV1APIService,
    private readonly documentRestApi: DocumentControllerV1APIService
  ) {}

  public ngOnInit(): void {
    this.initFormGroup();
    this.loadAllDocumentTypes();
    this.loadAllChannels();
  }

  public submitCriteria(): void {
    if (this.criteriaGroup.invalid) {
      return;
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
}
