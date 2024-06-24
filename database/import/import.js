'use strict';

const dbMysql = require('./dbmysql');
const fsp = require('node:fs').promises;
const path = require('node:path');
const pg = require('pg');
const metasql = require('metasql');
const metautil = require('metautil');
const DB = path.join(process.cwd(), '../../database');
const lang = ['ua', 'ru'];
const SCHEMAS = path.join(process.cwd(), '../../database/import/schemas');
const getColumns =
  "SELECT `COLUMN_NAME`,COLUMN_TYPE,TABLE_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH,COLUMN_DEFAULT,IS_NULLABLE FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='turone_uaopt' order by DATA_TYPE;";
const typesMysqlToPg = {
  bigint: 'bigint',
  bit: 'boolean',
  blob: 'bytea',
  char: 'string',
  date: 'date',
  datetime: 'datetime',
  enum: 'enum',
  float: 'real',
  int: 'bigint',
  longtext: 'text',
  mediumint: 'integer',
  smallint: 'number',
  text: 'text',
  tinyint: 'boolean',
  varchar: 'string',
};
const enumParse = (str) => {
  let s = str;
  let pos = s.indexOf("'");
  const enumArr = [];
  while (pos !== -1) {
    const pos2 = s.indexOf("'", pos + 1);
    enumArr.push(s.slice(pos + 1, pos2));
    s = s.slice(pos2 + 1);
    pos = s.indexOf("'");
  }
  return enumArr;
};
const isObject = (o) => typeof o === 'object' && o !== null;
const arrToString = (arr) => {
  let str = '[';
  let i = 0;
  for (const value of arr) {
    str += (i ? ' ' : '') + "'" + value + "'" + (++i === arr.length ? '' : ',');
  }
  return (str += ']');
};
const objToString = (obj, nesting) => {
  let str = '{';
  const firstLetter = nesting ? ' ' : '\n  ';
  let i = 0;
  let endLetter = ',';
  let flagArray = false;
  const l = Object.keys(obj).length;
  // console.log(l,'L ');
  for (const [key, value] of Object.entries(obj)) {
    //console.log(key, i);
    i++;
    str += (key === 'enum' ? '\n    ' : firstLetter) + key + ': ';
    if (!isObject(value)) {
      if (nesting && i === l) endLetter = flagArray ? ',\n  ' : ' ';
      else endLetter = ',';
      str += "'" + value + "'" + endLetter;
      continue;
    }
    if (Array.isArray(value)) {
      str += arrToString(value) + (i === l ? ' ' : ',\n   ');
      flagArray = true;
    } else str += objToString(value, true) + ',';
  }
  // console.log(str, l, i, nesting);
  return (str += (nesting ? '' : '\n') + '}');
};
const underlineToCamelCase = (str) => {
  let s = str;
  let pos = s.indexOf('_');
  let res = '';
  while (pos !== -1) {
    res += s.slice(0, pos);
    s = s.slice(pos + 1);
    s = s.charAt(0).toUpperCase() + s.slice(1);
    pos = s.indexOf('_');
  }
  res += s;
  return res;
};

(async () => {
  const [res] = await dbMysql.query(getColumns);
  const tableImport = {};
  const tableSchema = {};
  for (const colAttrImport of res) {
    const {
      COLUMN_NAME: colName,
      COLUMN_TYPE: typeFull,
      DATA_TYPE: typeCol,
      CHARACTER_MAXIMUM_LENGTH: length,
      TABLE_NAME: table,
      COLUMN_DEFAULT: defaultVal,
      COLUMN_KEY: unique,
      IS_NULLABLE: noRequired,
    } = colAttrImport;
    const colAttr = {};
    if (typeCol === 'enum') colAttr.enum = enumParse(typeFull);
    else colAttr.type = typesMysqlToPg[typeCol];
    /*if (length && length !== 255 && typeCol !== 'text')
      colAttr.lenght = { max: length };*/
    if (defaultVal) {
      if (colAttr.type === 'boolean') colAttr.default = Boolean(defaultVal);
      if (defaultVal === 'CURRENT_TIMESTAMP') colAttr.default = 'now';
      colAttr.default ??= defaultVal;
    }
    if (unique && colName !== 'id') colAttr.unique = true;
    tableImport[table] ??= {};
    let newColName = colName;
    let newNameTable = underlineToCamelCase(table);
    newNameTable = newNameTable.charAt(0).toUpperCase() + newNameTable.slice(1);
    newNameTable = newNameTable.endsWith('s')
      ? newNameTable.slice(0, -1)
      : newNameTable;
    for (const language of lang) {
      if (colName.endsWith('_' + language)) {
        newColName = newColName.slice(0, -(language.length + 1));
        newNameTable += 'Language';
        if (!tableSchema[newNameTable]) {
          tableSchema[newNameTable] = {};
          tableSchema[newNameTable].language = 'Language';
          tableSchema[newNameTable].naturalKey = { unique: ['id', 'language'] };
          tableSchema[newNameTable].id = newNameTable;
        }

        //console.log(colAttr, newNameTable, newColName);
        break;
      }
    }
    if (newColName === 'type') {
      newColName = 'kind';
    }
    newColName = underlineToCamelCase(newColName);
    tableSchema[newNameTable] ??= {};
    tableImport[table][colName] = { newNameTable, newColName };
    if (Object.keys(colAttr).length === 1) {
      tableSchema[newNameTable][newColName] =
        (noRequired === 'YES' ? '?' : '') + colAttr.type;
      //console.log('lang:', newNameTable, newColName, tableSchema[newNameTable][newColName]);
      continue;
    }
    if (noRequired === 'YES') {
      colAttr.required = false;
    }
    tableSchema[newNameTable][newColName] = colAttr;
    //console.log('lang:', newNameTable, newColName, tableSchema[newNameTable][newColName]);
  }
  // console.log(tableSchema);
  const data = (obj) => '(' + objToString(obj) + ');\n';
  for (const table in tableSchema) {
    await fsp.writeFile(
      SCHEMAS + '\\' + table + '.js',
      data(tableSchema[table]),
    );
    console.log(table, data(tableSchema[table]));
  }
  //console.log(tableTypes[tablesKeys[32]]);
  await fsp.writeFile('TableRenames.js', data(tableImport));
  //console.log(SCHEMAS+'Mail.js');*/
})().catch((err) => {
  // console.dir(types);
  console.error(err);
});

//dbMysql.end();
