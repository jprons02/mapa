import React from 'react';
import {connect} from 'react-redux';
import {fetchList} from '../actions';
import {Icon, List, Header} from 'semantic-ui-react';

class MediaList extends React.Component {

    //download
    //<Icon name='download' size='mini' />
    /*
    <List>
        <List.Item>
            <List.Icon name='download' />
            <List.Content>Semantic UI</List.Content>
        </List.Item>
    </List>
    */

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
                spanishMediaList.push(listItem);
            } else {
                englishMediaList.push(listItem);
            }
        });
        
        //sort by media type
        const mediaType = (languageList) => {
            const videoRegex = /((.mp4$)|(.wmv$)|(.mov$))/gmi;
            const audioRegex = /((.mp3$)|(.m4a$)|(.wav$))/gmi;
            const imageRegex = /((.png$)|(.jpg$))/gmi;
            const videoList = [];
            const audioList = [];
            const imageList = [];
            languageList.map((listItem) => {
                switch (true) {
                    case videoRegex.test(listItem.name):
                        videoList.push(listItem);
                        break;
                    case audioRegex.test(listItem.name):
                        audioList.push(listItem);
                        break;
                    case imageRegex.test(listItem.name):
                        imageList.push(listItem);
                        break;
                }
            });

            return {
                video: videoList,
                audio: audioList,
                image: imageList
            }
        }
        
        newMediaObj = {
            english: mediaType(englishMediaList),
            spanish: mediaType(spanishMediaList)
        }        
        return newMediaObj;
    }

    //maybe i can pass language and media type in this function... in stead of having 3 of the same functions...    
    renderVideo = (language) => {
        if(this.sortItems()[language].video[0]) { 
            return (
                <React.Fragment>
                <Header as='h4'>Video</Header>
                <List>
                    {this.sortItems()[language].video.map((listItem) => {
                        return (
                            <List.Item style={{marginBottom: '4px'}} key={listItem.id}>
                                <List.Icon name='download' />
                                <List.Content>
                                    <List.Header href={`/api/download${listItem.path_lower}`} as='a'>{listItem.name}</List.Header>
                                    <List.Description>
                                    Spanish Commercial
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
                {this.renderVideo(language)}
                {this.sortItems()[language].audio[0] ? <Header as='h4'>Audio</Header> : ''}
                <List>
                    {this.sortItems()[language].audio.map((listItem) => {
                        return (
                            <List.Item key={listItem.id}>
                                <List.Icon name='download' />
                                <List.Content>
                                    <a href={`/api/download${listItem.path_lower}`}>
                                    {listItem.name}
                                    </a>
                                </List.Content>
                            </List.Item>
                        )
                    })}
                </List>
                {this.sortItems()[language].image[0] ? <Header as='h4'>Image</Header> : ''}
                <List>
                    {this.sortItems()[language].image.map((listItem) => {
                        return (
                            <List.Item key={listItem.id}>
                                <List.Icon name='download' />
                                <List.Content>
                                    <a href={`/api/download${listItem.path_lower}`}>
                                    {listItem.name}
                                    </a>
                                </List.Content>
                            </List.Item>
                        )
                    })}
                </List>
            </div>
        )
    }
    
    
    render() {
        //console.log(this.props.mediaList);
        return ( 
            <div>
                <div>
                    <Header as='h2'>English</Header>
                    {this.props.mediaList.entries ? this.renderList("english") : "loading list..."}
                </div>
                <div style={{marginTop: '60px'}}>
                    <Header as='h2'>Spanish</Header>
                    {this.props.mediaList.entries ? this.renderList("spanish") : "loading list..."}
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{fetchList})(MediaList);




/*
    renderList = (language) => {
        return (
            <div>
                <h3>Videos</h3>
                <ul>
                    {this.sortItems()[language].video.map((listItem) => {
                        return (
                            <li key={listItem.id}>
                                <a href={`/api/download${listItem.path_lower}`}>{listItem.name}</a>
                            </li>
                        )
                    })}
                </ul>
                <h3>Audio</h3>
                <ul>
                    {this.sortItems()[language].audio.map((listItem) => {
                        return (
                            <li key={listItem.id}>
                                <a href={`/api/download${listItem.path_lower}`}>{listItem.name}</a>
                            </li>
                        )
                    })}
                </ul>
                <h3>Image</h3>
                <ul>
                    {this.sortItems()[language].image.map((listItem) => {
                        return (
                            <li key={listItem.id}>
                                <a href={`/api/download${listItem.path_lower}`}>{listItem.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
*/