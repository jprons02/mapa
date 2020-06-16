//Fetch and outputs a list of media from dropbox and then sorts it. 
//Outputted list is intentionally only .zip, audio and video files.
//Download on click.

import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import FileSaver from 'file-saver';
import {fetchList, downloadingFile} from '../actions';
import {Container, Icon, List, Header} from 'semantic-ui-react';

class MediaList extends React.Component {

    componentDidMount() {
        this.props.fetchList();
    }
    componentDidUpdate() {
        //determine type of file and organize as such.
        this.sortItems();
    }

    //Sort files by language and by type. Using regex for both. 
    //Regex for language: beginning of file MUST be named sp_ to find spanish files, default is english. 
    //example: sp_mediafile.jpb. "sp" is case insensitive.
    sortItems = () => {
        let newMediaObj = {};
        const englishMediaList = [];
        const spanishMediaList = [];
        const spanishRegex = /^sp_/i;
        
        //sort by language
        this.props.mediaList.entries.map((listItem) => {
            if(spanishRegex.test(listItem.name)) {
                return spanishMediaList.push(listItem);
            } else {
                return englishMediaList.push(listItem);
            }
        });
        
        //sort by media type
        const mediaType = (languageList) => {
            const videoRegex = /((.mp4$)|(.wmv$)|(.mov$))/gmi;
            const audioRegex = /((.mp3$)|(.m4a$)|(.wav$))/gmi;
            const imageRegex = /((.png$)|(.jpg$))/gmi;
            const logoRegex = /logo/gmi;
            const zipRegex = /\.zip$/gmi;
            const videoList = [];
            const audioList = [];
            const imageList = [];
            const logoList = [];
            const zipList = [];

            languageList.map((listItem) => {
                if(videoRegex.test(listItem.name)) {
                    return videoList.push(listItem);
                }
                else if(audioRegex.test(listItem.name)) {
                    return audioList.push(listItem);
                }
                else if(imageRegex.test(listItem.name)) {
                    return imageList.push(listItem);
                }
                else if(logoRegex.test(listItem.name)) {
                    return logoList.push(listItem);
                }
                else if(zipRegex.test(listItem.name)) {
                    return zipList.push(listItem);
                }
                return null;
            });

            return {
                video: videoList,
                audio: audioList,
                image: imageList,
                logo: logoList,
                zip: zipList
            }
        }
        
        newMediaObj = {
            english: mediaType(englishMediaList),
            spanish: mediaType(spanishMediaList)
        }        
        return newMediaObj;
    }


    //download on file click
    downloadFile = async (url, file) => {
        this.props.downloadingFile(true);

        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/octet-stream'
            }
        })
        
        if(response.data) {
            this.props.downloadingFile(false);
        }
        const blob = new Blob([response.data], {type: "application/octet-stream"});
        FileSaver.saveAs(blob, file);
        
    }

    
    renderMediaContent = (language, media, title) => {
        if(this.sortItems()[language][media][0]) { 
            return (
                <React.Fragment>
                <Header as='h4'>{title}</Header>
                <List>
                    {this.sortItems()[language][media].map((listItem) => {
                        return (
                            <List.Item style={{marginBottom: '4px'}} key={listItem.id}>
                                <List.Icon name='download' />
                                <List.Content>
                                    <List.Item onClick={() => this.downloadFile(`/api/download${listItem.path_lower}`, listItem.name)}  as='a'>{listItem.name}</List.Item>
                                    <List.Description style={{paddingTop: '3px'}}>
                                        {Math.ceil(listItem.size / 1000000) < 1000 ? 
                                            (listItem.size / 1000000).toFixed(2) + 'MB' : 
                                            (listItem.size / 1000000000).toFixed(2) + 'GB'}
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        )
                    })}
                </List>
                </React.Fragment>
            )
        }
        else {
            return null;
        }
    }

    
    renderList = (language) => {
        return (
            <div>
                {this.renderMediaContent(language, 'logo', 'Logos')}
                {this.renderMediaContent(language, 'zip', 'Web Banners')}
                {this.renderMediaContent(language, 'video', 'TV Spots')}
                {this.renderMediaContent(language, 'audio', 'Radio Spots')}
            </div>
        )
    }
    
    
    render() {
        return ( 
            <Container>
                <div id='downloading' style={{marginBottom: '30px', display: this.props.isDownloading ? 'block' : 'none' || 'none'}}>
                    <Icon loading name='spinner' /> DOWNLOADING...
                </div>
                <div>
                    <Header as='h2'>English</Header>
                    {this.props.mediaList.entries ? this.renderList("english") : "loading list..."}
                </div>
                <div style={{marginTop: '60px'}}>
                    <Header as='h2'>Spanish</Header>
                    {this.props.mediaList.entries ? this.renderList("spanish") : "loading list..."}
                </div>
            </Container>
            
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{fetchList, downloadingFile})(MediaList);