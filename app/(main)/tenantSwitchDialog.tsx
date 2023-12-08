import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Demo } from '../../types/demo';
import { apiUrls } from './constants/constants';
import { useEffect } from 'react';

interface TenantSwitchDialogProps {
    visible: boolean;
    onHide: () => void;
    onSelectTenant: (tenantName: string | null) => void; 
    onSelectIDTenant: (tenantId: string | null) => void; 
}

interface Tenant {
    tenantId: string,
    tenantName: string;
}



const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


const TenantSwitchDialog: React.FC<TenantSwitchDialogProps> = ({ visible, onHide, onSelectTenant, onSelectIDTenant }) => {
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [selectedTenantId, setSelectedTenantId] = useState<Tenant | null>(null);
    const [tenants, setTenants] = useState<Tenant[]>([]);

    const dialogFooter = (
        <div>
            <Button onClick={onHide}>Cancel</Button>
            <Button onClick={() => handleSwitchTenants()}>Switch</Button>
        </div>
    );

    const handleSwitchTenants = () => {
        console.log('Selected Tenant:', selectedTenant);
        onSelectTenant(selectedTenant?.tenantName || null);
        onSelectIDTenant(selectedTenant?.tenantId || null);
        onHide();
    };



    useEffect(() => {
        const fetchTenants = async () => {
          try {
            const response = await axios.get(`${apiBaseUrl}${apiUrls.tenants}`);
            console.log('Request URL:', `${apiBaseUrl}${apiUrls.tenants}`);
            console.log('TenantNames:', response.data);
    
            if (response.status === 200) {
                const tenantData = response.data.map((tenant: any) => ({
                    tenantId: tenant.tenantId,
                    tenantName: tenant.tenantName,
                }));
                setTenants(tenantData);
            } else {
              console.error('Error fetching data:', response);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchTenants();
      }, []);

      console.log(tenants, "Dataa")

    return (
        <Dialog header="Switch Tenants" visible={visible} style={{ width: '50vw' }} onHide={onHide} footer={dialogFooter}>
        <DataTable value={tenants} selectionMode="single" onSelectionChange={(e) => setSelectedTenant(e.value)}>
            <Column selectionMode="single" style={{ width: '3em' }}></Column>
            <Column field="tenantName" header="Tenant Name"></Column>
        </DataTable>
    </Dialog>
    );
};

export default TenantSwitchDialog;
