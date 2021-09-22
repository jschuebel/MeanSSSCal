const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db = require('./db1');
const lodash = require('lodash');    
const jwt = require('jsonwebtoken');
const path = require('path');

// Connect
const CreateConnection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017', {useUnifiedTopology: true}, (err, client) => {
        if (err) return console.log(err);
        closure(client);
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

function updateUser(db, user) {
    //returns a promise that resolves to a quiz
    return new Promise(function(resolve, reject){
        console.log("saving... usr = ",user);
        db.collection('people')
        .save(user, function(err, usobj) {
             if (err) {
                console.log("User save failed",err);
                return reject(err);
            }
            else {
                console.log("updateUser Saved!  usobj=",usobj);
                //console.log("updateUser Saved!  usobj.result.nModified=",usobj.result.nModified);
                //console.log("updateUser Saved!  usobj=",usobj.result.nModified);
                
                return resolve(user);
            }
        })
    });
  }

  function updateEvent(db, event) {
    //returns a promise that resolves to a quiz
    return new Promise(function(resolve, reject){
        console.log("saving... evt = ",event);
        db.collection('events')
        .save(event, function(err, evtobj) {
            db.close();
            if (err) {
                console.log("event email save failed",err);
                return reject(err);
            }
            else {
                console.log("Event Saved evtobj=",evtobj);
                //console.log("Event Saved",evtobj._id);
                return resolve(event);
            }
        })
    });
  }

  router.get('/login', (req, res) => {

    console.log("login req.body",req.body);    //body to json from a post
    console.log("req.query", req.query);
    console.log("req.query ssoReturn", req.query.ssoReturn);
    let sess=req.session;
    sess.ssoReturnUrl = req.query.ssoReturn;
   
    console.log("req.user", req.user);
    console.log("req.sessionID", req.sessionID);
    console.log("req.headers.referer", req.headers.referer);

    console.log("login __dirname", __dirname);
  res.sendFile(path.join(__dirname, '../../dist/login.html'));

});
  
  
router.post('/login', function(req, res) {
    //console.log("login hit");
    //console.log("req.body",req.body);    //body to json from a post
    //console.log("req.query", req.query);
    //console.log("req.session", req.session);

    let sess=req.session;
    //console.log("req.session", sess);
    console.log("req.session ssoReturn", sess.ssoReturnUrl);

    var hldUser = JSON.parse(JSON.stringify(req.body));
    //console.log("hldUser",hldUser);

//http://sss2:3000/sso/
//http://a50.schuebelsoftware.com/person
//sess.ssoReturnUrl=sess.ssoReturnUrl.replace("sss2:3000","a50.schuebelsoftware.com");
  console.log("req.session *updated* ssoReturn", sess.ssoReturnUrl);

    CreateConnection((client) => {
		var db = client.db('userAuthDB');
        db.collection('user')
        .find({username:hldUser.UName.toLowerCase(), password:hldUser.password})
        .toArray()
        .then((userrec) => {
            client.close();
            if (userrec!=null && userrec.length>0) {
                console.log("user found return role count",userrec[0]);

                const user = {
                    scope:'System',
                    iss: "http://www.schuebelsoftware.com",
                    aud: "Family",
                    username: hldUser.UName,
					ses:userrec[0]._id.toString(),
					createdOn: new Date()
                    //role:[] used for ID_TOKEN
                }
                //console.log("jwt user ",user);

                const refreshToken = jwt.sign(user, process.env.Audience__Secret,{expiresIn:'1y'});
        
                //for(var i=0;i<userrec[0].roles.length;i++)
                //  user.role.push(userrec[0].roles[i]);
                jwt.sign(user, process.env.Audience__Secret,{expiresIn:'30s'},  (err,token) => {
        
        
					CreateConnection((client) => {
						var db = client.db('userAuthDB');
                        db.collection('token')
                            .insertOne({refreshtoken:refreshToken, token : token})
                            .then(() => {
                                client.close();
        
                                //res.set("Authorization", "Bearer " + token);
/**********************  Cookies will not work on external SSO

                               //var expiryDate = new Date(Number(new Date()) + (600 * 1000)); 
                               // res.cookie('id_token' ,token, {expires: expiryDate});
							   
							   res.cookie('accesstoken', token, {
									maxage: 300000,   //5 mins
									httpOnly:true
								   });
							   res.cookie('refresh', refreshToken, {
									maxage: 3.154e10,   //1 year
									httpOnly:true
								   });
******************************/								   
                                res.redirect(sess.ssoReturnUrl + "?token=" + token + "&reftoken=" + refreshToken)
/*                                res.json({
                                    token:token
                                });
*/								

                            })
                            .catch((err) => {
                                client.close();
                                console.log("saving token failed",err);
                                sendError(err, res);
                            });
                    });
                });
            }
            else {
                console.log("user NOT found");
                res.sendFile(path.join(__dirname, '../../dist/index.html'));

            }
            })
            .catch((err) => {
                console.log("origin NOT found",err);
                res.sendFile(path.join(__dirname, '../../dist/index.html'));
    //            sendError(err, res);
            });
    });


});

  
router.post('/logout', (req, res) => {  
    console.log('hit api post logout');

	const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
		  // Split at the space
		  const bearer = bearerHeader.split(' ');
		  // Get token from array
		  const bearerToken = bearer[1];

		//console.log('api post logout req.token', req.token);
		console.log('api post logout bearerToken', bearerToken);


		jwt.verify(bearerToken, process.env.Audience__Secret, (err, authData) => {
		console.log('api post logout back from jwt.verify');
		  if(err) {
			if (err.name==="TokenExpiredError") {
				console.log('api post logout  **========> TokenExpiredError');
			}
			else {
				console.log('api post logout  ** failed', err);
			}
		  }

		//find the current token and remove
		CreateConnection((client) => {
			var db = client.db('userAuthDB');
			db.collection('token')
			.find({token:bearerToken})
			.toArray()
			.then((tokenrec) => {
				console.log("api post logout Removing token",tokenrec[0].token);
				db.collection('token').remove(tokenrec[0]);
				client.close();
				console.log("api post logout Removed token");
/***** could not pass cookies across domains				
			   res.cookie('accesstoken', token, {
				   expiresIn:'',
					maxage: 0,
					httpOnly:true
				   });
			   res.cookie('refresh', refreshToken, {
					maxage: 0,
					httpOnly:true
				   });
***/				   
				
			})
			.catch((err) => {
				console.log("api post logout token NOT found err=",err);
			});
		});
		});
	}
	else {
				console.log("api post logout *** no token");
	}
  });
  
