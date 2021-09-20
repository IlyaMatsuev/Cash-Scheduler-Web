/**
 * Created by Ilya Matsuev on 3/17/2021.
 */

trigger ContactTrigger on Contact (before insert) {
    Map<TriggerBindOption, Object> options = new Map<TriggerBindOption, Object>();
    TriggerDispatcher.dispatcher
            .bind(TriggerOperation.BEFORE_INSERT, new ContactAssignAccountTriggerHandler(), options)
            .run();
}
