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

export interface RelatedPartyRefCreateUpdateDTO {
  id?: string;
  name?: string;
  role?: string;
  validFor?: TimePeriodDTO;
}
