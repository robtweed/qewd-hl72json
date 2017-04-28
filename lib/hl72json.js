/*

 ----------------------------------------------------------------------------
 | qewd-hl72json: HL7 Message to JSON Transformer                           |
 |                                                                          |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  28 April 2017

*/

var hl7_dic = require('hl7-dictionary');
var moment = require('moment');

function convertDate(hl7Date) {
  hl7Date = hl7Date.trim();
  var yyyy = hl7Date.substr(0, 4);
  var mm = hl7Date.substr(4, 2);
  var dd = hl7Date.substr(6, 2);
  var h = hl7Date.substr(8, 2);
  var m = hl7Date.substr(10, 2);
  var s = hl7Date.substr(12, 2);
  if (h === '') h = '00';
  if (m === '') m = '00';
  if (s === '') s = '00';
  var d = yyyy + mm + dd + 'T' + h + m + s;
  //console.log('hl7 date: ' + hl7Date + ' ; ' + d);
  var dx = moment(d).toDate();
  //console.log('dx: ' + dx);
  return dx;
}

function formatField(field, schema) {
  if (schema.table) {
    //console.log('field ' + field + '; table: ' + schema.table);
    var table = hl7_dic.tables[schema.table];
    //console.log('table: ' + JSON.stringify(table));
    if (typeof table === 'undefined') return field;
    return table.values[field] || field;
  }
  if (schema.datatype === 'TS' || schema.datatype === 'DT') {
    return convertDate(field);
  }
  return field;
}

function processFields(fields, schema, fieldDefs, delim) {
  var obj = {};
  var names = {};
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    //console.log('=====');
    //console.log('field = ' + field);
    var dic = schema[i];
    if (typeof dic === 'undefined') dic = {};
    //console.log('dic = ' + JSON.stringify(dic));
    if (dic === 'dummy') continue;
    var name = dic.desc || 'undefined';
    name = name.split(' - ').join('_');
    name = name.split(' ').join('_');
    name = name.split("'").join('');
    name = name.split('/').join('_');
    if (names[name]) name = name + '_' + i;
    names[name] = true;
    obj[name] = {
      raw: field,
      value: field
    };

    if (field !== '' && dic.datatype) {

      var fieldDef = fieldDefs[dic.datatype];

      if (!dic.table && dic.datatype !== 'TS' && dic.datatype !== 'DT' && fieldDef.subfields.length > 1) {

        var subDelim = '~';
        if (delim === '^') subDelim = '~';
        if (delim === '~') subDelim = '\\';
        if (delim === '\\') subDelim = '&';

        var subcomponents = field.split(subDelim);
        obj[name] = [];
        subcomponents.forEach(function(subcomponent) {
          var subfields = subcomponent.split(delim);
          //console.log('name: ' + name + '; subfields: ' + JSON.stringify(subfields));
          //console.log('fieldDef = ' + JSON.stringify(fieldDef));
          obj[name].push(processFields(subfields, fieldDef.subfields, fieldDefs, subDelim));
          //console.log('*** obj[' + name + '] = ' + JSON.stringify(obj[name]));
        });
      }
      else {
        var lookupValue = formatField(field, dic);
        obj[name] = {
          raw: field,
          value: lookupValue
        }
      }
    }
  }
  return obj;
}

function mapSegment(segment, version) {
  if (segment === '') return false;
  var fields = segment.split('|');
  if (fields.length === 0) return false;
  var type = fields[0];
  if (!hl7_dic.definitions[version] || !hl7_dic.definitions[version].segments[type]) return false;

  //console.log('fields: ' + JSON.stringify(fields, null, 2));
  var schema = hl7_dic.definitions[version].segments[type].fields.slice(0);
  var fieldDefs = hl7_dic.definitions[version].fields;
  if (type !== 'MSH') schema.splice(0, 0, 'dummy');
  //console.log('schema: ' + JSON.stringify(schema, null, 2));

  var obj = processFields(fields, schema, fieldDefs, '^');
  return {
    type: type,
    obj: obj
  }
}

function transform(hl7Message, version) {
  var json = {};
  version = version || '2.3';
  //console.log('hl7Message = ' + JSON.stringify(hl7Message));
  if (hl7Message === '' || hl7Message.length === 0) return json;
  hl7Message.forEach(function(segment) {
    var segmentObj = mapSegment(segment, version);
    if (segmentObj) {
      var type = segmentObj.type;
      var obj = segmentObj.obj;
      if (!json[type]) json[type] = [];
      json[type].push(obj);
    }
  });
  return json;
}

module.exports = transform;
