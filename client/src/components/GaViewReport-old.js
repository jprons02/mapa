import React from 'react';
import {connect} from 'react-redux';
import {getGaToken} from '../actions';
import {Button} from 'semantic-ui-react';

class GaViewReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            filesToDelete: [],
            isDeleting: false
        };
    }

    componentDidMount = () => {
        this.props.getGaToken();
    }

    render() {
        const {gaToken} = this.props;
        if(gaToken !== '') {
            window.gapi.analytics.ready(() => {
                /**  Authorize the user with an access token obtained server side. */
                window.gapi.analytics.auth.authorize({
                    serverAuth: {
                        access_token: gaToken,
                    },
                });

                //view: 126337661
                this.chart = new window.gapi.analytics.googleCharts.DataChart({
                    query: {
                        'ids': 'ga:126337661', // <-- Replace with the ids value for your view.
                        'start-date': '90daysAgo',
                        'end-date': 'today',
                        'metrics': 'ga:sessions,ga:users',
                        'dimensions': 'ga:date'
                    },
                    chart: {
                        'container': 'chart-container',
                        'type': 'LINE',
                        'options': {
                            'width': '100%'
                        }
                    }
                });

                this.chart.execute();
            });

            return (
                <React.Fragment>
                    <div id="chart-container" />
                </React.Fragment>
            );
        }
        else {
            return <div>Loading...</div>
        }
    }
}


const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{getGaToken})(GaViewReport);


