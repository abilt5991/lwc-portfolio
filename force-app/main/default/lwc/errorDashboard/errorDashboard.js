import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getActiveHighSeverityLogs from '@salesforce/apex/ErrorLogController.getActiveHighSeverityLogs';
import resolveLog from '@salesforce/apex/ErrorLogController.resolveLog';

const COLUMNS = [
    { label: 'Log Number', fieldName: 'Name', type: 'text', initialWidth: 150 },
    
    // wrapText: true makes long error messages highly readable
    { label: 'Error Message', fieldName: 'Message__c', type: 'text', wrapText: true }, 
    
    // Added a warning icon directly next to the "High" text
    { label: 'Severity', fieldName: 'Severity__c', type: 'text', initialWidth: 120,
        cellAttributes: { 
            class: 'slds-text-color_error slds-text-title_bold',
            iconName: 'utility:warning',
            iconPosition: 'left'
        } 
    },
    
    // Upgraded the button to standard Salesforce Brand Blue with a checkmark
    { type: 'button', initialWidth: 130, 
        typeAttributes: { 
            label: 'Resolve', 
            name: 'resolve', 
            variant: 'brand', 
            iconName: 'utility:check' 
        } 
    }
];

export default class ErrorDashboard extends LightningElement {
    columns = COLUMNS;
    wiredLogsResult;

    @wire(getActiveHighSeverityLogs)
    wiredLogs(result) {
        this.wiredLogsResult = result;
    }

    get logs() {
        return this.wiredLogsResult?.data || [];
    }

    // Cleaner getter for our HTML template logic
    get hasLogs() {
        return this.logs.length > 0;
    }

    // New manual refresh method
    async handleRefresh() {
        await refreshApex(this.wiredLogsResult);
        this.dispatchEvent(new ShowToastEvent({
            title: 'Refreshed', 
            message: 'Error feed is up to date.', 
            variant: 'info'
        }));
    }

    async handleRowAction(event) {
        const rowId = event.detail.row.Id;
        try {
            await resolveLog({ logId: rowId });
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success', 
                message: 'Error log marked as Resolved', 
                variant: 'success'
            }));
            await refreshApex(this.wiredLogsResult);
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error', 
                message: error.body?.message || 'An unknown error occurred', 
                variant: 'error'
            }));
        }
    }
}