# Cash Scheduler Web Sf

This is the Salesforce part of the Cash Scheduler Web application.
Its aim is to handle some clients' information, build reports and dashboards, notify clients via emails and execute some jobs.

## Installation

### Scratch Org Installation

1. Clone the project

```bash
git clone https://github.com/IlyaMatsuev/cash-scheduler-web-sf.git
```

2. Go to the root project directory

```bash
cd ./cash-scheduler-web-sf
```

3. Run init script with such parameters as scratch alias, dev hub alias and amount of days the scratch will expire (optional).

```bash
./scripts/sh/init-scratch.sh {SCRATCH_ALIAS} {DEV_HUB_ALIAS} {EXPIRED_IN_DAYS}
```

4. Follow the instructions in the script

5. For the profile "Support Agent" and permission set "Cash Scheduler Admin" give access for the presence statuses to be able switch statuses in the service cloud omni-channel

6. Set default routing configuration for the Support Service queue

7. Fill the org defaults for Cash Scheduler Server Settings (Custom Settings)

### Dev Org Installation

Before installing the repo on the dev org, please activate omni-channel in setup first.

All other steps are the same as for scratch org installation but instead of calling:

```bash
./scripts/sh/init-scratch.sh
```

You should use:

```bash
./scripts/sh/init-dev.sh {ORG_ALIAS}
```

All other steps are identical
