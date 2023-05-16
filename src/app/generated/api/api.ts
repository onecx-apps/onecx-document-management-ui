export * from './documentControllerV1.service';
import { DocumentControllerV1APIService } from './documentControllerV1.service';
export * from './documentSpecificationControllerV1.service';
import { DocumentSpecificationControllerV1APIService } from './documentSpecificationControllerV1.service';
export * from './documentTypeControllerV1.service';
import { DocumentTypeControllerV1APIService } from './documentTypeControllerV1.service';
export * from './supportedMimeTypeControllerV1.service';
import { SupportedMimeTypeControllerV1APIService } from './supportedMimeTypeControllerV1.service';
export const APIS = [
  DocumentControllerV1APIService,
  DocumentSpecificationControllerV1APIService,
  DocumentTypeControllerV1APIService,
  SupportedMimeTypeControllerV1APIService,
];
