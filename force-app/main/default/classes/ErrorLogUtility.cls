public without sharing class ErrorLogUtility {
    
    // Method 1: For logging simple text messages (like API timeouts)
    public static void logMessage(String message, String severity) {
        createLogRecord(message, severity);
    }

    // Method 2: For logging actual Salesforce Exceptions (Apex crashes)
    public static void logException(Exception e, String severity) {
        String fullMessage = 'Exception Type: ' + e.getTypeName() + 
                             '\nMessage: ' + e.getMessage() + 
                             '\nStack Trace: ' + e.getStackTraceString();
        
        createLogRecord(fullMessage, severity);
    }

    // The private helper method that actually talks to the database
    private static void createLogRecord(String errorMessage, String severity) {
        Error_Log__c newLog = new Error_Log__c(
            Message__c = errorMessage,
            Severity__c = severity,
            Status__c = 'Active'
        );
        
        // 'false' means if the log fails to save, it won't crash the user's screen
        Database.insert(newLog, false); 
    }
}