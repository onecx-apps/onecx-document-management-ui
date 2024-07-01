// Core imports
import { Component, Input, OnInit } from '@angular/core';

// Third party imports
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@onecx/portal-integration-angular';

// Application imports
import { DocumentDetailDTO } from 'src/app/generated';
import { AttachmentUploadService } from '../../../document-detail/attachment-upload.service';

@Component({
  selector: 'app-documents-delete',
  templateUrl: './documents-delete.component.html',
  styleUrls: ['./documents-delete.component.scss'],
})
export class DocumentsDeleteComponent implements OnInit {
  @Input() checkedResults: DocumentDetailDTO[] = [];

  fileCount = 0;
  showCount = false;

  constructor(
    private readonly translateService: TranslateService,
    private readonly attachmentUploadService: AttachmentUploadService
  ) {}

  ngOnInit(): void {
    this.getTranslatedData();
  }
  /**
   * function to get translatedData from translateService
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.MODIFICATION_CONFIRMATION',
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.DELETE_DOCUMENT_NOTIFICATION',
        'RESULTS.NAME',
        'RESULTS.DOCUMENT_TYPE',
        'RESULTS.STATUS',
        'RESULTS.VERSION',
      ])
      .subscribe(() => {});
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
