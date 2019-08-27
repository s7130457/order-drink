var pg = require('pg');
// 資料庫配置
var config = { 
  user:"postgres",
  database:"order-drink",
  password:"123456",
  port:5432,
  // 擴充套件屬性
  max:20, // 連線池最大連線數
  idleTimeoutMillis:3000, // 連線最大空閒時間 3s
}

var pool = new pg.Pool(config); 

// 查詢
pool.connect(function(err, client, done) { 
  if(err) {
  return console.error('資料庫連線出錯', err);
  }
  // 簡單輸出個 Hello World
  client.query('SELECT $1::varchar AS OUT', ["Hello World"], function(err, result) {
  done();// 釋放連線（將其返回給連線池）
  if(err) {
  return console.error('查詢出錯', err);
  }
  console.log(result.rows[0].out); //output: Hello World
  });
  });