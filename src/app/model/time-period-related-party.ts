import { RelatedPartyRefCreateUpdateDTO } from '../generated';

export interface RelatedPartyWithTimePeriod
  extends RelatedPartyRefCreateUpdateDTO {
  timePeriod?: Date[];
}
