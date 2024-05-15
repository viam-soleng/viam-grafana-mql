import { Field, FieldType } from '@grafana/data';

export const getValues = (obj: any): { [key: string]: any } => {
    const data: { [key: string]: any } = {}
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                const i = getValues(obj[prop])
                for (let p in i) {
                    data[prop + '.' + p] = i[p]
                }
            } else {
                data[prop] = obj[prop]
            }
        }
    }
    return data;
}

/*
 * buildFramesFields
 * Currently we assume every result is the same as the first result
 * if not the data elements will be ignored
 * TODO: can we improve this?
 */
export const buildFrameFields = (resultSet: any[], includeNonNumbers = true) => {
    // [{"$match": {"method_name": "AngularVelocity"}}, {"$limit":5}]
    const fieldsMapping: { [key: string]: number } = {}
    let fieldIdx = 1;
    let fields: Field[] = [];

    if (resultSet !== undefined && resultSet.length > 0) {
        // Set Time field
        fields.push({ name: 'Time', values: [], type: FieldType.time, config: {} })
        resultSet.forEach((dataItem: { [key: string]: any }): void => {
            fields[0].values.push(Date.parse(dataItem['timeReceived']));
            let values: { [key: string]: any } = getValues(dataItem.data);
            for (let key in values) {
                if (key in fieldsMapping) {
                    fields[fieldsMapping[key]].values.push(values[key])
                }
            }
        });
        console.log(JSON.stringify(resultSet));
        let d = getValues(resultSet[0].data);
        for (let k in d) {
            //TODO: how do we support rich viam types
            //      geo, vector, quaternion, etc.
            let pushValue = false;
            let type: FieldType = FieldType.number;
            if (typeof d[k] !== 'number' && includeNonNumbers) {
                pushValue = true;
                // TODO: simply implying a string right now
                type = FieldType.string;
            } else if (typeof d[k] === 'number') {
                pushValue = true;
            }

            if (pushValue) {
                fields.push({ name: k, values: [], type: type, config: {} })
                fieldsMapping[k] = fieldIdx;
                fieldIdx++;
            }
        }
    }
    return fields;
}
