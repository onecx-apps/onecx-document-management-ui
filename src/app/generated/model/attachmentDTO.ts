/**
 * document-management
 * 1000kit document management
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SupportedMimeTypeDTO } from './supportedMimeTypeDTO';
import { AttachmentUnit } from './attachmentUnit';
import { TimePeriodDTO } from './timePeriodDTO';

export interface AttachmentDTO {
  creationDate?: string;
  creationUser?: string;
  modificationDate?: string;
  modificationUser?: string;
  version?: number;
  id?: string;
  description?: string;
  externalStorageURL?: string;
  mimeType?: SupportedMimeTypeDTO;
  name?: string;
  size?: number;
  sizeUnit?: AttachmentUnit;
  storage?: string;
  type?: string;
  validFor?: TimePeriodDTO;
  fileName?: string;
  storageUploadStatus?: boolean;
}
