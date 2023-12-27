// DeleteDialogComponent.jsx
import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface DeleteDialogProps {
    isVisible: boolean;
    onDelete: () => void;  
    onClose: () => void;
}

const DeleteDialogComponent: React.FC<DeleteDialogProps> = ({ isVisible, onDelete, onClose }) => {
    return (
        <Dialog visible={isVisible} onHide={onClose} header="Confirm Delete" modal>
            <div>
                <p>Do you really want to delete the selected tenant?</p>
            </div>
            <div className="p-dialog-footer">
                <Button label="No" icon="pi pi-times" onClick={onClose} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" />
            </div>
        </Dialog>
    );
};

export default DeleteDialogComponent;
