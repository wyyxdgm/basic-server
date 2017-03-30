var mongodb = require('mongodb');
var redis = require('redis');
var async = require('async');
var fs = require('fs');
var path = require('path');
var libDate = require("./date");
var config = require("../config");
var Logger = require('../lib/log');
var libUtils = require('../lib/utils');
var libString = require('../lib/string');
var _ = require('underscore');
var db;
var upstep = require(config.schema.upstep_path);
var objectid = require(config.schema.objectid_path);
var redisClient;
module.exports.redisClient = redisClient;

var ObjectId = module.exports.ObjectId = function(id) {
    id = id && id.toString ? id.toString() : '';
    if (!id.length || id.length != 24) return '';
    return mongodb.ObjectId(id);
};
module.exports.close = function(fn) {
    async.parallel([
        function(cb) {
            if (db && db.close) {
                db.close(function(err) {
                    db = null;
                    if (err) Logger.error("db closed failed!!!!", err);
                    return cb(err);
                });
            } else cb(null);
        },
        function(cb) {
            if (redisClient && redisClient.close) {
                redisClient.close(function(err) {
                    redisClient = null;
                    if (err) Logger.error("redisClient closed failed!!!!", err);
                    cb(err);
                });
            } else cb(null);
        }
    ], function(err, result) {
        if (fn) return fn(err, result);
        Logger.info(err, result);
    });
}


module.exports.connect = function(fn) {
    if (!fn) fn = function() {};
    async.parallel([
        function(cb) {
            if (!db) {
                var url = config.mongodb;
                mongodb.MongoClient.connect(url, function(err, client) {
                    if (err) return cb(err);
                    module.exports.client = client;
                    db = client;
                    if (config.schema.index_path && fs.existsSync(config.schema.index_path)) {
                        async.eachSeries(require(config.schema.index_path), function(schema, cb) {
                            db.collection(schema.modelname).createIndex(schema.index, {
                                unique: true
                            }, function(err, result) {
                                if (err) Logger.debug('createIndex for [%s] err!', schema, err);
                                cb();
                            });
                        }, cb);
                    } else {
                        mongodb.MongoClient.connect(url, function(err, client) {
                            if (err) {
                                Logger.info(err);
                                return cb(err);
                            }
                            module.exports.client = client;
                            db = client;
                            cb(err, client);
                        });
                    }
                });
            } else {
                cb(null);
            }
        },
        function(cb) {
            if (!redisClient) {
                module.exports.redisClient = redisClient = redis.createClient();
                cb(null);
                redisClient.on("error", function(err) {
                    Logger.info("REDIS Error " + err);
                });
            } else cb(null);
        }
    ], function(err) {
        if (fn) return fn(err);
        Logger.info(err, result);
    });
};
module.exports.FIX_UP_STEP_WQD = FIX_UP_STEP_WQD;

function FIX_UP_STEP_WQD(cname, doc, israw) {
    var US = upstep[cname];
    var OI = objectid[cname];
    if (!US && !OI) return doc;
    if (israw) {
        return _.mapObject(doc, function(val, key) {
            /*扩大写入，查询*/
            if (['$set', '$inc', '$unset'].indexOf(key)) return FIX_UP_STEP_WQD(cname, val);
            return val;
        });
    }
    return _.mapObject(doc, function(val, key) {
        /*扩大写入，查询*/
        // console.log('mapObject', key, val, US[key], Math.floor(val * US[key]))
        if (US && US.hasOwnProperty(key)) return Math.floor(val * US[key]);
        if (OI && OI[key] && typeof val === 'string' && val.length == 24) return ObjectId(val);
        /*返回默认*/
        return val;
    });
}
module.exports.FIX_UP_STEP_R = FIX_UP_STEP_R;

function TO_FIXED(num) {
    var obj = {
        100: 0,
        1000: 1,
        10000: 2,
        100000: 3,
        1000000: 4,
        10000000: 5,
        100000000: 6,
        1000000000: 7,
        10000000000: 8,
        100000000000: 9,
        1000000000000: 10,
        10000000000000: 11,
        100000000000000: 12,
        1000000000000000: 13,
        10000000000000000: 14,
        100000000000000000: 15,
        1000000000000000000: 16,
        10000000000000000000: 17,
        100000000000000000000: 18,
        1000000000000000000000: 19,
        10000000000000000000000: 20
    }
    return obj[Math.abs(num)] || 2;
}

