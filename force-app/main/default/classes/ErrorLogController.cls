public with sharing class ErrorLogController {
    
    // Fetches only High priority, active errors for the dashboard
    @AuraEnabled(cacheable=true)
    public static List<Error_Log__c> getActiveHighSeverityLogs() {
        return [
            SELECT Id, Name, Message__c, Severity__c, Status__c, CreatedDate 
            FROM Error_Log__c 
            WHERE Severity__c = 'High' AND Status__c = 'Active'
            WITH SECURITY_ENFORCED
            ORDER BY CreatedDate DESC
        ];
    }

    // Allows the admin to resolve the log directly from the UI
    @AuraEnabled
    public static void resolveLog(Id logId) {
        Error_Log__c logToUpdate = new Error_Log__c(
            Id = logId, 
            Status__c = 'Resolved'
        );
        update as user logToUpdate;
    }
}