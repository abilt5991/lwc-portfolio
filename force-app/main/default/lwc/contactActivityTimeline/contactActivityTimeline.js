import { LightningElement, api, wire } from 'lwc';
import getContactTasks from '@salesforce/apex/ContactActivityController.getContactTasks';

export default class ContactActivityTimeline extends LightningElement {
    @api recordId;
    tasks;
    error;
    isLoading = true;

    @wire(getContactTasks, { contactId: '$recordId' })
    wiredTasks({ data, error }) {
        this.isLoading = false;
        if (data) {
            this.tasks = data.length > 0 ? data : undefined;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.tasks = undefined;
        }
    }

    get isEmpty() {
        return !this.tasks && !this.error && !this.isLoading;
    }

    get priorityClass() {
        return this.priority === 'High' 
            ? 'slds-badge slds-theme_error' 
            : this.priority === 'Normal'
            ? 'slds-badge slds-theme_warning'
            : 'slds-badge slds-theme_success';
    }
}