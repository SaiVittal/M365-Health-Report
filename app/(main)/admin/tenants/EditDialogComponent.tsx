// EditDialogComponent.jsx

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import type { Demo } from '../../../../types/types';
import { useState, useEffect } from 'react';

interface Tenant {
    tenantId: string;
    tenantName: string;
    partnerRelationships: string[];
    primaryDomain: string;
    dateOnboarded: number;
}

interface EditDialogComponentProps {
    rowData: Tenant | null;
    onClose: () => void;
    onSave: (data: Tenant) => void;
}

const EditDialogComponent: React.FC<EditDialogComponentProps> = ({ rowData, onClose, onSave }) => {
    const [editedData, setEditedData] = useState<Tenant>({
        tenantId: rowData?.tenantId || '',
        tenantName: rowData?.tenantName || '',
        dateOnboarded: rowData?.dateOnboarded || 0,
        partnerRelationships: rowData?.partnerRelationships || [],
        primaryDomain: rowData?.primaryDomain || ''
    });


    useEffect(() => {
        // Handle the case where rowData changes
        setEditedData((prevData) => ({
            ...prevData,
            tenantId: rowData?.tenantId || '',
            tenantName: rowData?.tenantName || '',
            dateOnboarded: rowData?.dateOnboarded || 0,
            partnerRelationships: rowData?.partnerRelationships || [],
            primaryDomain: rowData?.primaryDomain || '',
            // Add any other properties from Tenant interface

            // Handle undefined or null values explicitly
            ...(rowData || {})
        }));
    }, [rowData]);

    const handleSave = () => {
        // You can perform validation before saving
        onSave(editedData);
    };

    return (
        <Dialog header="Edit Tenant" visible modal style={{ width: '30vw' }} onHide={onClose}>

<div className="p-fluid">
            <div className="p-field"  style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="tenantName">Tenant Name</label>
                <InputText id="tenantName" value={editedData.tenantName} onChange={(e) => setEditedData({ ...editedData, tenantName: e.target.value })} />
            </div>
            <div className="p-field"  style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="primaryDomain">Primary Domain</label>
                <InputText id="primaryDomain" value={editedData.primaryDomain} onChange={(e) => setEditedData({ ...editedData, primaryDomain: e.target.value })} />
            </div>
            <div className="p-field"  style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="partnerRelationships">Partner Relationships</label>
                <InputText
                    id="partnerRelationships"
                    value={editedData.partnerRelationships.join(', ')} // Convert array to comma-separated string
                    onChange={(e) => setEditedData({ ...editedData, partnerRelationships: e.target.value.split(', ') })} // Convert string to array
                />
            </div>
            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="clientId">Client ID</label>
                <InputText id="clientId" /*value={editedData.clientId} onChange={(e) => setEditedData({ ...editedData, clientId: e.target.value })} */ />
            </div>
            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="clientSecret">Client Secret</label>
                <InputText id="clientSecret" /*value={editedData.clientSecret} onChange={(e) => setEditedData({ ...editedData, clientSecret: e.target.value })}*/ />
            </div>
            {/* <div className="p-field">
                <label htmlFor="dateOnboarded">Date Onboarded</label>
                <Calendar
                    id="dateOnboarded"
                    value={editedData.dateOnboarded}
                    onChange={(e) => setEditedData({ ...editedData, dateOnboarded: e.value })}
                    dateFormat="mm/dd/yy"
                    placeholder="mm/dd/yyyy"
                    mask="99/99/9999"
                />
            </div> */}
            </div>
            <div className="p-dialog-footer">
                <Button label="Cancel" icon="pi pi-times" onClick={onClose} />
                <Button label="Save" icon="pi pi-check" onClick={handleSave} />
            </div>
        </Dialog>
    );
};

export default EditDialogComponent;
