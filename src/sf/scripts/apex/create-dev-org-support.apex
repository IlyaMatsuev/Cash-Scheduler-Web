Profile supportAgentProfile = [
        SELECT Id
        FROM Profile
        WHERE Name = 'Support Agent'
        LIMIT 1
];

User user = new User(
        FirstName = 'Bob',
        LastName = 'Marley',
        Alias = 'BMarley',
        Email = 'mirotvorec542546@gmail.com',
        Username = 'cash-scheduler-dev.bob.marley@cash.scheduler.dev',
        TimeZoneSidKey = 'America/Los_Angeles',
        LocaleSidKey = 'en_US',
        LanguageLocaleKey = 'en_US',
        EmailEncodingKey = 'UTF-8',
        ProfileId = supportAgentProfile.Id,
        UserPermissionsSupportUser = true
);

insert user;
