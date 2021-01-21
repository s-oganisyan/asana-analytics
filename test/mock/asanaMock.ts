import asana from 'asana';
import config from '../../src/config';
import { IApiEntity, ITasks, IResponseFullTask } from '../../src/interfaces/asanaApi';

export default () => {
  const asanaMock = asana.Client.create().useAccessToken(config.ASANA.PERSONAL_ACCESS_TOKEN);
  asanaMock.tasks.getTasks = () => {
    return {
      data: [
        {
          gid: '1111111111',
          name: 'testName',
          resource_type: 'task',
        } as IApiEntity,
      ],
    };
  };

  asanaMock.projects.getProjects = async () => {
    return {
      data: [
        {
          gid: '123456789',
          name: 'test project Name',
          resource_type: 'project',
        },
      ],
    } as ITasks;
  };

  asanaMock.tasks.getTask = async () => {
    return {
      gid: '1111111111',
      name: 'testName',
      resource_type: 'task',
      completed: true,
    } as IResponseFullTask;
  };

  return asanaMock;
};
