//gets all key claims from database
//for explanation of any variables or methods in the following get request, see
//router.get('/alltopics') as the same variables and methods are used there
router.get('/allkeyclaims', (req, res) => {

    // if(req.isAuthenticated()){

    const queryText = `;`

    pool.query(queryText).then((result) => {
    
        res.send(result.rows)

    }).catch((error) => {
        console.log('Error in getting key claims: ', error);
        
    })
    // } else{

    //     //if req.isAuthenticated() is false, the forbidden error will appear
    //     //on the webpage
    //     res.sendStatus(403)
    // }
});

//gets all streams from database
//for explanation of any variables or methods in the following get request, see
//router.get('/alltopics') as the same variables and methods are used there
router.get('/allstreams', (req, res) => {

    // if(req.isAuthenticated()){

    const queryText = `;`

    pool.query(queryText).then((result) => {
        res.send(result.rows)

    }).catch((error) => {
        console.log('Error in getting streams: ', error);
        
    })
    // } else{

    //     //if req.isAuthenticated() is false, the forbidden error will appear
    //     //on the webpage
    //     res.sendStatus(403)
    // }
});

//gets all contributors from database
//for explanation of any variables or methods in the following get request, see
//router.get('/alltopics') as the same variables and methods are used there
router.get('/allcontributors', (req, res) => {

    // if(req.isAuthenticated()){

    const queryText = `SELECT * FROM "contributor";`

    pool.query(queryText).then((result) => {
        res.send(result.rows)

    }).catch((error) => {
        console.log('Error in getting contributors: ', error);
        
    })
    // } else{

    //     //if req.isAuthenticated() is false, the forbidden error will appear
    //     //on the webpage
    //     res.sendStatus(403)
    // }
});

//gets all proposals from database
//for explanation of any variables or methods in the following get request, see
//router.get('/alltopics') as the same variables and methods are used there
router.get('/allproposals', (req, res) => {

    // if(req.isAuthenticated()){

    const queryText = `;`

    pool.query(queryText).then((result) => {
        res.send(result.rows)

    }).catch((error) => {
        console.log('Error in getting proposals: ', error);
        
    })
    // } else{

    //     //if req.isAuthenticated() is false, the forbidden error will appear
    //     //on the webpage
    //     res.sendStatus(403)
    // }
});

//gets all likes from database
//for explanation of any variables or methods in the following get request, see
//router.get('/alltopics') as the same variables and methods are used there
router.get('/alllikes', (req, res) => {

    // if(req.isAuthenticated()){

    const queryText = `;`

    pool.query(queryText).then((result) => {
        res.send(result.rows)

    }).catch((error) => {
        console.log('Error in getting likes: ', error);
        
    })
    // } else{

    //     //if req.isAuthenticated() is false, the forbidden error will appear
    //     //on the webpage
    //     res.sendStatus(403)
    // }
});

//gets all loves from database
//for explanation of any variables or methods in the following get request, see
//router.get('/alltopics') as the same variables and methods are used there
router.get('/allloves', (req, res) => {

    // if(req.isAuthenticated()){

    const queryText = `;`

    pool.query(queryText).then((result) => {
        res.send(result.rows)

    }).catch((error) => {
        console.log('Error in getting loves: ', error);
        
    })
    // } else{

    //     //if req.isAuthenticated() is false, the forbidden error will appear
    //     //on the webpage
    //     res.sendStatus(403)
    // }
});

