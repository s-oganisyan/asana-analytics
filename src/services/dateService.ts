import config from '../config';
import moment from 'moment-timezone';

export default class DateService {
  public getDateOfLastRequest(): Date {
    const date = new Date();
    const milliseconds = date.setHours(date.getHours() - config.TIME_RESPONSE_DATA);
    return new Date(milliseconds);
  }

  public static changeTimezone(date: string): Date {
    const newDate = moment(date);
    return new Date(newDate.format());
  }
}
