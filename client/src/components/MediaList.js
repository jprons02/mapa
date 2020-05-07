import React from 'react';
import {connect} from 'react-redux';
import {fetchList} from '../actions'

class MediaList extends React.Component {

    //determine type of file and organize as such.

    componentDidMount() {
        this.props.fetchList();
    }

    //need for logos, tv spots, radio spots, web banners.
    //also, spanish or english.
    //this.props.mediaList.entries[0].path_lower... do some regex to sort by language and file type.

    
    renderList = () => {
        return (
            this.props.mediaList.entries.map((listItem) => {
                return (
                    <li key={listItem.id}>
                        <a href={`/api/download${listItem.path_lower}`}>{listItem.name}</a>
                    </li>      
                )
            })
        );
    }
    
    /*
    //working out sorting files...
    renderList = () => {
        return (
            this.props.mediaList.entries.map((listItem) => {
                const english = [];
                const spanish = [];
                const englishRegex = '';
                const spanishRegex = '';

                if(listItem.path_lower === true) {
                    return null;
                }
                
            })
        );
    }
    */

    render() {
        console.log(this.props.mediaList);
        return ( 
            <div>
                <h1>Media</h1>
                <ul>
                    {this.props.mediaList.entries ? this.renderList() : "Loading..."}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{fetchList})(MediaList);