const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db = require('./db1');

// Connect
const connectionPerson = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/personDB', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Connect
const connectionEvent = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/eventDB', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connectionPerson((db) => {
        db.collection('people')
            .aggregate([
			//{ $match : { Name: /^James A/  } }, 
			{ $lookup:
			   {
				 from: 'event',
				 localField: '_id',
				 foreignField: 'UserID',
				 as: 'events'
			   }
			 }, 
				{
				  $project: 
				  {
					Name: 1,
					HomePhone:1,
					Email:1,
					Mobile:1,
					Fax:1,
					Work:1,
					events: 
					{ 
					  $filter: 
					  { 
						input: "$events", 
						as: "evt", 
						cond: { $eq: [ "$$evt.Category", "Birthday" ] } 
					  } 
					} 
				  } 
				} 
			], function(err, peopleList) {
			if (err) throw err;
			db.close();
			//res.forEach((ritm) => {
				//console.log("Name", ritm.Name, "  Description=", ritm.events[0].Description, "  DOB=", ritm.events[0].Date);
			//});
			//peopleList.forEach((ritm) => {
			//	if (ritm.events[0]!=null)
			//		console.log("Name", ritm.Name, "  Description=", ritm.events[0].Description, "  DOB=", ritm.events[0].Date);
			//	else
			//		console.log("Name", ritm.Name, "  NOOOO BIRTHDAY");
			//});
			//console.log("result", res);
			res.json(peopleList);
		  })
	  });
});

/* Get users
router.get('/users2', (req, res) => {
    connectionPerson((db) => {
        db.collection('people')
            .find()
            .toArray()
            .then((people) => {
                response.data = people;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
*/

