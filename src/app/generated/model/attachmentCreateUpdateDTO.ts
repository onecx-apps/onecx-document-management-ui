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
import { TimePeriodDTO } from './timePeriodDTO';

export interface AttachmentCreateUpdateDTO {
  description?: string;
  id?: string;
  mimeTypeId: string;
  name?: string;
  type?: string;
  validFor?: TimePeriodDTO;
  file?: string;
}
