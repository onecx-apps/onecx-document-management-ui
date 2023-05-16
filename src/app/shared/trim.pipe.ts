import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  /**
   *
   * @param value input string
   * @param args limit of the string as a number
   * @returns string of length 30 added with dots to the remaing characters.
   */
  transform(value: string, ...args: number[]): unknown {
    return value.length > args[0] ? `${value.slice(0, args[0])}...` : value;
  }
}
