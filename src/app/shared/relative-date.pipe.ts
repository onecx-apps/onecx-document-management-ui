import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'relativeDate'})
export class RelativeDatePipe implements PipeTransform {
    transform(value: Date | string | number| undefined): string | undefined {
        if (value === undefined) {
            return undefined;
        }

        if (!(value instanceof Date)) {
            value = new Date(value);
            if (isNaN(value.getTime())) {
                return undefined;
            }
        }

        const seconds = Math.floor(((new Date()).getTime() - value.getTime()) / 1000);

        if (seconds < 60) {
            return 'just now';
        }

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return count + ` ${interval.label}${count !== 1 ? 's' : ''} ago`;
            }
        }
    }
}
