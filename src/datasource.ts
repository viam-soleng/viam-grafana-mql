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
import { getTemplateSrv } from '@grafana/runtime';

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
    let { range, targets } = options;
    // Interpolate Grafana variables
    // https://grafana.com/developers/plugin-tools/create-a-plugin/extend-a-plugin/add-support-for-variables#interpolate-variables-in-data-source-plugins
    targets.map((query) => {
      query.queryText = getTemplateSrv().replace(query.queryText);
    })
    const from = new Date(range!.from.valueOf());
    const to = new Date(range!.to.valueOf());

    console.log(`FROM: %s \n TO: %s`, from, to)

    // DataFrame Docs: 
    // https://grafana.com/developers/plugin-tools/create-a-plugin/develop-a-plugin/work-with-data-frames#create-a-data-frame
    let viamResults: DataFrame[] = [];
    // Execute all queries and return combined results
    viamResults = await Promise.all(options.targets.map(async target => {
      // Query Viam
      let options: FilterOptions = {
        startTime: from,
        endTime: to,
      };
      if (this.client?.dataClient) {
        const filter = this.client.dataClient.createFilter(options);
        //filter.setComponentName("moisture-sensor");
        //filter.setPartName("");
        //filter.setRobotName("plant-watering-01");
        const {data,count} = await this.client.dataClient.tabularDataByFilter(filter, undefined);
        // Return Grafana DataFrame
        const fields: Field[] = buildFrameFields(data);
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
