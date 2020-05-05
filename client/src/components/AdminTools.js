import React from 'react';

const AdminTools = () => {
    return (
        <div>
            <h1>Into to Node and MongoDB</h1>
            <div>
                <h3>Sign Up!</h3>
                <form method="post" action="/api/adduser">
                <label>Login: </label>
                <input type="text" name="loginId" placeholder="ID" required />
                <br />
                <label>Password: </label>
                <input type="text" name="loginPassword" placeholder="Password" require />
                <br />
                <input type="submit" value="Add Name" />
                </form>
            </div>

            
            <div style={{marginTop: "50px"}}>
                <h3>Log In!</h3>
                <form method="post" action="/api/login">
                <label>Login: </label>
                <input type="text" name="loginId" placeholder="ID" required />
                <br />
                <label>Password: </label>
                <input type="text" name="loginPassword" placeholder="Password" required />
                <br />
                <input type="submit" value="Submit" />
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

export default AdminTools;