function FIX_UP_STEP_R(cname, doc) {
    var US = upstep[cname];
    if (!US || !doc || !_.size(doc)) return doc;
    if (libUtils.isArray(doc)) {
        return _.map(doc, function(item) {
            /*缩小读取*/
            return FIX_UP_STEP_R(cname, item);
        });
    }
    return _.mapObject(doc, function(val, key) {
        /*缩小读取*/
        if (US.hasOwnProperty(key)) return libString.toFixed(val / US[key], TO_FIXED(US[key]));
        /*返回默认*/
        return val;
    });
}


function FIX_UP_STEP_FN(cname, fn) {
    return function(err, result) {
        if (err) return fn(err);
        return fn(err, FIX_UP_STEP_R(cname, result));
    }
}
module.exports.FIX_UP_STEP_FN = FIX_UP_STEP_FN;

function FIX_UP_STEP_PROJECT(cname, $project) {
    var US = upstep[cname];
    // console.log(US)
    if (!US) return $project;
    var _us = _.mapObject(US, function(val, key) {
        return {
            $divide: ['$' + key, val]
        };
    });
    // console.log($project, _us, _.extend($project||{}, _us))
    // console.log($project, require(config.schema.project_path)[cname], _us, _.extend($project || require(config.schema.project_path)[cname], _us));
    return _.extend($project || require(config.schema.project_path)[cname], _us); //覆盖掉传进来的
}
module.exports.FIX_UP_STEP_PROJECT = FIX_UP_STEP_PROJECT;

module.exports.getModel = getModel;

