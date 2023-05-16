import { AttachmentDTO } from '../generated';

export interface AttachmentWithTimePeriod extends AttachmentDTO {
  attachmentTimePeriod?: Date[];
  mimeTypeId?: string;
}
