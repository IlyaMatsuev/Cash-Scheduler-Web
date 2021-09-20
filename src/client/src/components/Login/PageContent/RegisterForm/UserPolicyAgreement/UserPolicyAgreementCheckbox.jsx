import React from 'react';
import {Checkbox, Segment} from 'semantic-ui-react';


const UserPolicyAgreementCheckbox = ({agree, onChange}) => {
    return (
        <Segment compact>
            <Checkbox name="agreement" fitted
                      label="I agree that my data can be used for gathering statistics for social analyzes"
                      checked={agree} onChange={onChange}
            />
        </Segment>
    );
};

export default UserPolicyAgreementCheckbox;
