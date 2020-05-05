import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile} from '../actions';

/*
const form = new FormData();
// Second argument  can take Buffer or Stream (lazily read during the request) too.
// Third argument is filename if you want to simulate a file upload. Otherwise omit.
form.append('field', 'a,b,c', 'blah.csv');
axios.post('http://example.org/endpoint', form, {
  headers: form.getHeaders(),
}).then(result => {
  // Handle result…
  console.log(result.data);
});
*/



class Upload extends React.Component {

    uploadFile = async () => {
        if(this.props.selectedFile.name) {
            
            const url = `/api/upload/${this.props.selectedFile.name}`;
            const data = new FormData();
            data.append('file', this.props.selectedFile);
            const config = {
                headers: data.getHeaders()
            };
            
            const response = await axios.post(url, data, config);
            console.log("data is this: " + data);
            console.log("statusText is this: " + response.statusText);
            console.log("response.data is this: " + response.data);
            

            ////////
            /*
            const itemStream = createReadStream(this.props.selectedFile.name);
            const res = await axios({
                method: 'POST',
                url: `/api/upload/${this.props.selectedFile.name}`,
                headers : {
                    'Content-Type' : 'application/octet-stream'
                },
                data: itemStream,
            });
            */
            
        }
        else {
            alert("Please select a file.");
        }
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <h1>Upload File</h1>
                <input type="file" name="file" id="file" onChange={this.props.selectFile}/>
                <br />
                <button onClick={this.uploadFile}>Upload</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{selectFile})(Upload);