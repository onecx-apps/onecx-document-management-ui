// Core imports
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Third party imports
import { TranslateService } from '@ngx-translate/core';

// Application imports
import { DocumentDetailDTO } from 'src/app/generated';
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { AttachmentUploadService } from '../../../document-detail/attachment-upload.service';
import { getBestMatchLanguage } from 'src/app/utils';
import { UserService } from '@onecx/portal-integration-angular';

@Component({
  selector: 'app-documents-choose',
  templateUrl: './documents-choose.component.html',
  styleUrls: ['./documents-choose.component.scss'],
})
export class DocumentsChooseComponent implements OnInit {
  @Output() isCheckEvent = new EventEmitter<any>();

  fileCount = 0;
  rowsPerPage = 20;
  isHeaderChecked = false;
  showCount = false;
  results: DocumentDetailDTO[];
  rowsPerPageOptions = [20, 50, 100];
  translatedData: object;
  selectedResults: number;

  constructor(
    private readonly translateService: TranslateService,
    private userService: UserService,
    private readonly dataSharingService: DataSharingService,
    private readonly attachmentUploadService: AttachmentUploadService
  ) {
    this.results = this.dataSharingService.getSearchResults();
    this.onRowClick();
  }
  ngOnInit(): void {
    this.translateService.use(getBestMatchLanguage(this.userService));
    this.getTranslatedData();
  }
  /**
   * function to get translatedData from translateService
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_DOCUMENT',
        'RESULTS.NAME',
        'RESULTS.DOCUMENT_TYPE',
        'RESULTS.STATUS',
        'RESULTS.VERSION',
      ])
      .subscribe((text: object) => {
        this.translatedData = text;
      });
  }
  /**
   * function to check header check box if all the rows have selected
   */
  onRowClick() {
    this.isHeaderChecked = this.results?.every(
      (item: DocumentDetailDTO) => item['isChecked']
    );

    this.isResultsChecked(this.results);
  }

  /**
   * function to check/de-select all the rows depends on header check value
   */
  onHeaderClick() {
    this.results = this.results.map((item) => {
      return {
        ...item,
        isChecked: this.isHeaderChecked,
      };
    });

    this.isResultsChecked(this.results);
  }

  /**
   *
   * @param results
   * @returns truthy/falsy depends on results selection
   */
  isResultsChecked(results: DocumentDetailDTO[]) {
    const isDisabled = results?.filter(
      (result: DocumentDetailDTO) => result['isChecked']
    ).length;
    this.dataSharingService.setSearchResults(results);
    this.isCheckEvent.emit(isDisabled);
    this.selectedResults = isDisabled;
  }

  /**
   * function to get attachment header icon
   */
  getAttachmentHeaderIcon() {
    return (
      this.attachmentUploadService.getAssetsUrl() +
      'images/file-format-icons/attachment.png'
    );
  }

  /**
   * function to get attachment Icon according to file type.
   * And count of files if more than 1 file which are successfully stored in Minio
   * @param result attachment data
   */
  getAttachmentIcon(result) {
    let validAttachmentArray = this.getValidAttachmentArray(result);
    this.fileCount = validAttachmentArray.length;

    if (this.fileCount) {
      if (this.fileCount > 1) {
        this.showCount = true;
        return this.getFolderIconUrl();
      } else {
        this.showCount = false;
        let attachment = validAttachmentArray[0];
        let attachmentIcon = this.getAttachmentIconName(attachment);
        return this.getAttachmentIconUrl(attachmentIcon);
      }
    } else {
      this.showCount = false;
      return this.getEmptyIconUrl();
    }
  }

  /**
   * function to get folderIconUrl
   */
  getFolderIconUrl() {
    return (
      this.attachmentUploadService.getAssetsUrl() +
      'images/file-format-icons/folder.png'
    );
  }

  /**
   * function to get attachmentIcon
   * @param attachment
   * @returns attachmentIcon
   */
  getAttachmentIconName(attachment) {
    const fileName = attachment?.fileName ?? '';
    const fileExtension = fileName.split('.').reverse();
    const fileTypeData = attachment?.mimeType?.name ?? '';
    let attachmentIcon = '';
    if (fileTypeData) {
      const fileType = fileTypeData.split('/');
      const type = fileType[0]?.toLowerCase();
      if (['audio', 'video', 'image'].includes(type)) {
        attachmentIcon = this.getMediaIcon(type);
      } else if (fileExtension.length > 1) {
        const extension = fileExtension[0]?.toLowerCase();
        attachmentIcon = this.getFileExtensionIcon(extension);
      }
    }
    if (!attachmentIcon) {
      attachmentIcon = 'file.png';
    }
    return attachmentIcon;
  }

  /**
   * function to get attachmentIcon based on mediaType
   */
  getMediaIcon(type) {
    let attachmentIcon = '';
    switch (type) {
      case 'audio':
        attachmentIcon = 'audio.png';
        break;
      case 'video':
        attachmentIcon = 'video.png';
        break;
      case 'image':
        attachmentIcon = 'img.png';
        break;
      default:
        attachmentIcon = 'file.png';
    }
    return attachmentIcon;
  }

  /**
   * function to get attachmentIcon based on extension
   */
  getFileExtensionIcon(extension) {
    let attachmentIcon = '';
    switch (extension) {
      case 'xls':
      case 'xlsx':
        attachmentIcon = 'xls.png';
        break;
      case 'doc':
      case 'docx':
        attachmentIcon = 'doc.png';
        break;
      case 'ppt':
      case 'pptx':
        attachmentIcon = 'ppt.png';
        break;
      case 'pdf':
        attachmentIcon = 'pdf.png';
        break;
      case 'zip':
        attachmentIcon = 'zip.png';
        break;
      case 'txt':
        attachmentIcon = 'txt.png';
        break;
      default:
        attachmentIcon = 'file.png';
    }
    return attachmentIcon;
  }

  /**
   * function to get attachmentIconUrl
   */
  getAttachmentIconUrl(attachmentIcon) {
    return (
      this.attachmentUploadService.getAssetsUrl() +
      'images/file-format-icons/' +
      attachmentIcon
    );
  }

  /**
   * function to get emptyIconUrl
   */
  getEmptyIconUrl() {
    return (
      this.attachmentUploadService.getAssetsUrl() +
      'images/file-format-icons/empty.png'
    );
  }

  /**
   * function to invoke if there is logo image error
   */
  imgError(event): void {
    if (!event.target.getAttribute('fallback')) {
      event.target.setAttribute('fallback', true);
      event.target.src =
        this.attachmentUploadService.getAssetsUrl() +
        'images/file-format-icons/file.png';
    }
  }

  /**
   * function to get validAttachmentArray based on storageUploadStaus
   */
  getValidAttachmentArray(result) {
    let attachments = result.attachments ? result.attachments : [];
    let validAttachmentArray = [];
    attachments.forEach((attachment) => {
      if (attachment['storageUploadStatus'] === true) {
        validAttachmentArray.push(attachment);
      }
    });
    return validAttachmentArray;
  }
}