router.post('/loggeduser', verifyToken, (req, res) => {  
    console.log('hit api post loggeduser');

//************** cookies are not sent acrosss countext
    //console.log('Cookies: ', req.cookies)
	//console.log('Signed Cookies: ', req.signedCookies)
	//var rc = req.headers.cookie;
	//console.log('rc: ', rc)
//	console.log('response.headers.cookie: ', req.headers.cookie)
//************** cookies are not sent acrosss countext

	//console.log('response.headers: ', req.headers)
	console.log('response.headers[authorization]: ', req.headers.authorization)
	
	 



    jwt.verify(req.token, process.env.Audience__Secret, (err, authData) => {
    console.log('hit api post loggeduser back from jwt.verify');
      if(err) {
			if (err.name==="TokenExpiredError") {
				console.log('hit api post loggeduser **========> TokenExpiredError');
				res.sendStatus(401);
			}
			else {
				console.log('hit api post loggeduser ** failed', err);
			}
      } else {


        let tst = authData.role;
        res.json({
          message: 'Post created...',
          aud: authData.aud,
          iss: authData.iss,
          claims:authData.role
        });
      }
    });
  });


function getHeaderFromToken(token) {
 const decodedToken = jwt.decode(token, {
  complete: true
 });

 if (!decodedToken) {
  throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `provided token does not decode as JWT`);
 }

 return decodedToken.header;
}

