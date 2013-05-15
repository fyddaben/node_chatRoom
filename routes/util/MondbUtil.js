var util = require('./Constant');

var Db = require('mongodb').Db;

var Server = require('mongodb').Server;

var monDbUtil = function () {
    this.db = new Db(util.Db_base, new Server(util.Db_path, util.Db_port));
  //  this.initID("room_talk");

};
monDbUtil.prototype = {
    //获得自增ID
    getNextSequence: function (tablename,callback) {
        this.db.open(function (err, db) {

          //默认计数表为counters;
             db.collection('counters', function (err, collection) {
                collection.findAndModify({"_id":tablename}, [], {$inc:{'seq':1}}, {new:true, upsert:true}, function (err, doc) {
                   db.close();

                    if(callback){
                        callback(doc.seq);
                    }

                });
            });


        });
    },
    //添加方法
    tableAdd: function (tablename, sql,callback) {
        //注意，添加之前，首先

        this.db.open(function (err, db) {
            var collection = db.collection(tablename);

            collection.insert(sql, {w: 1}, function (err, result) {
                console.log("insert " + tablename + "success");
                db.close();
                if(callback){
                    callback();
                }
            });
        });
    },
    //修改方法
    tableUpdate: function (tablename,querySql,sql,callback){
        this.db.open(function (err, db) {
            var collection = db.collection(tablename);

            collection.update(querySql, sql);

            db.close();
            if(callback){
                callback();
            }
        });
    },
    //删除方法
    tableDelete: function () {
    },
    //查询方法
    queryTable:function(tablename,sql,callback){
        this.db.open(function (err, db) {
            var collection = db.collection(tablename);
            // Retrieve all the documents in the collection
            collection.find(sql).toArray(function(err, documents) {
               db.close();
                 if(callback){
                        callback(documents);
                 }
            });
        });
    },
    //分页查询
    /*
    *  var options = {
     "limit": 5,
     "skip": 2,
     "sort":[['room_id','desc']]
     }
    * */
    queryTabelByPage:function(tablename,sql,callback,options){
        this.db.open(function (err, db) {
            var collection = db.collection(tablename);
            // Retrieve all the documents in the collection
            collection.find(sql,options).toArray(function(err, documents) {
                db.close();
                if(callback){
                    callback(documents);
                }
            });
        });
    }

}
var mond = new monDbUtil();

module.exports = mond;