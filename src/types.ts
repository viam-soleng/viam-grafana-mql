import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  queryText?: string;
  //constant: object;

  componentType: string,
  componentName: string,
  method: string,
  robotName: string,
  robotId: string,
  partName: string,
  partId: string,
  locationIdsList: string[],
  organizationIdsList: string[],
  tags: string[],
  datasetId: string,
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  componentType: '',
  componentName: '',
  method: '',
  robotName: '',
  robotId: '',
  partName: '',
  partId: '',
  locationIdsList: [],
  organizationIdsList: [],
  tags: [],
  datasetId: '',
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  orgId: string;
  orgKeyId: string;
  orgApiKey: string;
}
