import config from '../config';

export default class DateService {
  public getDateForModifyTasks(): Date {
    const date = new Date();
    const milliseconds = date.setHours(date.getHours() - config.TIME_RESPONSE_DATA);
    return new Date(milliseconds);
  }
}
