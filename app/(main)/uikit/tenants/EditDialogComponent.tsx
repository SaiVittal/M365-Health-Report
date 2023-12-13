// EditDialogComponent.jsx

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import type { Demo } from '../../../../types/types';

interface EditDialogComponentProps {
    rowData: Demo.Customer | null;
    onClose: () => void;
    onSave: (data: Demo.Customer) => void;
}

const EditDialogComponent: React.FC<EditDialogComponentProps> = ({ rowData, onClose, onSave }) => {
    const [editedData, setEditedData] = React.useState<Demo.Customer>({
        tenantId: rowData.tenantId || 0,
        tenantName: rowData.tenantName || '',
        dateOnboarded: rowData.dateOnboarded || null,
        partnerRelationships: rowData.partnerRelationships || [],
        primaryDomain: rowData.primaryDomain || '',

        // Merge with rowData if it exists
        ...(rowData || {}),
    });

    const handleSave = () => {
        // You can perform validation before saving
        onSave(editedData);
    };

    return (
        <Dialog header="Edit Tenant" visible modal style={{ width: '30vw' }} onHide={onClose}>
            {/* Your form fields */}
            <div className="p-field">
                <label htmlFor="tenantName">Tenant Name</label>
                <InputText id="tenantName" value={editedData.tenantName} onChange={(e) => setEditedData({ ...editedData, tenantName: e.target.value })} />
            </div>
            <div className="p-field">
                <label htmlFor="dateOnboarded">Date Onboarded</label>
                <Calendar
                    id="dateOnboarded"
                    value={editedData.dateOnboarded}
                    onChange={(e) => setEditedData({ ...editedData, dateOnboarded: e.value })}
                    dateFormat="mm/dd/yy"
                    placeholder="mm/dd/yyyy"
                    mask="99/99/9999"
                />
            </div>

            <div className="p-dialog-footer">
                <Button label="Cancel" icon="pi pi-times" onClick={onClose} />
                <Button label="Save" icon="pi pi-check" onClick={handleSave} />
            </div>
        </Dialog>
    );
};

export default EditDialogComponent;
