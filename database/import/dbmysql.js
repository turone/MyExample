'use strict';

const mysql = require('mysql2/promise');
const conf = require('../../../myExampleConf/config');

module.exports = {
  async query(sql, args) {
    const connection = await mysql.createConnection({ ...conf.importMysql });
    const start = Date.now();
    const res = await connection.execute(sql, args);
    const duration = Date.now() - start;
    console.log('executed query', duration);
    //console.log(res);
    connection.end();
    return await res;
  },
};
