org_alias=$1

if [[ -z "$org_alias" ]]
then
	echo "Specify the org alias as the first parameter."
	exit 1
fi

echo
echo "Authorizing the org..."
echo "Please login to org."
sfdx force:auth:web:login -a "$org_alias"

echo
echo "Installing packages..."
sfdx force:package:install --wait 10 --publishwait 10 --package 04t1C000000tfGqQAI --noprompt -u "$org_alias"

echo
echo "Deploying to $org_alias..."
sfdx force:source:deploy -p ./src/main/trigger-framework/labels -u "$org_alias"
sfdx force:source:deploy -p ./src/main/default/labels -u "$org_alias"
# Before running the command below we need to enable omni channel in the dev org
sfdx force:source:deploy -p ./src -u "$org_alias"

echo
echo "Creating test users..."
sfdx force:apex:execute -f ./scripts/apex/create-dev-org-support.apex -u "$org_alias"

echo
echo "Assigning permissions..."
sfdx force:user:permset:assign -n CashSchedulerAdmin -u "$org_alias"
sfdx force:user:permset:assign -n TriggerFrameworkUser -u "$org_alias"
sfdx force:user:permset:assign -n RestClientUser -u "$org_alias"

echo
echo "Loading data..."
sfdx force:apex:execute -u "$org_alias" -f ./scripts/apex/remove-base-accounts.apex
sfdx force:apex:execute -u "$org_alias" -f ./scripts/apex/assign-queue-members.apex
sfdx force:data:tree:import -p ./data/Account-plan.json -u "$org_alias"

echo
echo "Deployment completed"
