import config from '../../config';
import moment from 'moment-timezone';

export default class DateHelper {
  public getDateOfLastRequest(): Date {
    const date = new Date();
    const milliseconds = date.setHours(date.getHours() - config.TIME_RESPONSE_DATA);
    return new Date(milliseconds);
  }

  public static changeTimezone(date: string): string {
    return moment(date).format().slice(0, 19);
  }
}
