export default class ParseStringHelper {
  static removeSymbolsInString(
    value: string | Record<string, unknown> | number
  ): string | Record<string, unknown> | number {
    return typeof value === 'object'
      ? JSON.stringify(value).split(',').join(' ').trim()
      : typeof value === 'string'
      ? value
          .split(/,|\n|;/)
          .join(' ')
          .trim()
      : value;
  }
}
