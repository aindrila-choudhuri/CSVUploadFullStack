const express = require("express");
const fs = require("fs");
const csv = require("fast-csv");
const AccountStatement = require("./../database/models/AccountStatement");
const csvUpload = require("./../fileUpload/csvUpload");

const routes = express.Router({
    mergeParams: true
})

let status = {
    "percentageStatus" : 0,
    "overallStatus": "",
    "fileName" : ""
}

routes.get("/checkstatus", (req, res) => {
    res.status(200).send({status});
})

routes.post("/upload", (req, res) => {
    try {
        let progress = 0;
        let perc = 0

        let total = req.headers['content-length'];

        req.on("data", (chunk) => {
            progress += chunk.length;
            perc = parseInt((progress/total) * 100);
            percentageStatus = perc;
            status = {
                percentageStatus : perc,
                overallStatus: "in progress"
            }
        });
        
        req.on("error", (chunk) => {
            status = {
                percentageStatus : perc,
                overallStatus: "error"
            }
        });

        req.on("end", (chunk) => {
            status = {
                percentageStatus : perc,
                overallStatus: "completed"
            }
        });

        var upload = csvUpload.single("file");

        upload(req, res, (err) => {
            if (req.file == undefined) {
                return res.status(400).send("Please upload a CSV file!");
            }
            status.fileName = req.file.originalname;
            let bulkOps = [];
            let path = "uploads/" + req.file.filename;


            fs.createReadStream(path)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                const filter = {
                folioNumber: row.folio_number,
                dateTime: new Date(row.date_time)
                };
                
                const update = {$set: {
                folioNumber: row.folio_number,
                unitPrice: parseFloat(row.unit_price),
                unitsBought: parseFloat(row.units_bought),
                totalPrice: parseFloat(row.total_price),
                dateTime: new Date(row.date_time),
                userID: row.user_id
                }};

                const upsertDoc = {
                updateOne: {
                    filter,
                    update,
                    upsert: true
                }};
                
                bulkOps.push(upsertDoc);
            })
            .on("end", () => {
                AccountStatement.collection.bulkWrite(bulkOps)
                    .then( bulkWriteOpResult => {
                        console.log('BULK update OK');
                        res.status(200).send({
                            message:
                                "Uploaded the file successfully: " + req.file.originalname,
                        });
                    })
                    .catch( err => {
                    console.log('BULK update error: ', err);
                    console.log(JSON.stringify(err, null, 2));
                });
                
            });
        });
    } catch (error) {
        console.log("Upload file error: ", error);
        res.status(500).send({
          message: "Could not upload the file: " + req.file.originalname,
        });
    }
});

routes.get("/reporting/:userID", async (req, res) => {
    await AccountStatement.aggregate(
        [   {
                "$match": {
                    "userID": req.params.userID,
                }
            },
            { 
                "$group": { 
                    "_id": "$folioNumber",
                    "totalInvestmentMadeTillDate": { "$sum" : "$totalPrice" },
                    "transactions" : {
                        "$push" : {
                            "unitPrice" : "$unitPrice",
                            "unitsBought" : "$unitsBought",
                            "dateTime" : "$dateTime",
                            "userID" : "$userID",
                            "totalPrice" : "$totalPrice"
                        }
                        
                    }
                }
            },
            { 
                "$project": {  
                        "_id": 0,
                        "folioNumber": "$_id",
                        "transactions": 1,
                        "totalInvestmentMadeTillDate": 1
                }
            }
        ],
        (err,results) => {
            if (err) {
                console.log("/reporting/:userID API returned error from database: ", err)
                res.send(err);
            } else {
                console.log("/reporting/:userID API successfully fetched data from database")
                res.json(results);
            }
        }
    )
})

const getPagination = (page, size) => {
    const limit = size && size > 0 ? +size : 3;
    const offset = page && page > 0 ? (page-1) * limit : 0;
    return { limit, offset };
};


routes.get("/", async (req, res) => {
    const { currentPage, pageSize } = req.query;
    
    const { limit, offset } = getPagination(currentPage, pageSize);
    
    let options = { offset, limit};
    if (req.query.sortField) {
        let sort = {};
        sort[req.query.sortField] = 1;
        if (req.query.sortOrder) {
            sort[req.query.sortField] = req.query.sortOrder;
        }
        options = { offset, limit, sort }
    }
    

    await AccountStatement.paginate({}, options)
    .then((data) => {
        console.log("accountstatements get API successfully fetched data from database")
        res.status(200).send({
          totalItems: data.totalDocs,
          accountStatements: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page,
        });
    })
    .catch((err) => {
        console.log("Account Statements API fetch error:", err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
    });
});

module.exports = {
    routes
};