// Get events
router.get('/events', (req, res) => {
    var startDate = new Date(1/1/0001);
    var endDate = new Date();
    
    //console.log("startsecs="+ startsecs + "  endsecs="+ endsecs);
   
    console.log("startDate",startDate + "  endDate=", endDate);
    
    connectionEvent((db) => {
        db.collection('events')
            .find({"Date" : {"$gte": startDate, "$lt": endDate}},{Description:1, Category:1, Date:1, _id:0})
            .toArray()
            .then((events) => {
                response.data = events;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});


//*****************************  Users GetCalendarEvents method
//*****************************  Users GetCalendarEvents method
//*****************************  Users GetCalendarEvents method
//*****************************  Users GetCalendarEvents method

function GetEaster(wYear) {
    var g, c , h , i , j , p
    var wDay , wMonth
    var est

//test                    3/31/2013                          var wYear
//                                          wYear=2013

    g= Math.floor(wYear % 19)
    c= Math.floor(wYear / 100)
    h= Math.floor((c - (c/4) - ((8*c+13) / 25) + (19 * g) + 15) % 30)
    i= Math.floor(h - (h/28) * (1-(h/28) * (29/h+1) * ((21-g)/11)))
    j= Math.floor((wYear + (wYear/4) + i + 2 - c + (c/4)) % 7)
    p= Math.floor(i - j + 28)
    wDay = p
    wMonth = 4
    if (p > 31)
                wDay = p - 31
    else
                wMonth = 3
    return new Date (wMonth + "/" + Math.round(wDay) + "/" + wYear)
//alert("Easter Dt=" + est);
}
                                  
router.get('/GetCalendarEvents', function(req, res) {
    //db.users.find().skip(pagesize*(n-1)).limit(pagesize)
    console.log("==========>New Request");    //body to json from a post
    //console.log(req.body);    //body to json from a post
    //  console.log("hit GetCalendarEvents");  //querystring to json
    console.log(req.query);  //querystring to json
    var lstEvents = new Array();
    var startDate = new Date();
    var endDate = new Date();

    //var startsecs=parseInt(req.query.start*1000);
    //var endsecs=parseInt(req.query.end*1000);
    //console.log("startsecs="+ startsecs + "  endsecs="+ endsecs);


    //startDate.setTime(startsecs);
    //endDate.setTime(endsecs);

    startDate=new Date(req.query.start);//new Date(2017,9,1);
    endDate=new Date(req.query.end); //new Date(2017,11,1);



   // console.log("startDate=" + startDate + "   endDate="+ endDate);
    var startMonth=startDate.getMonth();
    var endMonth = endDate.getMonth();

    var hldStDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    var currYear = endDate.getFullYear();

    var mnths=""; //mongoose -->  ="return ";
    var isFirst=true;
    var ashWednesday;
    var estr;
    var dtm;
    var dofw;
    var daystilSun;
    //Depending on the Calendar used. it may show muliple months
    while(hldStDate<=endDate) {
        if (!isFirst) mnths+=" || ";
        mnths+="this.Date.getMonth() == '" + hldStDate.getMonth() + "'";
        isFirst=false;
        currYear = hldStDate.getFullYear();


        estr=GetEaster(hldStDate.getFullYear()) ;
        if ((hldStDate.getMonth()==2 || hldStDate.getMonth()==3) && hldStDate.getMonth()==estr.getMonth()) {
            //console.log("*********** Easter="+ estr);
            var evt = {
                title : "Easter",
                start : new Date(estr)
            }
            lstEvents.push(evt);
        }

        ashWednesday=new Date(estr);
        ashWednesday.setDate(estr.getDate() -46);
        if (hldStDate.getMonth()==ashWednesday.getMonth()){
            //console.log("*********** ashWednesday="+ ashWednesday);
            var evt = {
                title : "Ash Wednesday",
                start : new Date(ashWednesday)
            }
            lstEvents.push(evt);
        }

        //feb Presidents day 3rd Monday of Febuary; 0=Sunday  evtid=231
        if (hldStDate.getMonth()==1) {
            dtm = new Date("2/1/" + hldStDate.getFullYear());
            dofw = dtm.getDay();
            daystilSun=8-dtm.getDay();
            //if already at Sunday
            if (dofw==0)
                daystilSun=1; //add 1 for monday
            dtm.setDate(dtm.getDate()+daystilSun+14);          
            //console.log("*********** presday="+ dtm);
            var evt = {
                title : "Presidents Day",
                start : new Date(dtm)
            }
            lstEvents.push(evt);
        }

        //Mar spring forward 2nd Sunday of March   evtid=234
        if (hldStDate.getMonth()==2) {
            dtm = new Date("3/1/" + hldStDate.getFullYear());
            dofw = dtm.getDay();
            daystilSun=7-dtm.getDay();
            //if already at Sunday
            if (dofw==0)
                daystilSun=0;
            dtm.setDate(dtm.getDate()+daystilSun+7);            
            //console.log("*********** Daylight Saving Time Spring Forward="+ dtm);
            var evt = {
                title : "Daylight Saving Time Spring Forward",
                start : new Date(dtm)
            }
            lstEvents.push(evt);
        }	

        //May
        if (hldStDate.getMonth()==4) {
            //Mothers day 2nd Sunday of May   evtid=236
            dtm = new Date("5/1/" + hldStDate.getFullYear());
            dofw = dtm.getDay();
            daystilSun=7-dtm.getDay();
            //if already at Sunday
            if (dofw==0)
                daystilSun=0;
            dtm.setDate(dtm.getDate()+daystilSun+7);            

            //console.log("*********** Mothers Day="+ dtm);
            var evt = {
                title : "Mothers Day",
                start : new Date(dtm)
            }
            lstEvents.push(evt);

            //Memorial day Last Monday of May   evtid=237
            var dtm2 = new Date("5/31/" + hldStDate.getFullYear());
            dofw = dtm2.getDay();
            if (dofw>1)
                dtm2.setDate(dtm2.getDate()-(dofw-1));
            else {
                if (dofw==0)
                    dtm2.setDate(dtm2.getDate()-(dofw+6));              
            }
            //console.log("*********** Memorial Day="+ dtm2);
            var evt = {
                title : "Memorial Day",
                start : new Date(dtm2)
            }
            lstEvents.push(evt);
        }

        //Jun Fathers day 3rd Sunday of June   evtid=239
        if (hldStDate.getMonth()==5) {
            dtm = new Date("6/1/" + hldStDate.getFullYear());
            dofw = dtm.getDay();
            daystilSun=7-dtm.getDay();
            //if already at Sunday
            if (dofw==0)
                daystilSun=0;
            dtm.setDate(dtm.getDate()+daystilSun+14);          
            //console.log("*********** Father's Day="+ dtm);
            var evt = {
                title : "Father's Day",
                start : new Date(dtm)
            }
            lstEvents.push(evt);
        }

        //Sept Labor Day 1st Monday   evtid=241
        if (hldStDate.getMonth()==8) {
            dtm = new Date("9/1/" + hldStDate.getFullYear());
            dofw = dtm.getDay();
            daystilSun=8-dtm.getDay();
            //if already at Sunday
            if (dofw==0)
                daystilSun=1;
            if (dofw==1)
                daystilSun=0;
            dtm.setDate(dtm.getDate()+daystilSun); 
            //console.log("*********** Labor Day="+ dtm);
            var evt = {
                title : "Labor Day",
                start : new Date(dtm)
            }
            lstEvents.push(evt);
        }

        //Oct Columbus Day 2nd Monday   evtid=242
        if (hldStDate.getMonth()==9) {
            dtm = new Date("10/1/" + hldStDate.getFullYear());
            dofw = dtm.getDay();
            daystilSun=8-dtm.getDay();
            //if already at Sunday
            if (dofw==0)
                daystilSun=1;
            if (dofw==1)
                daystilSun=0;
            dtm.setDate(dtm.getDate()+daystilSun+7);            
            //console.log("*********** Columbus Day="+ dtm);
            var evt = {
                title : "Columbus Day",
                start : new Date(dtm)
            }
            lstEvents.push(evt);
        }
                                                        //Nov
        if (hldStDate.getMonth()==10) {
            //Fall Back 1st Sunday  evtid=234
            dtm = new Date("11/1/" + hldStDate.getFullYear());
            dofw = dtm.getDay();
            daystilSun=7-dtm.getDay();
            //if already at Sunday
            if (dofw==0)
                daystilSun=0;
            dtm.setDate(dtm.getDate()+daystilSun); 
            //console.log("*********** Daylight Savings Fall Back="+ dtm);
            var evt = {
                title : "Daylight Savings Fall Back",
                start : new Date(dtm)
            }
            lstEvents.push(evt);

            //ThanksGiving 4th Thursday of November   evtid=129
            var dtm2 = new Date("11/30/" + hldStDate.getFullYear());
            dofw = dtm2.getDay();
            if (dofw>5)
                dtm2.setDate(dtm2.getDate()-(dofw-4));
            else
                dtm2.setDate(dtm2.getDate()-(dofw+3));              
            //console.log("*********** ThanksGiving="+ dtm2);
            var evt = {
                title : "ThanksGiving",
                start : new Date(dtm2)
            }
            lstEvents.push(evt);
        }

        hldStDate.setMonth(hldStDate.getMonth() + 1);
    }

    //console.log("startMonth="+ startMonth + "  endMonth="+ endMonth + "  months=" + mnths);
    db.FindinCol1(mnths, startDate, endDate).then(function(items) {
        //console.info('The promise was fulfilled with items!', items);
        //Combine all the returned arrays to 1 collection
        items.forEach((ritems) => {
            ritems.forEach((evt) => {
				 var evt2 = {
                        title : evt.Description,
                        start : evt.Date //new Date(new Date().getFullYear(), evt.Date.getMonth(), evt.Date.getDay() )
                    }
                lstEvents.push(evt2);
            });
        });

        console.log("lstEvents count=", lstEvents);
        res.json(lstEvents);
      }, function(err) {
        console.error('The promise was rejected', err, err.stack);
      });

/*      
	//Get Events == birthday and with 
     connectionEvent((db) => {
        db.collection('events')
            .find({$where : mnths, Category:'Birthday'})  //{"Date" : {"$gte": startDate, "$lt": endDate}}
            .toArray()
            .then((events) => {

                events.forEach(item => {
                    var evt = {
                        title : item.Description,
                        start : new Date(new Date().getFullYear(), item.Date.getMonth(), item.Date.getDay() )
                    }
                    console.log("DB birthdays=" + evt.title);
                    lstEvents.push(evt);
                });
     
//                response.data = events;
//                res.json(response);
            })
            .catch((err) => {
                console.log("=================>Exception dumping lstevents");
                console.log(err);
                sendError(err, res);
            });
    });

	//Get Events != birthday and with 
    connectionEvent((db) => {
        db.collection('events')
            .find({$where : mnths, Category: {'$ne':'Birthday'}, repeatYearly:true})  //{"Date" : {"$gte": startDate, "$lt": endDate}}
            .toArray()
            .then((events) => {

                events.forEach(item => {
                    var evt = {
                        title : item.Description,
                        start : new Date(new Date().getFullYear(), item.Date.getMonth(), item.Date.getDay() )
                    }
                    console.log("DB birthdays=" + evt.title);
                    lstEvents.push(evt);
                });
     
//                response.data = events;
//                res.json(response);
                console.log("=================>DB dumping lstevents");
                console.log(lstEvents);
                res.json(lstEvents);
            })
            .catch((err) => {
                console.log("=================>Exception dumping lstevents");
                console.log(err);
                sendError(err, res);
                res.json(lstEvents);
            });
    });
*/
//    console.log("=================>dumping lstevents");
//    console.log(lstEvents);
//    res.json(lstEvents);
});


module.exports = router;