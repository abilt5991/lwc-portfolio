public with sharing class LeadConverterController {

    @AuraEnabled(cacheable=true)
    public static List<Lead> getOpenLeads() {
        return [SELECT Id, Name, Company, Status, Email, Phone, LeadSource
                FROM Lead 
                WHERE IsConverted = false
                ORDER BY CreatedDate DESC];
    }
    @AuraEnabled
    public static void convertLeads(List<Id> leadIds) {
        List<Database.LeadConvert> conversions = new List<Database.LeadConvert>();
        // Lead Status label can be different in each org, so we query for the API name of the status
        String qualifiedStatusName = [SELECT MasterLabel FROM LeadStatus WHERE IsConverted = true LIMIT 1].MasterLabel;

        for(Id leadId : leadIds) {
            Database.LeadConvert lc = new Database.LeadConvert();
            lc.setLeadId(leadId);
            lc.setConvertedStatus(qualifiedStatusName);
            lc.setDoNotCreateOpportunity(false);
            conversions.add(lc);
        }

        if(conversions.size() > 0) {
            Database.convertLead(conversions, false);
        }
        
    }

}