import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: object;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  queryText: "{\"$limit\": 1}"
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  orgId: string;
  orgKeyId: string;
  orgApiKey: string;
}
