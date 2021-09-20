/**
 * Created by Ilya Matsuev on 4/2/2021.
 */

trigger EmailMessageTrigger on EmailMessage (after insert) {
    TriggerDispatcher.dispatcher
            .bindAsync(
                TriggerOperation.AFTER_INSERT,
                AsyncHandlerType.FUTURE,
                new NotifyCashSchedulerTriggerHandler()
            )
            .run();
}
