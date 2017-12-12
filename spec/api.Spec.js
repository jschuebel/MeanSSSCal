var Request = require("request");

//https://www.youtube.com/watch?v=aBYwNqiWYmU
describe("Testing the API Server:", function() {
  var server;
  beforeAll(() => {
//    server = require("../server/routes/api");
    server = require("../server");
  });

  afterAll(() => {
   // server.close();
  });
  describe("GET /", function() {
    var data = {};
    beforeAll((done) => {
      Request.get("http://localhost:3000/", (error, response, body) =>{
        data.status = response.statusCode;
        data.body = body;
        done();
      })
    });

    it("status 200", () => {
      expect(data.status).toEqual(200);
    })
  });

  describe("GET users /", function() {
    var data = {};
    beforeAll((done) => {
      Request.get("http://localhost:3000/api/users", (error, response, body) =>{
        data.status = response.statusCode;
        data.body = body;
        //console.log("body",body);
        done();
      })
    });

    it("status 200", () => {
      var hldperson = JSON.parse(data.body);
      expect(hldperson.length).toEqual(97);
    })
  });
  
});