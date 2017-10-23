// db1.js
var MongoClient = require('mongodb').MongoClient;
/*
node.js has native support for promises in recent versions. 
If you are using an older version there are several libraries available: 
bluebird, rsvp, Q. I'll use rsvp here as I'm familiar with it.
*/
var Promise = require('rsvp').Promise;

module.exports = {
  FindinCol1: function(mnths, startDate, endDate) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect('mongodb://localhost:27017/eventDB', function(err, db) {
        if (err) {
          reject(err);  
        } else {
          resolve(db);
        }        
      })
    }).then(function(db) {
		
      var collection = db.collection('events');
      //var myresults=[];
      let promises = [];
      promises.push(new Promise(function(resolve, reject) {
        collection.find({$where : mnths, Category:'Birthday'}).toArray(function(err, items) {
          if (err) {
            reject(err);
          } else {
            //console.log("findwhere items" + items[0].Description);
            resolve(items);
          }          
        });
      }));

      //Date : {"$gte": startDate, "$lt": endDate}
      //Date : {"$gte": startDate.toISOString(), "$lt": endDate.toISOString()}
      //$where : mnths
      //console.log("start=", startDate.toISOString(), "  end=",endDate.toISOString());
      promises.push(new Promise(function(resolve, reject) {
        collection.find({Date : {"$gte": new Date(startDate.toISOString()), "$lt": new Date(endDate.toISOString())}, Category:{'$ne':'Birthday'}}).toArray(function(err, items) {
          if (err) {
            reject(err);
          } else {
           // console.log("findwhere items count=", items.length);
            resolve(items);
          }          
        });
      }));

        return Promise.all(promises).then((results) => {
          //results.forEach((items) => {
                //console.log("promisall items" + items[0].Description);
          //  });
          //resolve(results);
		  //myresults=results;
          return results;
        });
	  
        //return myresults;
        
    });
  }
};
