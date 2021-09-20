/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

public with sharing class CreateNotificationVariables {
    public Notification notification { get; set; }

    public CreateNotificationVariables(Notification notification) {
        this.notification = notification;
    }
}
