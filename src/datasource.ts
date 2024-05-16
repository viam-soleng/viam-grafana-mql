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

  // Datasource query processing
  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    let { range, maxDataPoints } = options;
    const from = new Date(range!.from.valueOf());
    const to = new Date(range!.to.valueOf());
    console.log(`FROM: %s \n TO: %s`, from, to)

    // Execute all queries and return combined results
    let viamResults: DataFrame[] = [];
    viamResults = await Promise.all(options.targets.map(async target => {
      if (this.client?.dataClient) {
        target = defaults(target, DEFAULT_QUERY);
        //console.log("Target: " + JSON.stringify(target));
        // Prepare Viam query parameters
        let options: FilterOptions = {
          startTime: from,
          endTime: to,
          tags: target.tags,
        };
        const filter = this.client.dataClient.createFilter(options);
        filter.setLocationIdsList(target.locationIdsList)
        filter.setRobotName(target.robotName) // How about MachineName??
        filter.setRobotId(target.robotId)   // How about MachineID??
        filter.setPartName(target.partName);
        filter.setPartId(target.partId);
        filter.setComponentName(target.componentName);
        filter.setComponentType(target.componentType);
        filter.setMethod(target.method);
        // Execute query
        const { data, count } = await this.client.dataClient.tabularDataByFilter(filter, maxDataPoints);
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

  // Test datasource during configuraiton time
  async testDatasource() {
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
