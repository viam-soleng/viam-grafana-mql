import {
  CoreApp,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,

} from '@grafana/data';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import {
  ViamClient,
  createViamClient,
  ViamClientOptions,
  FilterOptions
} from "@viamrobotics/sdk";
import { buildFrameFields } from "./viamData";
import { defaults } from 'lodash';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  client: ViamClient | undefined = undefined;
  orgId: string;
  instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>;

  private createClient = async (instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>): Promise<any> => {
    const opts: ViamClientOptions = {
      credential: {
        type: 'api-key',
        authEntity: instanceSettings.jsonData.orgKeyId,
        payload: instanceSettings.jsonData.orgApiKey,
      },
    };

    this.client = await createViamClient(opts);
  }

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.instanceSettings = instanceSettings;
    this.orgId = instanceSettings.jsonData.orgId;
    try {
      this.createClient(instanceSettings);
    } catch (error) { }
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  filterQuery(query: MyQuery): boolean {
    // if no query has been provided, prevent the query from being executed
    return !!query.queryText;
  }

  // Build Grafana Data Source Plugin: 
  // https://grafana.com/developers/plugin-tools/tutorials/build-a-data-source-plugin#returning-data-frames
  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    let { range } = options;
    const from = new Date(range!.from.valueOf());
    const to = new Date(range!.to.valueOf());
    console.log(`FROM: %s \n TO: %s`, from, to)

    // DataFrame Docs: 
    // https://grafana.com/developers/plugin-tools/create-a-plugin/develop-a-plugin/work-with-data-frames#create-a-data-frame
    let viamResults: DataFrame[] = [];
    // Execute all queries and return combined results
    viamResults = await Promise.all(options.targets.map(async target => {
      target = defaults(target, DEFAULT_QUERY);
      console.log("Target: " + JSON.stringify(target));
      // Prepare Viam query parameters
      let options: FilterOptions = {
        startTime: from,
        endTime: to,
        tags: target.tags,
      };
      // Execute query if data client initialized
      if (this.client?.dataClient) {
        const filter = this.client.dataClient.createFilter(options);
        filter.setComponentName(target.componentName);
        filter.setPartName(target.partName);
        filter.setRobotName(target.robotName);
        const {data,count} = await this.client.dataClient.tabularDataByFilter(filter, undefined);
        // Return Grafana DataFrame
        const fields: Field[] = buildFrameFields(data, target.timeField);
        return {
          name: target.refId,
          fields: fields,
          length: count
        }
      } else {
        return {
          name: target.refId,
          fields: [],
          length: 0
        }
      }
    }));
    return { data: viamResults }
  }

  async testDatasource() {
    // Implement a health check for your data source.
    try {
      await this.createClient(this.instanceSettings);
      return {
        status: 'success',
        message: 'Connection successfully established!'
      };
    } catch (error) {
      return {
        status: 'error',
        message: ((error instanceof Error) ? error.message : JSON.stringify(error))
      }
    }
  }
}
