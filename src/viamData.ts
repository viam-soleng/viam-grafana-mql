import {BSON} from 'bsonfy';
import {MyQuery} from './types';
import {FieldType} from '@grafana/data';

export const getValues = (obj: any): {[key: string]: any} => {
    const data: {[key: string]: any} = {}
    for (let prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            if(typeof obj[prop] == 'object') {
                const i = getValues(obj[prop])
                for(let p in i) {
                    data[p] = i[p]
                }
                return data;
            } else {
                data[prop] = obj[prop]
            }
        }
    }
    return data;
}

export const buildFilter = (to: number, from: number, queries: MyQuery[]): Uint8Array[] => {
    const dateMatch: {[key: string]: any} = {
        $match: {
            time_received: {$gte: new Date(from), $lt: new Date(to)}
        }
    }

    const stages: Uint8Array[] = []
    stages.push(BSON.serialize(dateMatch))
    queries.forEach((query: MyQuery): void => {
        if(query.queryText !== undefined && query.queryText.length > 0) {
            try {
                let q = JSON.parse(query.queryText);
                if (q instanceof Array) {
                    q.forEach(stage => stages.push(BSON.serialize(stage)))
                } else {
                    stages.push(BSON.serialize(q))
                }
            } catch(e) {
                throw new Error(`mongo query structure (${query.queryText}) is invalid: ${e}`);
            }
        }
    });
    return stages;
}

export const buildFrameFields = (resultSet: any[]) => {
    // [{"$match": {"method_name": "AngularVelocity"}}, {"$limit":5}]
    const fieldsMapping: {[key: string]: number} = {}
    let fieldIdx = 1;
    const fields: any = [];

    if (resultSet !== undefined && resultSet.length > 0) {
        fields.push({name: 'Time', values: [], type: FieldType.time})
        let d = getValues(resultSet[0].data);
        for(let k in d) {
            fields.push({name: k, values: [], type: FieldType.number})
            fieldsMapping[k] = fieldIdx;
            fieldIdx++;
        }

        resultSet.forEach((dataItem: {[key: string]: any}): void => {
            fields[0].values.push(dataItem['time_received']);
            let values: {[key: string]: any} = getValues(dataItem.data);
            for (let key in values) {
                if(key in fieldsMapping) {
                    fields[fieldsMapping[key]].values.push(values[key])
                }
            }
        });
    }
    return fields;
}