// EditDialogComponent.jsx

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import type { Demo } from '../../../../types/types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrls } from '../../constants/constants';


const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Tenant {
    tenantId: string;
    tenantName: string;
    partnerRelationships: string[];
    primaryDomain: string;
    dateOnboarded: number;
    isEnabled:boolean;
}

interface EditDialogComponentProps {
    rowData: Tenant | null;
    onClose: () => void;
    onSave: (data: Tenant) => void;
}

const EditDialogComponent: React.FC<EditDialogComponentProps> = ({ rowData, onClose, onSave }) => {
    const [editedData, setEditedData] = useState<Tenant>({
        tenantId: '',
        tenantName: '',
        dateOnboarded: 0,
        partnerRelationships: [],
        primaryDomain: '',
        isEnabled:true
    });

    const [tenants, setTenants] = useState<Demo.Customer[]>([]);




    const fetchTenants = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}${apiUrls.tenants}`);
            console.log('Request URL:', `${apiBaseUrl}${apiUrls.tenants}`);
            console.log('Response:', response.data);

            if (response.status === 200) {
                setTenants(response.data);
            } else {
                console.error('Error fetching data:', response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    console.log(tenants, "TenantsData")


    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}${apiUrls.tenants}`);
                console.log('Request URL:', `${apiBaseUrl}${apiUrls.tenants}`);
                console.log('Response:', response.data);

                if (response.status === 200) {
                    setTenants(response.data);
                } else {
                    console.error('Error fetching data:', response);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        // Call the async function
        fetchTenants();
    }, []);

    useEffect(() => {
        // Fetch data only when rowData is available (i.e., when editing an existing tenant)
        if (rowData) {
            // Define an async function to fetch tenant details
            const fetchTenantDetails = async () => {
                try {
                    const response = await axios.get(`${apiBaseUrl}${apiUrls.tenants}/${rowData.tenantId}`);
                    
                    // Check if the fetch was successful
                    if (response.status === 200) {
                        // Update the state with the fetched data
                        setEditedData(response.data);
                    } else {
                        // Handle the error, e.g., show an error message
                        console.error('Failed to fetch tenant details:', response.data);
                    }
                } catch (error) {
                    // Handle the error, e.g., show an error message
                    console.error('Error fetching tenant details:', error);
                }
            };

            // Call the fetch function
            fetchTenantDetails();
        }
    }, [rowData, tenants]);


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

    console.log("TenantId", editedData.tenantId);
    console.log("EditedTenantData", editedData)

    const handleSave = async () => {
        // Implement your save logic here
        const { tenantId, tenantName, isEnabled, primaryDomain } = editedData;
        const dataToSave = { tenantId, tenantName, isEnabled, primaryDomain };
        console.log("DataToSave", dataToSave);
        try {
            const response = await axios.post(`${apiBaseUrl}${apiUrls.tenants}`, dataToSave);
            if (response.status === 200) {
                console.log("Tenant details got edited")
                setTenants((prevTenants) => [...prevTenants, response.data]);
                onClose();
                fetchTenants();
            } else {
                console.error('Failed to update tenant details:', response.data);
            }
        } catch (error) {
            console.error('Error updating tenant details:', error);
        }
    };
    

    return (
        <Dialog header="Edit Tenant" visible modal style={{ width: '30vw' }} onHide={onClose}>
    <div className="p-fluid">
        <div className="p-field"  style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="tenantId">Tenant ID</label>
                <InputText id="tenantId" value={editedData.tenantId} onChange={(e) => setEditedData({ ...editedData, tenantId: e.target.value })} />
            </div>
            <div className="p-field"  style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="tenantName">Tenant Name</label>
                <InputText id="tenantName" value={editedData.tenantName} onChange={(e) => setEditedData({ ...editedData, tenantName: e.target.value })} />
            </div>
            <div className="p-field"  style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="primaryDomain">Primary Domain</label>
                <InputText id="primaryDomain" value={editedData.primaryDomain} onChange={(e) => setEditedData({ ...editedData, primaryDomain: e.target.value })} />
            </div>
             {/* <div className="p-field"  style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="partnerRelationships">Partner Relationships</label>
                <InputText
                    id="partnerRelationships"
                    value={editedData.partnerRelationships.join(', ')} // Convert array to comma-separated string
                    onChange={(e) => setEditedData({ ...editedData, partnerRelationships: e.target.value.split(', ') })} // Convert string to array
                />
            </div>
            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="clientId">Client ID</label>
                <InputText id="clientId" value={editedData.clientId} onChange={(e) => setEditedData({ ...editedData, clientId: e.target.value })}  />
            </div>
            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                <label htmlFor="clientSecret">Client Secret</label>
                <InputText id="clientSecret" value={editedData.clientSecret} onChange={(e) => setEditedData({ ...editedData, clientSecret: e.target.value })} />
            </div> */}
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
