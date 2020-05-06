import React from 'react';
import {connect} from 'react-redux';

class AdminTools extends React.Component {

    componentDidMount() {
        const user = this.props.isSignedIn.username;
        const signedIn = this.props.isSignedIn.isMatch;
        console.log(user, signedIn);
        //why is user and signedIn undefined??
        
    }


    render() {
        console.log(this.props);
        return (
            <div>
                <h1>Into to Node and MongoDB</h1>
                <div>
                    <h3>Sign Up!</h3>
                    <form method="post" action="/api/adduser">
                    <label>Login: </label>
                    <input type="text" name="loginId" placeholder="ID"/>
                    <br />
                    <label>Password: </label>
                    <input type="text" name="loginPassword" placeholder="Password"/>
                    <br />
                    <input type="submit" value="Add Name" />
                    </form>
                </div>

                <div style={{marginTop: "50px"}}>
                    <a href="/auth/google"><button>google oauth login</button></a>
                </div>

                <div style={{marginTop: "10px"}}>
                    <a href="/api/logout"><button>google oauth logout</button></a>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(AdminTools);