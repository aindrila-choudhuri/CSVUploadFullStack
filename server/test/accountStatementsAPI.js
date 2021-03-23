const chai = require("chai");
const chaiHttp = require("chai-http")
const server = require("../app");
const {connectDB, closeDB} = require("./../database/connection");

chai.should();

chai.use(chaiHttp);


describe("Account statement API", () => {
    describe("POST api", () => {
        before((done) => {
            connectDB().then(() => done())
            .catch(err => done(err));
        });
    
        after((done) => {
            closeDB().then(() => done())
            .catch(err => done(err));
        });

        it("It should upload csv file and save data to DB", (done) => {
            const path = __dirname + '/resource/cas5.csv'
            chai.request(server).post("/accountstatements/upload")
            .attach('file', path, 'cas5.csv')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message");
                done();
            })
        })
    });

    describe("GET accountstatements api without query parameters", () => {
        before((done) => {
            connectDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });
    
        after((done) => {
            closeDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });

        it("It should get all account statements", (done) => {
            chai.request(server).get("/accountstatements/")
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("totalItems");
                res.body.should.have.property("accountStatements");
                res.body.should.have.property("totalPages");
                res.body.should.have.property("currentPage");
                res.body.accountStatements.should.be.a("array");
                done();
            }).catch(done);
        });
    });

    describe("GET accountstatements api without query parameters", () => {
        before((done) => {
            connectDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });
    
        after((done) => {
            closeDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });

        it("It should get account statements with pagination", (done) => {
            chai.request(server).get("/accountstatements?currentPage=10&pageSize=5")
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("totalItems");
                res.body.should.have.property("accountStatements");
                res.body.should.have.property("totalPages");
                res.body.should.have.property("currentPage");
                res.body.accountStatements.should.be.a("array");
                done();
            }).catch(done);
        });
    });

    describe("GET accountstatements api without query parameters", () => {
        before((done) => {
            connectDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });
    
        after((done) => {
            closeDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });

        it("It should get account statements reporting for a user ID", (done) => {
            chai.request(server).get("/accountstatements/reporting/abc@example.com")
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                if (res.body.length) {
                    res.body[0].should.have.property("totalInvestmentMadeTillDate");
                    res.body[0].should.have.property("transactions");
                    res.body[0].should.have.property("folioNumber");

                    res.body[0].transactions.should.be.a("array");
                }
                done();
            }).catch(done);
        });
    });

    describe("GET file upload progress status", () => {
        before((done) => {
            connectDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });
    
        after((done) => {
            closeDB().then(() => done())
            .catch((err) => {
                done(err)
            });
        });

        it("It should get current file upload status", (done) => {
            chai.request(server).get("/accountstatements/checkstatus")
            .then((res, err) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("status");
                res.body.status.should.have.property("percentageStatus");
                res.body.status.should.have.property("overallStatus");
                res.body.status.should.have.property("fileName");
                done();
            }).catch(done);
        });
    });
});

