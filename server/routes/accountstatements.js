const express = require("express");
const fs = require("fs");
const csv = require("fast-csv");
const AccountStatement = require("./../database/models/AccountStatement");
const csvUpload = require("./../fileUpload/csvUpload");

const routes = express.Router({
    mergeParams: true
})

let status = 0

routes.get("/checkstatus", (req, res) => {
    res.status(200).send(status.toString())
})

routes.post("/upload", (req, res) => {
    try {
        let progress = 0;

        let total = req.headers['content-length'];

        req.on("data", (chunk) => {
            progress += chunk.length;
            let perc = parseInt((progress/total) * 100);
            status = perc;
        });

        var upload = csvUpload.single("file");

        upload(req, res, (err) => {
            if (req.file == undefined) {
                return res.status(400).send("Please upload a CSV file!");
            }

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
                    //console.log(JSON.stringify(bulkWriteOpResult, null, 2));
                    })
                    .catch( err => {
                    console.log('BULK update error: ', err);
                    console.log(JSON.stringify(err, null, 2));
                });
                res.status(200).send({
                    message:
                        "Uploaded the file successfully: " + req.file.originalname,
                });
            });
        });
    } catch (error) {
        console.log(error);
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
                res.send(err);
            } else {
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
        res.send({
          totalItems: data.totalDocs,
          accountStatements: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page,
        });
    })
    .catch((err) => {
        console.log("Account Statements fetch error:", err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
    });
});

module.exports = {
    routes
};