function getModel(cname) {
    if (!db) {
        Logger.info("error!! db connection is closed now!!");
        return null;
    }
    var model = {
        cname: cname
    };
    var origin = db.collection(cname);
    model.origin = origin;
    /*
     criteria:
     $or,$and,$nor: [exp]
     exp:
     field: $not:exp,$gt,$lt,$gte,$lte,$eq,$ne,$exists,$in,$nin
     */
    model.insert = function(doc, fn) {
        //fn: function(err, result)
        //result: {insertedId: "abcdedf"}
        if (!doc) return fn("no doc");
        doc = FIX_UP_STEP_WQD(this.cname, doc);
        origin.insertOne(doc, fn);
    };
    model.update = function(criteria, doc, fn) {
        //fn: function(err, result)
        //result: {n: 1}
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        doc = FIX_UP_STEP_WQD(this.cname, doc);
        origin.updateOne(criteria, {
            $set: doc
        }, function(err, result) {
            var rtn;
            if (result) rtn = result.result;
            else rtn = {
                n: 0
            };
            if (fn) fn(err, rtn);
        });
    };
    model.delete = function(criteria, fn) {
        //fn: function(err, result)
        //result: {n: 1}
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        if (!criteria) return fn("no criteria");
        origin.deleteOne(criteria, fn);
    };
    model.select = function(criteria, option, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        if (!fn) {
            fn = option;
            var fn2 = FIX_UP_STEP_FN(this.cname, fn);
            origin.findOne(criteria, fn2);
        } else {
            var fn2 = FIX_UP_STEP_FN(this.cname, fn);
            if (!_.size(option.$project)) return origin.findOne(criteria, fn2);
            origin.findOne(criteria, option, fn2);
        }
        //fn: function(err, result)
        //result: doc
    };
    model.binsert = function(docs, fn) {
        //fn: function(err, result)
        //result: {n: 10}
        var that = this;
        docs = _.map(docs, function(doc) {
            return FIX_UP_STEP_WQD(that.cname, criteria);
        });
        origin.insertMany(docs, fn);
    };
    model.bupdate = function(criteria, doc, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        doc = FIX_UP_STEP_WQD(this.cname, doc);
        origin.updateMany(criteria, {
            $set: doc
        }, function(err, result) {
            var rtn;
            if (result) rtn = result.result;
            else rtn = {
                n: 0
            };
            if (fn) fn(err, rtn);
        });
    };
    model.bdelete = function(criteria, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        if (!criteria) {
            fn = criteria;
            criteria = {};
        }
        origin.deleteMany(criteria, fn);
    };
    model.bselect = function(criteria, selectOptions, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        if (!fn) {
            fn = selectOptions;
            selectOptions = {};
        };
        var aggrarr = [{
            $match: criteria
        }];
        if (selectOptions.$sort && Object.keys(selectOptions.$sort).length > 0)
            aggrarr.push({
                $sort: selectOptions.$sort
            });
        if (selectOptions.$skip)
            aggrarr.push({
                $skip: parseInt(selectOptions.$skip)
            });
        if (selectOptions.$limit)
            aggrarr.push({
                $limit: parseInt(selectOptions.$limit)
            });
        selectOptions.$project = FIX_UP_STEP_PROJECT(this.cname, selectOptions.$project);
        // console.log(selectOptions.$project)
        if (_.size(selectOptions.$project))
            aggrarr.push({
                $project: selectOptions.$project
            });
        origin.aggregate(aggrarr, fn);
    };
    model.count = function(criteria, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        origin.count(criteria, fn);
    };
    model.bcolect = function(criteria, selectOptions, fn) {
        if (!fn) {
            fn = selectOptions;
            selectOptions = {};
        };
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        model.count(criteria, function(err, count) {
            if (err) return fn(err);
            model.bselect(criteria, selectOptions, function(err, data) {
                if (err) return fn(err);
                fn(err, {
                    data: data,
                    count: count
                });
            });
        });
    };
    model.upsert = function(criteria, doc, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        doc = FIX_UP_STEP_WQD(this.cname, doc);
        origin.updateOne(criteria, {
            $set: doc
        }, {
            upsert: true
        }, function(err, result) {
            var rtn;
            if (result) rtn = result.result;
            else rtn = {
                n: 0
            };
            if (fn) fn(err, rtn);
        });
    };
    model.sedate = function(criteria, doc, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        doc = FIX_UP_STEP_WQD(this.cname, doc);
        origin.findAndModify(criteria, [], {
            $set: doc
        }, function(err, doc) {
            if (err) return fn(err);
            if (fn) {
                if (!doc) return fn(null, doc);
                fn(err, doc.value);
            }
        });
    };
    model.update2 = function(criteria, updateParam, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        updateParam = FIX_UP_STEP_WQD(this.cname, updateParam, true);
        origin.updateOne(criteria, updateParam, function(err, result) {
            var rtn;
            if (result) rtn = result.result;
            else rtn = {
                n: 0
            };
            if (fn) fn(err, rtn);
        });
    };
    model.upsert2 = function(criteria, updateParam, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        updateParam = FIX_UP_STEP_WQD(this.cname, updateParam, true);
        origin.updateOne(criteria, updateParam, {
            upsert: true
        }, function(err, result) {
            var rtn;
            if (result) rtn = result.result;
            else rtn = {
                n: 0
            };
            if (fn) fn(err, rtn);
        });
    };
    model.bupdate2 = function(criteria, updateParam, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        updateParam = FIX_UP_STEP_WQD(this.cname, updateParam, true);
        origin.updateMany(criteria, updateParam, function(err, result) {
            var rtn;
            if (result) rtn = result.result;
            else rtn = {
                n: 0
            };
            if (fn) fn(err, rtn);
        });
    };
    model.sedate2 = function(criteria, updateParam, fn) {
        var that = this;
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        updateParam = FIX_UP_STEP_WQD(this.cname, updateParam, true);
        origin.findAndModify(criteria, [], updateParam, function(err, doc) {
            if (err) return fn(err);
            if (!doc) return fn(null, doc);
            if (fn) fn(err, FIX_UP_STEP_R(that.cname, doc.value));
        });
    };

    /*[{a:1},{a:1},{a:2},{a:3}] distinct a:[1,2,3]*/
    model.distinct = function(criteria, fn) {
        var fn2 = FIX_UP_STEP_FN(this.cname, fn);
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        origin.distinct(criteria, fn2);
    };
    model.group = function(criteria, groupOptions, fn) {
        criteria = FIX_UP_STEP_WQD(this.cname, criteria);
        var aggr;
        if (!fn) {
            aggr = [{
                $group: criteria
            }];
            fn = groupOptions;
        } else {
            aggr = [{
                $match: criteria
            }, {
                $group: groupOptions
            }];
        }
        var fn2 = FIX_UP_STEP_FN(this.cname, fn);
        origin.aggregate(aggr, fn2);
    };
    return model;
}



