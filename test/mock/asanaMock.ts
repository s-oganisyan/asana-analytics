import asana from 'asana';
import config from '../../src/config';
import { ITasks, IResponseFullTask } from '../../src/interfaces/asanaApi';

export default (): asana.Client => {
  const asanaMock = asana.Client.create().useAccessToken(config.ASANA.PERSONAL_ACCESS_TOKEN);
  asanaMock.tasks.getTasks = async (): Promise<ITasks> => {
    return {
      data: [
        {
          gid: '1111111111',
          name: `clients_name, company_name / job_post_title 
          // (developers_name platform_name)`,
          resource_type: 'task',
        } as IResponseFullTask,
      ],
    };
  };

  asanaMock.projects.getProjects = async (): Promise<ITasks> => {
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

  asanaMock.tasks.getTask = async (): Promise<IResponseFullTask> => {
    return {
      gid: '1111111111',
      name: `clients_name, company_name / job_post_title 
      // (developers_name platform_name)`,
      resource_type: 'task',
      completed: true,
    } as IResponseFullTask;
  };

  return asanaMock;
};
