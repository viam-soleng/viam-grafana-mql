import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const { jsonData } = options;

  const onOrgIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        orgId: event.target.value,
      },
    });
  };

  const onOrgKeyIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        orgKeyId: event.target.value,
      },
    });
  };

  const onOrgApiKeyChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        orgApiKey: event.target.value,
      },
    });
  };

  return (
      <>
        <InlineField label="Org ID" labelWidth={20} interactive tooltip={'Viam Organization ID'}>
          <Input
              required
              id="config-editor-viam-org-id"
              onChange={onOrgIdChange}
              value={jsonData.orgId}
              width={40}
              placeholder="Enter viam org id"
          />
        </InlineField>
        <InlineField label="Org API Key ID" labelWidth={20} interactive tooltip={'Viam Organization API Key ID'}>
          <Input
              required
              id="config-editor-viam-org-api-key-id"
              onChange={onOrgKeyIdChange}
              value={jsonData.orgKeyId}
              width={40}
              placeholder="Enter viam org api key id"
          />
        </InlineField>
        <InlineField label="Org API Key" labelWidth={20} interactive tooltip={'Viam Organization API Key'}>
          <Input
              required
              id="config-editor-viam-org-api-key"
              value={jsonData?.orgApiKey}
              placeholder="Enter your API key"
              width={40}
              type="password"
              onChange={onOrgApiKeyChange}
          />
        </InlineField>
      </>
  );
}
