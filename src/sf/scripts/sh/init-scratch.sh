default_days=3

scratch_alias=$1
dev_hub_alias=$2
days=${3:-$default_days}

if [[ -z "$scratch_alias" ]]
then
	echo "Specify scratch alias as the first parameter"
	exit 1
fi

if [[ -z "$dev_hub_alias" ]]
then
	echo "Specify dev hub alias as the second parameter"
	exit 1
fi

echo
echo "Authorizing the dev hub..."
echo "Please login to your DevHub org"
sfdx force:auth:web:login -a "$dev_hub_alias"

echo
echo "Creating scratch..."
sfdx force:org:create -f ./config/scratch-def.json -a "$scratch_alias" -v "$dev_hub_alias" -d "$days"

echo
echo "Installing packages..."
sfdx force:package:install --wait 10 --publishwait 10 --package 04t1C000000tfGqQAI --noprompt -u "$scratch_alias"

echo
echo "Deploying to $scratch_alias..."
sfdx config:set restDeploy=false
sfdx force:source:deploy -p ./src/main/trigger-framework/labels -u "$scratch_alias"
sfdx force:source:deploy -p ./src/main/default/labels -u "$scratch_alias"
sfdx force:source:push -u "$scratch_alias"

echo
echo "Creating test users..."
sfdx force:user:create -f ./config/support-agent-user-def.json username="$scratch_alias".bob.marley@cash.scheduler.scratch -u "$scratch_alias" -v "$dev_hub_alias"

echo
echo "Assigning permissions..."
sfdx force:user:permset:assign -n CashSchedulerAdmin -u "$scratch_alias"
sfdx force:user:permset:assign -n TriggerFrameworkUser -u "$scratch_alias"
sfdx force:user:permset:assign -n RestClientUser -u "$scratch_alias"

echo
echo "Generating password..."
sfdx force:user:password:generate -v "$dev_hub_alias" -u "$scratch_alias"

echo
echo "Loading data..."
sfdx force:apex:execute -f ./scripts/apex/assign-queue-members.apex -u "$scratch_alias"
sfdx force:data:tree:import -p ./data/Account-plan.json -u "$scratch_alias"

echo
sfdx force:org:open -u "$scratch_alias"
