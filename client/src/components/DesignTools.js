//NOT USING THIS AT THE MOMENT
//Lists tools available to design team.

import React from 'react';
import Upload from './Upload';
import Delete from './Delete';
import {Container, Header, List} from 'semantic-ui-react';

const DesignTools = () => {
    return (
        <Container>
            <div style={{paddingBottom: '40px'}}>
                <Header as='h4'>Instructions</Header>
                <List bulleted>
                    <List.Item>To categorize as spanish please prefix file name with "sp_".<br/>Example: "sp_village.mov"</List.Item>
                    <List.Item>To categorize as logo, please use the word "logo" somewhere in the filename, case insensitive.</List.Item>
                    <List.Item>To categorize web banner, file must be zip.</List.Item>
                </List>
            </div>
            <div>
                <Upload />
            </div>
            <div style={{marginTop: '50px', marginBottom: '14px'}}>
                <Delete />
            </div>
        </Container>
    )
}

export default DesignTools;