//authorization header now has refresh token
router.post('/refreshtoken', verifyToken, (req, res) => {  
    console.log('hit api post refreshtoken');
    console.log('hit api post refreshtoken req.token=',req.token);
	
//console.log("api post refreshtoken req.body",req.body.tok);

	//console.log('response.headers: ', req.headers)
	//console.log('response.headers[authorization]: ', req.headers.authorization)
	
	
    jwt.verify(req.token, process.env.Audience__Secret, (err, authData) => {
    console.log('api post refreshtoken back from jwt.verify');
      if(err) {
			if (err.name==="TokenExpiredError") {
				console.log('hit api post refreshtoken **========> TokenExpiredError');
			}
			else {
				if (err.name==="JsonWebTokenError") {
					console.log('hit api post refreshtoken **========> JsonWebTokenError');
					res.sendStatus(401);
					return;
				}
				else {		 
					console.log('hit api post refreshtoken **========> ', err);
				}
			}
      } 
	  
    //console.log('api post refreshtoken authData=', authData);
	  
		CreateConnection((client) => {
			var db = client.db('userAuthDB');
			db.collection('token')
			.find({refreshtoken:req.token})
			.toArray()
			.then((tokenrec) => {
				//AuthData == the data from the refresh token in header 

				const decodedToken = jwt.decode(tokenrec[0].token);

				 if (!decodedToken) {
					console.log('Parse.Error.OBJECT_NOT_FOUND, provided token does not decode as JWT');
				 }
				 delete decodedToken.exp;
				 delete decodedToken.iat;
				 decodedToken.createdOn=new Date();
				 
/*
                const user = {
                    scope:'System',
                    iss: "http://www.schuebelsoftware.com",
                    aud: "Family",
                    username: authData.username,
					ses:authData.ses,
					createdOn: new Date()
                    //role:[] used for ID_TOKEN
                }
*/				
                console.log("jwt user decodedToken",decodedToken);

//                const refreshToken = jwt.sign({ses:userrec[0]._id.toString()}, process.env.Audience__Secret,{expiresIn:'1y'});
        
                //for(var i=0;i<userrec[0].roles.length;i++)
                //  user.role.push(userrec[0].roles[i]);
                const accessToken = jwt.sign(decodedToken, process.env.Audience__Secret,{expiresIn:'30s'});


				tokenrec[0].token=accessToken;

				db.collection('token')
					.save(tokenrec[0])
					.then(() => {
						client.close();
						console.log("token updated");
						
						res.json({
						  message: 'Post created...',
						  tok: accessToken,
						});

					})
					.catch((err) => {
						client.close();
						console.log("saving token failed",err);
						sendError(err, res);
					});
			})
			.catch((err) => {
				console.log("token NOT found",err);
			});
		});
 
	  
	  
	  
    });
  });

//http://www.advancesharp.com/blog/1237/angular-6-web-api-2-bearer-token-authentication-add-to-header-with-httpinterceptor
//https://www.youtube.com/watch?v=7nafaH9SddU&t=674s
// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }

router.post('/user', verifyToken, function(req, res) {
    //console.log("req.body",req.body);    //body to json from a post
    //console.log("req.query", req.query);

    var hldUser = JSON.parse(JSON.stringify(req.body.person));
    var hldEvent= {};
    if (req.body.person!=null && req.body.person.events!=null)
        hldEvent = hldUser.events[0];
    delete hldUser.events;
    hldEvent.Date = new Date(hldEvent.Date);
    console.log("hldEvent", hldEvent);
    console.log("hldUser", hldUser);

    //need to save birthday event separatly

    /*make sure the date is not a string.
        req.body.event.createdate = new Date(req.body.event.createdate);
    */    

        CreateConnection((client) => {
        var db = client.db('SSSPersonDB');
 
		Promise.all([
           updateUser(db,hldUser),
           updateEvent(db,hldEvent),
        ]).then(values => { 
                db.close();
                console.log("User Saved evtobj=",req.body);
                //console.log("Event Saved",evtobj._id);
                response.data = { status:"User saved", person:req.body};
                res.json(response);
            })
			.catch(err => {
                db.close();
                console.log("user save failed",err);
                sendError(err, evtobj);
        // handle the error
            }); //unify error handling inside an express module
        
    });
});


