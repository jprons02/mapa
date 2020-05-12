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

            console.log("uploadFile() fired.");

            /*
            ////////////////////////////
            //https://stackoverflow.com/questions/56531921/how-to-convert-a-formdata-object-to-binary-in-javascript
            //https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString
            const getBinaryFromFile = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
            
                    reader.addEventListener("load", () => resolve(reader.result));
                    reader.addEventListener("error", err => reject(err));
            
                    reader.readAsBinaryString(file);
                });
            }
            //////////////////////////////
            */
            /*
            let formData = new FormData(); // instantiate it
            // suppose you have your file ready
            formData.set('file', this.props.selectedFile);
            console.log(formData);
            */
            //console.log(this.props.selectedFile);
            
            const url = '/api/upload';
            // Get binary without ugly callbacks using ES7
            async function getBinaryFromFile(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.addEventListener("load", () => resolve(reader.result));
                    reader.addEventListener("error", err => reject(err));

                    reader.readAsBinaryString(file);
                });
            }

            // Usage - binary shows file contents!!!! WORKING!!!
            var file = this.props.selectedFile,
                binary = await getBinaryFromFile(file);


            
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'content-type': 'application/octet-stream'
                },
                //data: binary
                data: this.props.selectedFile
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
        //console.log(this.props);
        //if(this.props.selectedFile) {console.log(this.props.selectedFile)}
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