import React from 'react';
import {connect} from 'react-redux';
import {fetchList} from '../actions'

class MediaList extends React.Component {

    componentDidMount() {
        this.props.fetchList();
    }

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