router.post('/newtopic', (req, res) => {

    // if(req.isAuthenticated){
         //game is the newInput object from state in GameInfo.js
         const topic = req.body;
         console.log('topic: ', topic);
         

         (async () => {
             //client does not allow the program to proceed until it is connected to the database
             const client = await pool.connect();
 
             try{
                 await client.query('BEGIN');

                 //text for posting contributor info to the database
                 let queryText1 = `INSERT INTO "contributor" ("first_name", "last_name", "bio", "photo_url")
                 VALUES($1, $2, $3, $4) RETURNING "id";`;
                 const contributor1Result = await client.query(queryText1, [topic.contributor1FirstName, 
                    topic.contributor1LastName, topic.bio1, topic.photo1]);
                    console.log('successfully posted contributor1');
                
                const contributor1Id = contributor1Result.rows[0].id

                let queryText2 = `INSERT INTO "contributor" ("first_name", "last_name", "bio", "photo_url")
                 VALUES($1, $2, $3, $4) RETURNING "id";`;
                 const contributor2Result = await client.query(queryText2, [topic.contributor2FirstName, 
                    topic.contributor2LastName, topic.bio2, topic.photo2]);
                    console.log('successfully posted contributor12');
                
                const contributor2Id = contributor2Result.rows[0].id
 
                 //creates an entry in the topic table in the database
                 let queryText = `INSERT INTO "topic" ("topic_title", "premise", "common_ground", "contributor1_id",
                 "contributor2_id", "archive_summary") VALUES($1, $2, $3, $4, $5, $6)  RETURNING "id";`;
                 const topicResult = await client.query(queryText, [topic.topicTitle, topic.topicPremise, topic.topicCommonGround, 
                    contributor1Id, contributor2Id, topic.topicSummary]);
                    console.log('successfully posted topic');
 
                 //the id of the topic that was created in topicResult
                 const topicId = topicResult.rows[0].id

                let queryText3 = `INSERT INTO "proposal" ("topic_id", "contributor_id", "proposal") VALUES($1,
                    $2, $3);`
                    
                 await client.query(queryText3, [topicId, contributor1Id, topic.proposal1])
                 console.log("successfully posted contributor1's proposal");

                 let queryText4 = `INSERT INTO "proposal" ("topic_id", "contributor_id", "proposal") VALUES($1,
                    $2, $3);`
                    
                 await client.query(queryText4, [topicId, contributor2Id, topic.proposal2])
                 console.log("successfully posted contributor2's proposal");

                //key is each property in keyClaims e.g. 0:{topicId: 1, ...}, 1:{topicId: 2, ...}, ...
                 for(key in topic.keyClaims){
                     console.log('key: ', key);
                     
                    let claim_order = key;
                     //keyData is the value of a property in the keyClaims object e.g. 
                     //{claimDbId: '0', claimContributor: 'contributor1', keyClaim: 'text', streamData: {}}
                    let keyData = topic.keyClaim[key]
                    let keyClaimData = [];
                    
                     for(prop in keyData){
                        //keyDataProp is the value of a property in the keyData object e.g.
                        //'0', 'contributor1', 'text' 
                        let keyDataProp = keyData[prop]
                        keyClaimData.push(keyDataProp);
                     }
                        //end for loop of for(prop in keyData)

                    let queryText5 = `INSERT INTO "key_claim" ("topic_id", "contributor_id", "claim", "claim_order")
                    VALUES($1, $2, $3, $4) RETURNING "id";`;
                    let contributor;
                    if(keyClaimData[1] === 'contributor1'){
                        contributor = contributor1Id
                    }else{
                        contributor = contributor2Id
                    }
                    const keyClaimResult = await client.query(queryText5, [topicId, contributor, keyClaimData[2], claim_order])
                    console.log("successfully posted key claim");

                    const keyClaimId = keyClaimResult.rows[0].id

                    let streamData = keyClaimData[3]

                    for(stream in streamData){
                        let streamClaimData = [];

                        //stream is the 0 property, 1 property, etc. in the streamData object
                        let stream_order = stream;

                        //streamDataObj is the value of a property in the streamData object; this
                        //value is an object e.g. {streamDbId: '0', streamContributor: 'contributor2', 
                        //streamComment: 'text', streamEvidence: 'more text',}
                        let streamDataObj = streamData[stream]
                        for(prop in streamDataObj){
                            //prop is each property in the streamDataObj, but I want the values...

                            //streamDataProp is the value of a property in the streamDataObj object e.g.
                            //'0', 'contributor2', 'text', 'more text'
                            let streamDataProp = streamDataObj[prop]
                            streamClaimData.push(streamDataProp)
                        }
                    let queryText6 = `INSERT INTO "stream" ("key_claim_id", "contributor_id", "stream_comment", 
                    "stream_evidence", "stream_order")
                    VALUES ($1, $2, $3, $4, $5)`
                    if(streamClaimData[1] === 'contributor1'){
                        contributor = contributor1Id;
                    }else{
                        contributor = contributor2Id
                    }

                    await client.query(queryText6, [keyClaimId, contributor, streamClaimData[2], streamClaimData[3]])
                    console.log("successfully posted stream claim");
                    }
                 }

                 await client.query('COMMIT');
                 res.sendStatus(201);
 
             } catch (e) {
 
                 //checks for errors at any point within the try block; if errors are found,
                 //all the data is cleared to prevent data corruption
                 console.log('ROLLBACK', e);
                 await client.query('ROLLBACK');
                 throw e;
             } finally {
 
                 //allows res.sendStatus(201) to be sent
                 client.release();
             }
 
             //if an error occurs in posting the game info to the database, the error will
             //appear in the console log
         })().catch((error) => {
             console.log('CATCH', error);
             res.sendStatus(500);
         })
    // }

});