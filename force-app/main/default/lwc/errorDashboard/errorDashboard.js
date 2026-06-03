import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getActiveHighSeverityLogs from '@salesforce/apex/ErrorLogController.getActiveHighSeverityLogs';

export default class ErrorDashboard extends NavigationMixin(LightningElement) {
    activeCount = 0;
    progressCount = 0;
    totalCount = 0;
    chartDashArray = '0, 100';

    @wire(getActiveHighSeverityLogs)
    wiredLogs({ error, data }) {
        if (data) {
            this.activeCount = data.filter(log => log.Status__c === 'Active').length;
            this.progressCount = data.filter(log => log.Status__c === 'In Progress').length;
            this.totalCount = data.length;

            // Calculate SVG stroke-dasharray (percentage of the circle)
            if (this.totalCount > 0) {
                const percentage = (this.activeCount / this.totalCount) * 100;
                this.chartDashArray = `${percentage}, 100`;
            }
        } else if (error) {
            console.error(error);
        }
    }

    navigateToLogs() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Error_Log__c' 
            }
        });
    }
}