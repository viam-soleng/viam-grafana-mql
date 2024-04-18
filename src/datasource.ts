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
import { buildFilter, buildFrameFields } from "./viamData";
import { getTemplateSrv } from '@grafana/runtime';

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


  // Build Grafana Data Source Plugin: 
  // https://grafana.com/developers/plugin-tools/tutorials/build-a-data-source-plugin#returning-data-frames
  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    let { range, targets } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    // Interpolate Grafana variables
    // https://community.grafana.com/t/how-to-use-template-variables-in-your-data-source/63250
    targets.map((query) => {
      query.queryText = getTemplateSrv().replace(query.queryText);
    })

    let stages: Uint8Array[];
    let viamResult: any[] = [];

    try {
      stages = buildFilter(from, to, options.targets);
      const res: any[] | undefined = await this.client?.dataClient?.tabularDataByMQL(
        this.orgId,
        stages
      );

      if (res !== undefined) {
        viamResult = res;
      }
    } catch (e: any) {
      throw e;
    }

    const fields = buildFrameFields(viamResult);
    // TODO: move to non deprecated solution
    // Grafana documentation: 
    // https://grafana.com/developers/plugin-tools/create-a-plugin/develop-a-plugin/work-with-data-frames#create-a-data-frame
    const data: MutableDataFrame[] = options.targets.map((target: MyQuery) => {
      return new MutableDataFrame({
        refId: target.refId,
        fields: fields,
      });
    });
    return {data};
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}


