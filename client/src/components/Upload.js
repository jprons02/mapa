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
        console.log("uploadFile() fired.");
        if(this.props.selectedFile.name) {

            ////////////////////////////
            //https://stackoverflow.com/questions/56531921/how-to-convert-a-formdata-object-to-binary-in-javascript
            //https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString
            function getBinaryFromFile(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
            
                    reader.addEventListener("load", () => resolve(reader.result));
                    reader.addEventListener("error", err => reject(err));
            
                    reader.readAsBinaryString(file);
                });
            }
            //////////////////////////////

            
            const url = '/api/upload';
            const data = new FormData();
            data.append('file', this.props.selectedFile);

            const dataValue = data.get('file');

            

            console.log(data.get('file'));

            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'content-type': 'multipart/form-data'
                },
                data: data.get('file')
            })

            console.log(response.statusText);
            console.log(response.data);
            

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