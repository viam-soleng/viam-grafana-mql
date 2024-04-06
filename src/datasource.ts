import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import {
  ViamClient,
  createViamClient,
  ViamClientOptions
} from "@viamrobotics/sdk";
import {buildFilter} from "./viamData";

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  client: ViamClient | undefined = undefined;
  orgId: string;

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
    this.orgId = instanceSettings.jsonData.orgId;
    this.createClient(instanceSettings);
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  filterQuery(query: MyQuery): boolean {
    // if no query has been provided, prevent the query from being executed
    return !!query.queryText;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    let stages: Uint8Array[];
    let viamResult: any[] | undefined = [];
    try {
      stages = buildFilter(from, to, options.targets);
      viamResult = await this.client?.dataClient?.tabularDataByMQL(
          this.orgId,
          stages
      );
      console.log(viamResult)
    } catch(e: any) {
      throw e;
    }

    //const fields = buildFrameFields(viamResult);
    // Return a constant for each query.
    const data: MutableDataFrame<any>[] = options.targets.map((target: MyQuery) => {
      return new MutableDataFrame({
        refId: target.refId,
        fields: [],
      });
    });
    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}


