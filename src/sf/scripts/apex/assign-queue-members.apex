Group supportAgentsQueue = [
        SELECT Id
        FROM Group
        WHERE Name = 'Support Agents'
        AND Type = 'Queue'
];
List<User> users = [
        SELECT Name
        FROM User
        WHERE Profile.Name = 'Support Agent'
];
List<GroupMember> supportAgentsQueueMembers = new List<GroupMember>();
for (User user : users) {
    System.debug('Adding user ' + user.Name + ' to the queue');
    supportAgentsQueueMembers.add(new GroupMember(
            UserOrGroupId = user.Id,
            GroupId = supportAgentsQueue.Id
    ));
}

if (!supportAgentsQueueMembers.isEmpty()) {
    Database.insert(supportAgentsQueueMembers, false);
}
