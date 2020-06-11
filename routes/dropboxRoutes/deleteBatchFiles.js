const axios = require('axios');
const {dropboxAccessToken} = require('../../config/keys')

module.exports = app => {
    app.post('/api/deletefiles', async (req, res) => {
        console.log('begin delete process');
        console.log(req.body);
        
        const dataToSend = req.body.map((file) => {
            return {
                'path': file
            }
        })

        const deleteCheck = async (jobId) => {
            try {
                const response = await axios({
                    method: 'POST',
                    url: 'https://api.dropboxapi.com/2/files/delete_batch/check',
                    responseType: 'application/json',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${dropboxAccessToken}`
                    },
                    data: JSON.stringify({
                        "async_job_id": jobId
                    })
                });
                console.log(response.data);
                if(response.data['.tag'] == 'complete') {
                    res.send(response.data);
                }
                else {
                    deleteCheck(jobId);
                }
            }
            catch(error) {
                console.log(error.response.data);
                res.send(error.response.data);
            }
        };
        
        try {
            const response = await axios({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/files/delete_batch',
                responseType: 'application/json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dropboxAccessToken}`
                },
                data: JSON.stringify({
                    "entries": dataToSend
                })
            });
            //res.send(response.data);
            //do delete batch check...
            if(response.data) {
                deleteCheck(response.data.async_job_id);
            }
        }
        
        catch(error) {
            res.send(error.response.data);
        }

    });
}