// Get users
router.get('/users', (req, resp) => {
    console.log('entered GET /users');
    CreateConnection((client) => {
        var db = client.db('SSSPersonDB');
        var aggCursor =db.collection('people')
            .aggregate([
            //{ $match : { Name: /^James A/  } }, 
            
            {$sort: {Name: 1}},
			{ $lookup:
			   {
				 from: 'events',
				 localField: '_id',
				 foreignField: 'UserID',
				 as: 'events'
			   }
			}, 
//			{ $lookup:
//			   {
//				 from: 'addresses',
//				 localField: 'Address ID',
//				 foreignField: '_id',
//				 as: 'addresses'
//			   }
//			},
			{
			  $project: 
			  {
				Name: 1,
				"Home Phone":1,
                "E-Mail":1,
                "Address ID":1,
				Mobile:1,
				Fax:1,
                Work:1,
                Pager:1,
//				address : 
//				{ 
//				  $filter: 
//				  { 
//					input: "$addresses", 
//					as: "adr", 
//					cond: { $ne: [ "$$adr.Zip", "Birthday" ] } 
//				  } 
//				} ,
				events: 
				{ 
				  $filter: 
				  { 
					input: "$events", 
					as: "evt", 
					cond: { $eq: [ "$$evt.TopicID", 1 ] } 
				  } 
				} 
			  } 
            }]
            /*, function(err, peopleList) {
                console.log('>>>>>>>>>>>>>>>>>  USERS return');
                console.log('>>>>>>>>>>>>>>>>>  USERS err', err);
                if (err) throw err;
                
			client.close();
			//peopleList.forEach((ritm) => {
				//console.log("Name", ritm.Name, "      Event", (ritm.events!=null&&ritm.events.length>0?ritm.events:"N/A"));
				//console.log("Address", ritm.address!=null?ritm.address[0]:"no");
			//});
			//peopleList.forEach((ritm) => {
			//	if (ritm.events!=null && ritm.events.length>0)
			//		console.log("Name", ritm.Name, "  Description=", ritm.events[0].Description, "  DOB=", ritm.events[0].Date, "Address=", (ritm.address!=null && ritm.address.length>0?ritm.address[0].Address:"N/A"));
			//	else
			//		console.log("Name", ritm.Name, "  NOOOO BIRTHDAY", "Address=", (ritm.address!=null && ritm.address.length>0?ritm.address[0].Address:"N/A"));
			//});
			//console.log("result", res);
			res.json(peopleList);
          }*/ );

		  aggCursor.toArray(function(err, res) {
            if (err) {
                console.log('toArray throwing error', err);
                client.close();
                throw err;
            }
            client.close();
            
            for(i=0;i<res.length;i++){
                res[i].AddressID=res[i]["Address ID"];
                res[i].E_Mail=res[i]["E-Mail"];
                res[i].Home_Phone=res[i]["Home Phone"];

                delete res[i]["Address ID"];
                delete res[i]["E-Mail"];
                delete res[i]["Home Phone"];
            }
            //PeopleList.forEach((docs) => {
            //        console.log("docs", docs);
            //    });
            resp.json(res);
          });


	  });
});

