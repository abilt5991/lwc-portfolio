import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getOpenLeads from '@salesforce/apex/LeadConverterController.getOpenLeads';
import convertLeads from '@salesforce/apex/LeadConverterController.convertLeads';
const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Company', fieldName: 'Company', type: 'text' },
    { label: 'Status', fieldName: 'Status', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Lead Source', fieldName: 'LeadSource', type: 'text' }
];

export default class LeadConverter extends LightningElement {
    columns = COLUMNS;
    selectedLeadIds = [];
    isLoading = false;
    error;
    wiredLeadsResult;

    @wire(getOpenLeads)
    wiredLeads(result) {
        this.wiredLeadsResult = result;
        if (result.data) {
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    get leads(){
        return this.wiredLeadsResult?.data || [];
    }

    get isEmpty() {
        return !this.isLoading && this.wiredLeadsResult?.data?.length === 0;
    }

    //if no leads are selected, disable the convert button
    get isConvertDisabled() {
        return this.selectedLeadIds.length === 0;
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedLeadIds = selectedRows.map(row => row.Id);
    }


    async handleConvert() {
        if (this.selectedLeadIds.length === 0) return;
        this.isLoading = true;
        try {
            await convertLeads({ leadIds: this.selectedLeadIds });
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: `${this.selectedLeadIds.length} Lead(s) converted successfully!`,
                variant: 'success'
            }));
            this.selectedLeadIds = [];
            await refreshApex(this.wiredLeadsResult);
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error?.body?.message || 'Something went wrong',
                variant: 'error'
            }));
        } finally {
            this.isLoading = false;
        }
    }

    get errorMessage() {
        return this.error?.body?.message || 'Something went wrong loading Leads.';
    } 
}