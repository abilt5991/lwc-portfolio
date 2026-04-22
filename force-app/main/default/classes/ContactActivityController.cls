public with sharing class ContactActivityController {
    @AuraEnabled(cacheable=true)
    public static List<Task> getContactTasks(Id contactId) {
        return [SELECT Id, Subject, Status, Priority, ActivityDate FROM Task WHERE WhoId = :contactId AND Who.Type='Contact' ORDER BY ActivityDate ASC NULLS LAST];
        // You can return the tasks or process them as needed
    }
}