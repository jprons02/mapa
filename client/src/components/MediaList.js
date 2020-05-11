import React from 'react';
import {connect} from 'react-redux';
import {fetchList} from '../actions'

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
    
    
    render() {
        console.log(this.props.mediaList);
        return ( 
            <div>
                <div>
                    <h2>English</h2>
                    {this.props.mediaList.entries ? this.renderList("english") : "loading list..."}
                </div>
                <div>
                    <h2>Spanish</h2>
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