// module.exports.getModel = getModel;
// function getModel(cname){
//     var model = function(){};
//     var origin = db.collection(cname);
//     model.origin = origin;
//     model.name = cname;
//     /*
//      criteria: 
//      $or,$and,$nor: [exp]
//      exp:
//      field: $not:exp,$gt,$lt,$gte,$lte,$eq,$ne,$exists,$in,$nin

//      */

//     model.insert = function(doc, fn){
//         //fn: function(err, result)
//         //result: {insertedId: "abcdedf"}
//         origin.insertOne(doc, fn);
//     };
//     model.binsert = function(docs, fn){
//         //fn: function(err, result)
//         //result: {n: 10}
//         origin.insertMany(docs, fn);
//     };
//     model.upsert2 = function(criteria, updateParam, fn){
//         origin.updateOne(criteria, updateParam, {upsert:true}, function(err, result){
//             var rtn;
//             if(result && result.result){
//                 rtn = {};
//                 if(result.result.upserted && result.result.upserted.length)
//                     rtn.insertedId = result.result.upserted[0]._id;
//                 rtn.n = result.result.n;
//             }
//             else rtn = {n: 0};
//             if(fn) fn(err, rtn);
//         });
//     };
//     if(schemas[cname] && schemas[cname].autoinc){
//         model.insertori = model.insert;
//         model.binsertori = model.binsert; delete model.binsert; 
//         model.upsertori = model.upsert;
//         model.upsert2ori = model.upsert2; delete model.upsert2;
//         model.suiori = model.sui; delete model.sui;
//         model.sui2ori = model.sui2; delete model.sui2;
//         model.insert = function(doc, fn){
//             db.collection(schemas[cname].autoinc).findAndModify({}, [], {$inc: {last:1}}, {new: true, upsert: true}, function(err, result){
//                 doc._id = result.value.last;
//                 model.insertori(doc, fn);
//             })
//         }
//         model.upsert = function(criteria, doc, fn){
//             db.collection(schemas[cname].autoinc).findAndModify({}, [], {$inc: {last:1}}, {new: true, upsert: true}, function(err, result){
//                 doc._id = result.value.last;
//                 model.insertori(doc, fn);
//             })
//         }
//     }
//     model.update = function(criteria, doc, fn){
//         //fn: function(err, result)
//         //result: {n: 1}
//         delete doc._id;
//         origin.updateOne(criteria, {$set: doc}, function(err, result){
//             var rtn;
//             if(result) rtn = result.result;
//             else rtn = {n: 0};
//             if(fn) fn(err, rtn);
//         });
//     };
//     model.update2 = function(criteria, updateParam, fn){
//         origin.updateOne(criteria, updateParam, function(err, result){
//             var rtn;
//             if(result) rtn = result.result;
//             else rtn = {n: 0};
//             if(fn) fn(err, rtn);
//         });
//     };
//     model.delete = function(criteria, fn){
//         //fn: function(err, result)
//         //result: {n: 1}
//         if(!criteria) return fn("no criteria");
//         origin.deleteOne(criteria, fn);
//     };
//     model.bupdate = function(criteria, doc, fn){
//         origin.updateMany(criteria, {$set: doc}, function(err, result){
//             var rtn;
//             if(result) rtn = result.result;
//             else rtn = {n: 0};
//             if(fn) fn(err, rtn);
//         });
//     };
//     model.bdelete = function(criteria, fn){
//         origin.deleteMany(criteria, function(err, result){
//             if(err) return fn(err);
//             if(result.result) fn(null, result.result);
//             else fn(null, {n:0});
//         });
//     };
//     model.bselect = function(criteria, selectOptions, fn){
//         if(!fn){
//             fn = selectOptions; 
//             selectOptions = {};
//         };
//         var aggrarr = [{$match: criteria}];
//         if(selectOptions.$sort && Object.keys(selectOptions.$sort).length>0)
//             aggrarr.push({$sort: selectOptions.$sort});
//         if(selectOptions.$skip)
//             aggrarr.push({$skip: parseInt(selectOptions.$skip)});
//         if(selectOptions.$limit)
//             aggrarr.push({$limit: parseInt(selectOptions.$limit)});
//         if(selectOptions.$project && Object.keys(selectOptions.$project).length>0)
//             aggrarr.push({$project: selectOptions.$project});
//         origin.aggregate(aggrarr, fn);
//     };
//     model.count = function(criteria, fn){
//         origin.count(criteria, fn);
//     };
//     model.each = function(fn, fnfinal){
//         origin.find().each(function(err, doc){
//             if(!doc) return fnfinal();
//             fn(err, doc);
//         });
//     };
//     model.eachSeries = function(fn, fnfinal){
//         var c = origin.find();
//         var nextFn = function(err, doc){
//             if(err) return fnfinal(err);
//             if(!doc) return fnfinal();
//             fn(err, doc, function(err2){
//                 if(err2) return fnfinal(err2);
//                 c.next(nextFn);
//             });
//         };
//         c.next(nextFn);
//     }
//     model.bcolect = function(criteria, selectOptions, fn){
//         if(!fn){
//             fn = selectOptions; 
//             selectOptions = {};
//         };
//         model.count(criteria, function(err, count){
//             if(err) return fn(err);
//             model.bselect(criteria, selectOptions, function(err, data){
//                 if(err) return fn(err);
//                 fn(err, {
//                     data: data,
//                     count: count
//                 });
//             });
//         });
//     };
//     model.bupdate2 = function(criteria, updateParam, fn){
//         origin.updateMany(criteria, updateParam, function(err, result){
//             var rtn;
//             if(result) rtn = result.result;
//             else rtn = {n: 0};
//             if(fn) fn(err, rtn);
//         });
//     };
//     model.sedate = function(criteria, doc, fn){
//         origin.findAndModify(criteria, [], {$set: doc}, function(err, doc){
//             if(err) return fn(err);
//             if(!doc) return fn(null, doc);
//             if(fn) fn(err, doc.value);
//         });
//     };
//     model.sedate2 = function(criteria, updateParam, fn){
//         origin.findAndModify(criteria, [], updateParam, function(err, doc){
//             if(err) return fn(err);
//             if(!doc) return fn(null, doc);
//             if(fn) fn(err, doc.value);
//         });
//     };
//     /*[{a:1},{a:1},{a:2},{a:3}] distinct a:[1,2,3]*/
//     model.distinct = function(criteria, fn){
//         origin.distinct(criteria, fn);
//     };
//     model.group = function(criteria, groupOptions, fn){
//         var aggr;
//         if(!fn){
//             aggr = [{$group:criteria}];
//             fn = groupOptions;
//         }else{
//             aggr = [{$match: criteria},{$group:groupOptions}];
//         }
//         origin.aggregate(aggr, fn);
//     };
//     model.sui = function(criteria, doc, fn){
//         var doc2 = {$set: doc};
//         if((fdoc[cname])){
//             doc2.$setOnInsert = {};
//             fdoc[cname](doc, doc2.$setOnInsert);
//         }
//         origin.findAndModify(criteria, [], doc2, {upsert: true}, function(err, doc){
//             if(err) return fn(err);
//             if(!doc) return fn(null, doc);
//             if(fn) fn(err, doc.value);
//         });
//     };
//     model.sui2 = function(criteria, updateParam, fn){
//         var updateParam2 = updateParam;
//         if((fdoc[cname])){
//             updateParam2.$setOnInsert = {};
//             fdoc[cname](updateParam, updateParam2.$setOnInsert);
//         }
//         origin.findAndModify(criteria, [], updateParam2, {upsert: true}, function(err, doc){
//             if(err) return fn(err);
//             if(!doc) return fn(null, doc);
//             if(fn) fn(err, doc.value);
//         });
//     };
//     return model;
// }
