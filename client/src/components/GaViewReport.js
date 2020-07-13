import React from 'react';
import {Button, Segment, Form, Loader, Header} from 'semantic-ui-react';

class GaViewReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedProperty: 'miccosukee',
            selectedReport: 'weekOverWeek',
            isIframeLoading: true
        }
    }


    gaProperties = () => {
        return [
            {key: 'miccosukee', value: 'miccosukee', text: 'Miccosukee'},
            {key: 'mrg', value: 'mrg', text: 'Resort & Gaming'},
            {key: 'golf', value: 'golf', text: 'Golf & Country Club'},
            {key: 'village', value: 'village', text: 'Indian Village'},
            {key: 'airboat', value: 'airboat', text: 'Airboat Rides'}
        ]
    }

    gaReport = () => {
        return [
            {key: 'weekOverWeek', value: 'weekOverWeek', text: 'Week over Week'},
            {key: 'monthOverMonth', value: 'monthOverMonth', text: 'Month over Month'},
            {key: 'yearOverYear', value: 'yearOverYear', text: 'Year over Year'},
            {key: 'sessionsByDevice', value: 'sessionsByDevice', text: 'Sessions by Device'},
            {key: 'referringSocialSources', value: 'referringSocialSources', text: 'Referring Social Sources'},
            {key: 'referringDomains', value: 'referringDomains', text: 'Referring Domains'}
        ]
    }

    onPropertyChange = (e, value) => {
        this.setState({
            selectedProperty: value,
            isIframeLoading: true
        })
    }

    onReportChange = (e, value) => {
        this.setState({
            selectedReport: value,
            isIframeLoading: true
        })
    }

    hideSpinner = () => {
        this.setState({
            isIframeLoading: false
        })
    }


    reports = () => {
        return { 
            miccosukee: {
                weekOverWeek: <iframe onLoad={this.hideSpinner} title="week" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRg-FEYb25xXlnXG4UZmOhlPOKZ8W7ZOVNOVAz9ewvGZauvVyLZeK47dHivw3CEsUKm59ZSZv7SvUFL/pubchart?oid=827149129&amp;format=interactive"></iframe>,
                monthOverMonth: <iframe onLoad={this.hideSpinner} title="month" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSGO_Qkd8T-B9KLfSvIFQCYcfS2WGuSApmvFfIQg4rx-9rX4C8yPFbyaMGMqA00sylxNma7HKXRYrrB/pubchart?oid=1435602835&amp;format=interactive"></iframe>,
                yearOverYear: <iframe onLoad={this.hideSpinner} title="year" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpi7gRTq4TsmoDawrwgenREel8BOQLgl6GvujgpD5PEN45r1Jzf7btMSvvSwgYtkdtO9tUYUOJ1Nkk/pubchart?oid=1829450743&amp;format=interactive"></iframe>,
                sessionsByDevice: <iframe onLoad={this.hideSpinner} title="device" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ5g-LwM-CLjqmey-w4KcYimtvo5ht-yyCA2jbnhPFkszo9xxQGwuvJGsSoqjPXItw_nhExrjWIgXT/pubchart?oid=1607671519&amp;format=interactive"></iframe>,
                referringSocialSources: <iframe onLoad={this.hideSpinner} title="socialRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RmC4P8QGh5YkT5hEsuLJb_vbFiHyIu-umc9iJ73OPdZmkMpvBeavifuokwawRJ3lIsK6sVCsF1qX/pubchart?oid=1127822182&amp;format=interactive"></iframe>,
                referringDomains: <iframe onLoad={this.hideSpinner} title="domainRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT-ysmZV4Af9tKCCgOETBLQ3kIMan7y_LSm4yVR0AnVZsHlgS1DlUeDj3mqruWK9w85E1b0a0DOXPe7/pubchart?oid=778229088&amp;format=interactive"></iframe>
            },
            mrg: {
                weekOverWeek: <iframe onLoad={this.hideSpinner} title="week" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRg-FEYb25xXlnXG4UZmOhlPOKZ8W7ZOVNOVAz9ewvGZauvVyLZeK47dHivw3CEsUKm59ZSZv7SvUFL/pubchart?oid=1678932906&amp;format=interactive"></iframe>,
                monthOverMonth: <iframe onLoad={this.hideSpinner} title="month" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSGO_Qkd8T-B9KLfSvIFQCYcfS2WGuSApmvFfIQg4rx-9rX4C8yPFbyaMGMqA00sylxNma7HKXRYrrB/pubchart?oid=1979863091&amp;format=interactive"></iframe>,
                yearOverYear: <iframe onLoad={this.hideSpinner} title="year" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpi7gRTq4TsmoDawrwgenREel8BOQLgl6GvujgpD5PEN45r1Jzf7btMSvvSwgYtkdtO9tUYUOJ1Nkk/pubchart?oid=673459867&amp;format=interactive"></iframe>,
                sessionsByDevice: <iframe onLoad={this.hideSpinner} title="device" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ5g-LwM-CLjqmey-w4KcYimtvo5ht-yyCA2jbnhPFkszo9xxQGwuvJGsSoqjPXItw_nhExrjWIgXT/pubchart?oid=826714685&amp;format=interactive"></iframe>,
                referringSocialSources: <iframe onLoad={this.hideSpinner} title="socialRef" width="1000" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RmC4P8QGh5YkT5hEsuLJb_vbFiHyIu-umc9iJ73OPdZmkMpvBeavifuokwawRJ3lIsK6sVCsF1qX/pubchart?oid=253013363&amp;format=interactive"></iframe>,
                referringDomains: <iframe onLoad={this.hideSpinner} title="domainRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT-ysmZV4Af9tKCCgOETBLQ3kIMan7y_LSm4yVR0AnVZsHlgS1DlUeDj3mqruWK9w85E1b0a0DOXPe7/pubchart?oid=1482899271&amp;format=interactive"></iframe>
            },
            golf: {
                weekOverWeek: <iframe onLoad={this.hideSpinner} title="week" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRg-FEYb25xXlnXG4UZmOhlPOKZ8W7ZOVNOVAz9ewvGZauvVyLZeK47dHivw3CEsUKm59ZSZv7SvUFL/pubchart?oid=1253730239&amp;format=interactive"></iframe>,
                monthOverMonth: <iframe onLoad={this.hideSpinner} title="month" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSGO_Qkd8T-B9KLfSvIFQCYcfS2WGuSApmvFfIQg4rx-9rX4C8yPFbyaMGMqA00sylxNma7HKXRYrrB/pubchart?oid=555349986&amp;format=interactive"></iframe>,
                yearOverYear: <iframe onLoad={this.hideSpinner} title="year" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpi7gRTq4TsmoDawrwgenREel8BOQLgl6GvujgpD5PEN45r1Jzf7btMSvvSwgYtkdtO9tUYUOJ1Nkk/pubchart?oid=1476466069&amp;format=interactive"></iframe>,
                sessionsByDevice: <iframe onLoad={this.hideSpinner} title="device" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ5g-LwM-CLjqmey-w4KcYimtvo5ht-yyCA2jbnhPFkszo9xxQGwuvJGsSoqjPXItw_nhExrjWIgXT/pubchart?oid=326989343&amp;format=interactive"></iframe>,
                referringSocialSources: <iframe onLoad={this.hideSpinner} title="socialRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RmC4P8QGh5YkT5hEsuLJb_vbFiHyIu-umc9iJ73OPdZmkMpvBeavifuokwawRJ3lIsK6sVCsF1qX/pubchart?oid=429880466&amp;format=interactive"></iframe>,
                referringDomains: <iframe onLoad={this.hideSpinner} title="domainRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT-ysmZV4Af9tKCCgOETBLQ3kIMan7y_LSm4yVR0AnVZsHlgS1DlUeDj3mqruWK9w85E1b0a0DOXPe7/pubchart?oid=591633124&amp;format=interactive"></iframe>
            },
            village: {
                weekOverWeek: <iframe onLoad={this.hideSpinner} title="week" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRg-FEYb25xXlnXG4UZmOhlPOKZ8W7ZOVNOVAz9ewvGZauvVyLZeK47dHivw3CEsUKm59ZSZv7SvUFL/pubchart?oid=47192571&amp;format=interactive"></iframe>,
                monthOverMonth: <iframe onLoad={this.hideSpinner} title="month" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSGO_Qkd8T-B9KLfSvIFQCYcfS2WGuSApmvFfIQg4rx-9rX4C8yPFbyaMGMqA00sylxNma7HKXRYrrB/pubchart?oid=1842765986&amp;format=interactive"></iframe>,
                yearOverYear: <iframe onLoad={this.hideSpinner} title="year" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpi7gRTq4TsmoDawrwgenREel8BOQLgl6GvujgpD5PEN45r1Jzf7btMSvvSwgYtkdtO9tUYUOJ1Nkk/pubchart?oid=1453343460&amp;format=interactive"></iframe>,
                sessionsByDevice: <iframe onLoad={this.hideSpinner} title="device" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ5g-LwM-CLjqmey-w4KcYimtvo5ht-yyCA2jbnhPFkszo9xxQGwuvJGsSoqjPXItw_nhExrjWIgXT/pubchart?oid=220819152&amp;format=interactive"></iframe>,
                referringSocialSources: <iframe onLoad={this.hideSpinner} title="socialRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RmC4P8QGh5YkT5hEsuLJb_vbFiHyIu-umc9iJ73OPdZmkMpvBeavifuokwawRJ3lIsK6sVCsF1qX/pubchart?oid=965362508&amp;format=interactive"></iframe>,
                referringDomains: <iframe onLoad={this.hideSpinner} title="domainRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT-ysmZV4Af9tKCCgOETBLQ3kIMan7y_LSm4yVR0AnVZsHlgS1DlUeDj3mqruWK9w85E1b0a0DOXPe7/pubchart?oid=804015356&amp;format=interactive"></iframe>
            },
            airboat: {
                weekOverWeek: <iframe onLoad={this.hideSpinner} title="week" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRg-FEYb25xXlnXG4UZmOhlPOKZ8W7ZOVNOVAz9ewvGZauvVyLZeK47dHivw3CEsUKm59ZSZv7SvUFL/pubchart?oid=1606435403&amp;format=interactive"></iframe>,
                monthOverMonth: <iframe onLoad={this.hideSpinner} title="month" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSGO_Qkd8T-B9KLfSvIFQCYcfS2WGuSApmvFfIQg4rx-9rX4C8yPFbyaMGMqA00sylxNma7HKXRYrrB/pubchart?oid=910831221&amp;format=interactive"></iframe>,
                yearOverYear: <iframe onLoad={this.hideSpinner} title="year" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTpi7gRTq4TsmoDawrwgenREel8BOQLgl6GvujgpD5PEN45r1Jzf7btMSvvSwgYtkdtO9tUYUOJ1Nkk/pubchart?oid=1870400584&amp;format=interactive"></iframe>,
                sessionsByDevice: <iframe onLoad={this.hideSpinner} title="device" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ5g-LwM-CLjqmey-w4KcYimtvo5ht-yyCA2jbnhPFkszo9xxQGwuvJGsSoqjPXItw_nhExrjWIgXT/pubchart?oid=1543821758&amp;format=interactive"></iframe>,
                referringSocialSources: <iframe onLoad={this.hideSpinner} title="socialRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR5RmC4P8QGh5YkT5hEsuLJb_vbFiHyIu-umc9iJ73OPdZmkMpvBeavifuokwawRJ3lIsK6sVCsF1qX/pubchart?oid=1008800472&amp;format=interactive"></iframe>,
                referringDomains: <iframe onLoad={this.hideSpinner} title="domainRef" width="600" height="371" seamless frameBorder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT-ysmZV4Af9tKCCgOETBLQ3kIMan7y_LSm4yVR0AnVZsHlgS1DlUeDj3mqruWK9w85E1b0a0DOXPe7/pubchart?oid=182699058&amp;format=interactive"></iframe>
            }
        };
    }



    renderReport = () => {
        if(this.state.selectedProperty !== '' & this.state.selectedReport !== '') {
            const selectedIframe = this.reports()[this.state.selectedProperty][this.state.selectedReport]
            return (
                <div style={{marginTop: '20px'}}>
                    {selectedIframe}
                </div>
            )
        }
        else {
            return '';
        }
    }
    

    render() {
        const iframeStyle = this.state.isIframeLoading ? {visibility: 'hidden'} : {visibility: 'visible'};
        const selectedIframe = this.reports()[this.state.selectedProperty][this.state.selectedReport]

        return (
            <React.Fragment>
                <Button onClick={()=>this.props.history.push('/')} labelPosition='left' icon='left chevron' content='Back' />
                <Segment style={{padding: '20px 14px 40px 14px'}} raised>
                    <Header as='h2'>Website Analytics</Header>
                    <Form>
                        <Form.Group>
                            <Form.Select 
                                onChange={(e, {value}) => this.onPropertyChange(e, value)}
                                value={this.state.selectedProperty}
                                placeholder='Select Property' options={this.gaProperties()}
                            /> 
                            <Form.Select 
                                onChange={(e, {value}) => this.onReportChange(e, value)}
                                value={this.state.selectedReport}
                                placeholder='Select Report' options={this.gaReport()}
                            />
                        </Form.Group>
                    </Form>
                    <div>
                        <Loader active={this.state.isIframeLoading} />
                        <div style={iframeStyle}>
                            {selectedIframe}
                        </div>
                    </div>
                </Segment>
            </React.Fragment>
        )    
    }
}


export default GaViewReport;