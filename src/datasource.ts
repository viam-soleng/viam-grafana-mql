import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import {
  ViamClient,
  createViamClient,
  ViamClientOptions
} from "@viamrobotics/sdk";
import {BSON} from "bsonfy";

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
    console.debug(`filterQuery(): ${query.queryText}`);
    // if no query has been provided, prevent the query from being executed
    return !!query.queryText;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const dateMatch = {
      $match: {
        time_received: {$gte: new Date(from), $lt: new Date(to)}
      }
    }

    const mData = await this.client?.dataClient?.tabularDataByMQL(
        this.orgId,
        [BSON.serialize(dateMatch)]
    );
    console.log(mData);

    // Return a constant for each query.
    const data = options.targets.map((target) => {
      return new MutableDataFrame({
        refId: target.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [target.constant, target.constant], type: FieldType.number },
        ],
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
