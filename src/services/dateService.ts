import config from '../config';

export default class DateService {
  public getDateOfLastRequest(): Date {
    const date = new Date();
    const milliseconds = date.setHours(date.getHours() - config.TIME_RESPONSE_DATA);
    return new Date(milliseconds);
  }

  public static changeTimezone(date: string): Date {
    const currentDate = new Date(date);
    currentDate.setHours(currentDate.getHours() + 3);
    return currentDate;
  }
}
