export default class ParseStringService {
  static removeSymbolsInString(
    value: string | Record<string, unknown> | number
  ): string | Record<string, unknown> | number {
    return typeof value === 'object'
      ? JSON.stringify(value).split(',').join(' ')
      : typeof value === 'string'
      ? value.split(/,|\n|;/).join(' ')
      : value;
  }
}
