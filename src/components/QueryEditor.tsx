import React, { ChangeEvent } from 'react';
import {InlineField, Stack, TextArea} from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onQueryTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const { queryText} = query;

  return (
    <Stack gap={0}>
      <InlineField label="MQL Query" grow tooltip="Enter your MQL Query">
        <TextArea
          id="query-editor-query-text"
          width={50}
          onChange={onQueryTextChange}
          value={queryText || ''}
          required
          placeholder="Enter a query"
        />
      </InlineField>
    </Stack>
  );
}
