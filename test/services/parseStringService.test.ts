import parseStringService from '../../src/services/parseStringService';

test('removeSymbolsInString string', () => {
  const string = 'test,\nstring;';
  const parseString = parseStringService.removeSymbolsInString(string);

  expect(parseString).toEqual(
    string
      .split(/,|\n|;/)
      .join(' ')
      .trim()
  );
});

test('removeSymbolsInString object', () => {
  const testObject = { test: 'test' };
  const parseObject = parseStringService.removeSymbolsInString(testObject);

  expect(parseObject).toEqual(JSON.stringify(testObject).split(',').join(' '));
});

test('removeSymbolsInString number', () => {
  const testNumber = 99;
  const parseNumber = parseStringService.removeSymbolsInString(testNumber);

  expect(parseNumber).toEqual(parseNumber);
});
