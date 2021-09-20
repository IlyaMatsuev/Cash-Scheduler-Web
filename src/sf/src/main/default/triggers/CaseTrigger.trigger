/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

trigger CaseTrigger on Case (before insert) {
    TriggerDispatcher.dispatcher
            .bind(TriggerOperation.BEFORE_INSERT, new AssignToContactTriggerHandler())
            .run();
}