/* Get users
router.get('/users2', (req, res) => {
    CreateConnection((db) => {
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
//Rest passing '/events/:UserID'
//      req.params.UserID==null

router.get('/events', (req, resp) => {
    var mtch = { $match : {$and:[]}  } ;
    var dtchk = {Date: {"$gte": new Date("1/1/0001"), "$lt": new Date()}};
    console.log("req.query", req.query);
   
    console.log("req.query userid",req.query.userid, "fromDate", req.query.fromdate, "toDate", req.query.todate,"cat", req.query.cat,"descrip", req.query.descrip);
    if (req.query.userid==null || (req.query.userid!=null && req.query.userid==="0"))
        mtch.$match.$and.push({UserID:{$ne:null}});
    else
        mtch.$match.$and.push({UserID:parseInt(req.query.userid)});

    if (req.query.fromdate!=null)
        mtch.$match.$and.push({Date: {"$gte": new Date(req.query.fromdate)}});

    if (req.query.todate!=null)
    mtch.$match.$and.push({Date: {"$lte": new Date(req.query.todate)}});

    if (req.query.cat!=null)
    mtch.$match.$and.push({Category:req.query.cat});

    if (req.query.descrip!=null) 
        mtch.$match.$and.push({ Description: new RegExp(req.query.descrip, "i") });

    //var catchk = {Category:"Hockey"};
    //var dtchk = {Date: {"$gte": startDate, "$lt": endDate}};
    //var deschk = { Description: /^schuebel/i }; 
    //var deschk = { Description: /jt/i }; 
    //var mtch = { $match : {$and:[  {Date: {$ne:null}},{Date: {"$gte": startDate, "$lt": endDate}}]}  } ;
    //ORIG{ $match : { $or: [ {Date: {"$gte": startDate, "$lt": endDate}}, {$and:[{Date: {$ne:null}} ,{TopicID:1}]}  ]}}, 
    //mtch = { $match : {$and:[  {UserID:1},{Date: {"$gte": new Date("3/1/2013")}}, {Date: {"$lt": new Date("5/1/2013")}}]}  } ;
    console.log("mtch filters=",mtch);
    CreateConnection((client) => {
        var db = client.db('SSSPersonDB');
 
        var eventCusor = db.collection('events')
            .aggregate([
                mtch,
				{ $lookup:
                    { 
                      from: 'people',
                      localField: 'UserID',
                      foreignField: '_id',
                      as: 'eventperson'
                    }
                },
                {$sort: {Date: 1}}
            ]); 
            eventCusor.toArray(function(err, res) {
                if (err) {
                    console.log('toArray throwing error', err);
                    client.close();
                    throw err;
                }
                client.close();
                //console.log('before cursor eventList', eventList);
                lodash.remove(res, function (selVal) {
                    //console.log('selVal', selVal);
                    return (selVal===null || (selVal!=null && selVal.Date===null));
                  });
                resp.json(res);
            //console.log("eventList count", res.length);
            });
	  });
});


router.get('/addresses', (req, res) => {
    CreateConnection((client) => {
        var db = client.db('SSSPersonDB');
        db.collection('addresses')
        .find()
        .toArray()
        .then((addresses) => {
            client.close();
             //   console.log("addresses",addresses);
                response.data = addresses;
                res.json(response);
         })
        .catch((err) => {
                sendError(err, res);
        });
    });
});


router.post('/event', verifyToken, function(req, res) {
    console.log("post event");
    //console.log("req.body",req.body);    //body to json from a post
    //console.log("req.query", req.query);
  
    //make sure the date is not a string.
    req.body.event.Date = new Date(req.body.event.Date);
    req.body.event.createdate = new Date(req.body.event.createdate);
    console.log("req.body.event",req.body.event);
    CreateConnection((db) => {
        db.collection('events')
        updateEvent(db, req.body.event).then(() => { 
            db.close();
            console.log("User Saved evtobj=",req.body);
            response.data = { status:"Event Saved", person:req.body};
            res.json(response);
        })
        .catch(err => {
            db.close();
            console.log("event email save failed",err);
            sendError(err, evtobj);
        });
    });
});

router.post('/eventemail', verifyToken, function(req, res) {
    console.log("req.body",req.body);    //body to json from a post
//    console.log("req.query", req.query);
CreateConnection((db) => {
        db.collection('events')
            .update({_id:req.body.id}, { $set : {'Emails': req.body.Emails}})
            .then(() => {
                db.close();
                console.log("Event Saved",req.body.id);
                response.data = { status:"Email Event Saved"};
                res.json(response);
            })
            .catch((err) => {
                db.close();
                console.log("event email save failed",err);
                sendError(err, res);
            });
    });
});


router.get('/categories', (req, res) => {
    CreateConnection((client) => {
        var db = client.db('SSSPersonDB');
        db.collection('events')
            .distinct("Category")
            .then((Categories) => {
                client.close();
             //   console.log("Categories",Categories);
                response.data = Categories;
                res.json(response);
            })
            .catch((err) => {
                client.close();
                sendError(err, res);
            });
    });
});

/*
router.get('/events2', (req, res) => {
    var startDate = new Date(1/1/0001);
    var endDate = new Date();
    
    //console.log("startsecs="+ startsecs + "  endsecs="+ endsecs);
   
    console.log("startDate",startDate + "  endDate=", endDate);
    
    CreateConnection((db) => {
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
*/

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
    //console.log(req.body);    //body to json from a post
    //  console.log("hit GetCalendarEvents");  //querystring to json
    //console.log(req.query);  //querystring to json
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

    console.log("startMonth="+ startMonth + "  endMonth="+ endMonth + "  months=" + mnths);
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

       // console.log("lstEvents count=", lstEvents);
        res.json(lstEvents);
      }, function(err) {
        console.error('The promise was rejected', err, err.stack);
      });

    //Get Events == birthday and with 
/*    
    CreateConnection((db) => {
        db.collection('events')
            .find({Date:{"$ne":null}, $where : mnths, Category:'Birthday'})  //{"Date" : {"$gte": startDate, "$lt": endDate}}
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
     
                response.data = lstEvents;
                res.json(response);
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