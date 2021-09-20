import React, {useState} from 'react';
import BugReportModal from './BugReportModal/BugReportModal';
import {pages} from '../../../config';
import styles from './Header.module.css';


function Header() {
    const initState = {
        bugReportModalOpen: false
    };
    const [state, setState] = useState(initState);

    const onBugReport = event => {
        if (event) {
            event.preventDefault();
        }
        setState({...state, bugReportModalOpen: !state.bugReportModalOpen});
    };

    return (
        <header>
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
                <a className="navbar-brand" href={pages.loginUrl}>
                    <strong>Cash Scheduler</strong>
                </a>
                <a className={'navbar-brand ' + styles.link} href={pages.repositoryUrl}>
                    Project Repository
                </a>
                <a className={'navbar-brand ' + styles.link} href="#" onClick={onBugReport}>
                    Ask Question / Bug Report
                </a>
            </nav>
            <BugReportModal open={state.bugReportModalOpen} onToggle={onBugReport}/>
        </header>
    );
}

export default Header;
