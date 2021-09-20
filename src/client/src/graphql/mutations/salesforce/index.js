import {gql} from '@apollo/client';

export default {
    REPORT_BUG: gql`
        mutation($bugReport: NewBugReportInput!) {
            reportBug(bugReport: $bugReport) {
                name
            }
        }
    `
}
