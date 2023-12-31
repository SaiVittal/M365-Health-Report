'use client';
import { CustomerService } from '../../../../demo/service/CustomerService';
import { ProductService } from '../../../../demo/service/ProductService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';
import { Rating } from 'primereact/rating';
import { Slider } from 'primereact/slider';
import { ToggleButton } from 'primereact/togglebutton';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import type { Demo } from '../../../../types/types';
import axios from 'axios';
import { apiUrls } from '../../constants/constants';
import { Dialog } from 'primereact/dialog';
import EditDialogComponent from './EditDialogComponent';
import DeleteDialogComponent from './DeleteDialogComponent';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Tenant {
    isEnabled: any;
    id: string;
    authorId: string;
    authorName: string;
    created: number;
    editorId: string;
    editorName: string;
    modified: number;
    tenantId: string;
    tenantName: string;
    partnerRelationships: string[];
    primaryDomain: string;
    dateOnboarded: number;
}

const TableDemo = () => {
    const [customers1, setCustomers1] = useState<Demo.Customer[]>([]);
    const [customers2, setCustomers2] = useState<Demo.Customer[]>([]);
    const [customers3, setCustomers3] = useState<Demo.Customer[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [idFrozen, setIdFrozen] = useState(false);
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
    const [allExpanded, setAllExpanded] = useState(false);
    const [tenants, setTenants] = useState<Demo.Customer[]>([]);
    const [isAddTenantDialogVisible, setIsAddTenantDialogVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<Demo.Customer | null>(null);
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [editedData, setEditedData] = useState<Tenant | null>(null);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [statusText, setStatusText] = useState('');
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [enableDisableData, setEnableDisableData] = useState({
        isEnabled: false
    })
    const [newTenantData, setNewTenantData] = useState({
        tenantId: '',
        tenantName: '',
        primaryDomain: '',
        // deamonAppClientId: '',
        // deamonAppClientSecret: '',
        isEnabled: true
    });

    const [isTenantIdValid, setTenantIdValid] = useState(false);
    const [isTenantNameValid, setTenantNameValid] = useState(false);
    const [isPrimaryDomainValid, setPrimaryDomainValid] = useState(false);
    const [isStatusValid, setStatusValid] = useState(false);

    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ];

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];

    const partnerRelationshipsBodyTemplate = (rowData: Demo.Customer) => {
        if (Array.isArray(rowData.partnerRelationships)) {
            return rowData.partnerRelationships.join(', ');
        }
        return rowData.partnerRelationships;
    };

    const dynamicColumns = [
        { field: 'tenantId', header: 'Tenant ID' },
        { field: 'tenantName', header: 'Tenant Name' },
        { field: 'primaryDomain', header: 'Primary Domain' },
        { field: 'dateOnboarded', header: 'Date On-boarded' },
        { field: 'partnerRelationships', header: 'Partner Relationships' },
        { field: 'edit', header: 'Action' }
    ];

    const openConfirmationDialog = () => {
        setConfirmationText('');
        setConfirmationVisible(true);
    };


    const handleConfirmation = async () => {
        console.log('Hello');
        console.log(statusText, 'Current Status');
        console.log('Selected Tenant ID123:', selectedTenantId);

        if (statusText === 'Enable') {
            try {
                const data = {isEnabled:true};
                const response = await axios.post(`${apiBaseUrl}${apiUrls.enableTenant}${selectedTenantId}`, data);

                if(response.status === 200){
                    console.log(`Tenant with ID ${selectedTenantId} has been enabled.`);
                    setStatusText('Disable');
                    fetchTenants();
                }
            }
            catch (error) {
                    console.error('Error Enabling tenant:', error);
                }
        } else if(statusText === 'Disable'){
            try {
            const data = {isEnabled:false};
                const response = await axios.post(`${apiBaseUrl}${apiUrls.disableTenant}${selectedTenantId}`, data);

                if(response.status === 200){
                    console.log(`Tenant with ID ${selectedTenantId} has been disabled.`);
                    setStatusText('Enable');
                    fetchTenants();
                }
        }
        catch (error) {
            console.error('Error Disabling tenant:', error);
        }
    }
        
        // try {
        //     const response = await axios.post(`${apiBaseUrl}${apiUrls.enableTenant}`, newTenantData);

        //     if (response.status === 200) {
        //         setTenants((prevTenants) => [...prevTenants, response.data]);
        //         hideAddTenantDialog();
        //         fetchTenants();
        //     } else {
        //         console.error('Error adding new tenant:', response);
        //     }
        // } catch (error) {
        //     console.error('Error adding new tenant:', error);
        // }

        setConfirmationVisible(false);
    };

    const actionBodyTemplate = (rowData: Tenant) => {
        const handleEnableDisable = (tenantId: string, isEnabled: boolean) => {
            console.log('Tenant ID:', tenantId);
            console.log('Is Enabled:', isEnabled);
            setSelectedTenantId(tenantId);
            const newStatusText = rowData.isEnabled ? 'Disable' : 'Enable';
            setStatusText(newStatusText);
            setConfirmationText(`Do you really want to ${newStatusText} the selected tenant?`);
            setNewTenantData({
                tenantId: tenantId,
                tenantName: '',
                primaryDomain: '',
                isEnabled: isEnabled
            });
            openConfirmationDialog();
        };
        return (
            <React.Fragment>
                {/* <Button label="" icon="pi pi-user-edit" onClick={() => handleEdit(rowData)} className="p-button-rounded p-button-success" /> */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <Button label="Edit" onClick={() => handleEdit(rowData)} />
                    <Button label={rowData.isEnabled ? 'Disable' : 'Enable'} onClick={() => handleEnableDisable(rowData.tenantId, rowData.isEnabled)} />
                </div>
            </React.Fragment>
        );
    };

    const columns = dynamicColumns.map((col) => <Column key={col.field} field={col.field} header={col.header} body={col.field === 'partnerRelationships' ? partnerRelationshipsBodyTemplate : col.field === 'edit' ? actionBodyTemplate : undefined} />);

    const clearFilter1 = () => {
        initFilters1();
    };

    const handleEdit = (rowData: Tenant) => {
        setEditedData(rowData);
        setIsEditDialogVisible(true);
    };

    const handleDelete = (rowData: Tenant) => {
        setEditedData(rowData);
        setIsDeleteDialogVisible(true);
    };
    const closeEditDialog = () => {
        setEditedData(null);
        setIsEditDialogVisible(false);
    };

    const handleAddTenant = () => {
        setNewTenantData({
            tenantId: '',
            tenantName: '',
            primaryDomain: '',
            isEnabled: true
        });
        setIsAddTenantDialogVisible(true);
    };

    const hideAddTenantDialog = () => {
        setIsAddTenantDialogVisible(false);
    };

    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setNewTenantData((prevData) => ({ ...prevData, [name]: value }));

        // Added validation logic
    switch (name) {
        case 'tenantId':
            setTenantIdValid(value.trim() !== '');
            break;
        case 'tenantName':
            setTenantNameValid(value.trim() !== '');
            break;
        case 'primaryDomain':
            setPrimaryDomainValid(value.trim() !== '');
            break;
        // Handle other fields as needed
        default:
            break;
    }
    };
    console.log('NewTenantData', newTenantData);

    const handleDateChange = (e: { value: any }) => {
        setNewTenantData((prevData) => ({ ...prevData, dateOnboarded: e.value }));
    };

    const handleSaveTenant = async () => {
        // const newTenantId = generateGuid();

        // const newTenantDataWithIdAndDate = {
        //     ...newTenantData,
        //     tenantId: newTenantId,
        // };

        // console.log("NewTenantData", newTenantDataWithIdAndDate);
        console.log('NewTenantData123', newTenantData);

        try {
            const response = await axios.post(`${apiBaseUrl}${apiUrls.tenants}`, newTenantData);

            if (response.status === 200) {
                setTenants((prevTenants) => [...prevTenants, response.data]);
                hideAddTenantDialog();
                fetchTenants();
            } else {
                console.error('Error adding new tenant:', response);
            }
        } catch (error) {
            console.error('Error adding new tenant:', error);
        }
    };

    // const generateGuid = () => {
    //     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //         const r = (Math.random() * 16) | 0;
    //         const v = c === 'x' ? r : (r & 0x3) | 0x8;
    //         return v.toString(16);
    //     });
    // };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Search by Tenant name" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        setLoading2(true);

        CustomerService.getCustomersLarge().then((data) => {
            setCustomers1(getCustomers(data));
            setLoading1(false);
        });
        CustomerService.getCustomersLarge().then((data) => {
            setCustomers2(getCustomers(data));
            setLoading2(false);
        });
        CustomerService.getCustomersMedium().then((data) => setCustomers3(data));
        ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));

        initFilters1();
    }, []);

    console.log('Base Url', apiBaseUrl);
    console.log(`${apiBaseUrl}${apiUrls.tenants}`, 'Main Url');

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

    const closeDeleteDialog = () => {
        setIsDeleteDialogVisible(false);
    };

    console.log('Tenants Data', tenants);

    const balanceTemplate = (rowData: Demo.Customer) => {
        return (
            <div>
                <span className="text-bold">{formatCurrency(rowData.balance as number)}</span>
            </div>
        );
    };

    const getCustomers = (data: Demo.Customer[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const countryBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt="flag" src={`/demo/images/flag/flag_placeholder.png`} className={`flag flag-${rowData.country.code}`} width={30} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{rowData.country.name}</span>
            </React.Fragment>
        );
    };

    const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };

    const representativeBodyTemplate = (rowData: Demo.Customer) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img
                    alt={representative.name}
                    src={`/demo/images/avatar/${representative.image}`}
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{representative.name}</span>
            </React.Fragment>
        );
    };

    const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <>
                <div className="mb-3 text-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </>
        );
    };

    const representativesItemTemplate = (option: any) => {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`/demo/images/avatar/${option.image}`} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }}>{option.name}</span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const balanceBodyTemplate = (rowData: Demo.Customer) => {
        return formatCurrency(rowData.balance as number);
    };

    const balanceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option: any) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };

    const activityBodyTemplate = (rowData: Demo.Customer) => {
        return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
    };

    const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };

    const verifiedBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': rowData.verified,
                    'text-pink-500 pi-times-circle': !rowData.verified
                })}
            ></i>
        );
    };

    const verifiedFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };

    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const expandAll = () => {
        let _expandedRows = {} as { [key: string]: boolean };
        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows([]);
        setAllExpanded(false);
    };

    const amountBodyTemplate = (rowData: Demo.Customer) => {
        return formatCurrency(rowData.amount as number);
    };

    const statusOrderBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`order-badge order-${rowData.status?.toLowerCase()}`}>{rowData.status}</span>;
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return <img src={`/demo/images/product/${rowData.image}`} onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} alt={rowData.image} className="shadow-2" width={100} />;
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return formatCurrency(rowData.price as number);
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate2 = (rowData: Demo.Product) => {
        return <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    };

    const rowExpansionTemplate = (data: Demo.Product) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };

    const header = <Button icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'} label={allExpanded ? 'Collapse All' : 'Expand All'} onClick={toggleAll} className="w-11rem" />;

    const headerTemplate = (data: Demo.Customer) => {
        return (
            <React.Fragment>
                <img alt={data.representative.name} src={`/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span className="font-bold ml-2">{data.representative.name}</span>
            </React.Fragment>
        );
    };

    const footerTemplate = (data: Demo.Customer) => {
        return (
            <React.Fragment>
                <td colSpan={4} style={{ textAlign: 'right' }} className="text-bold pr-6">
                    Total Customers
                </td>
                <td>{calculateCustomerTotal(data.representative.name)}</td>
            </React.Fragment>
        );
    };

    const calculateCustomerTotal = (name: string) => {
        let total = 0;

        if (customers3) {
            for (let customer of customers3) {
                if (customer.representative.name === name) {
                    total++;
                }
            }
        }

        return total;
    };

    const header1 = renderHeader1();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                        <h5 style={{ marginTop: '10px' }}>Tenants</h5>
                        <Button style={{ marginBottom: '10px' }} onClick={handleAddTenant}>
                            Add Tenant
                        </Button>
                    </div>
                    <DataTable
                        value={tenants}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        responsiveLayout="scroll"
                        emptyMessage="No tenants found."
                        header={header1}
                    >
                        {columns}
                    </DataTable>

                    
                    <Dialog visible={isAddTenantDialogVisible} onHide={hideAddTenantDialog} header="Add Tenant" modal>
                        <div className="p-fluid">
                            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="tenantId">Tenant ID<span style={{ color: 'red' }}>&nbsp;*</span></label>
                                <InputText id="tenantId" name="tenantId" value={newTenantData.tenantId} onChange={handleInputChange} />
                                {newTenantData.tenantId.trim() === '' && <small className="p-error">Tenant ID is required.</small>}
                            </div>
                            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="tenantName">Tenant Name<span style={{ color: 'red' }}>&nbsp;*</span></label>
                                <InputText id="tenantName" name="tenantName" value={newTenantData.tenantName} onChange={handleInputChange} />
                                {newTenantData.tenantName.trim() === '' && <small className="p-error">Tenant Name is required.</small>}
                            </div>
                            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="primaryDomain">Primary Domain<span style={{ color: 'red' }}>&nbsp;*</span></label>
                                <InputText id="primaryDomain" name="primaryDomain" value={newTenantData.primaryDomain} onChange={handleInputChange} />
                                {newTenantData.primaryDomain.trim() === '' && <small className="p-error">Primary Domain is required.</small>}
                            </div>
                            {/* <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="dateOnboarded">Date Onboarded</label>
                                <Calendar id="dateOnboarded" name="dateOnboarded" value={newTenantData.dateOnboarded} onChange={handleDateChange} showIcon />
                            </div> */}

                            {/* <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="partnerRelationships">Partner Relationships</label>
                                <InputText id="partnerRelationships" name="partnerRelationships" value={newTenantData.partnerRelationships} onChange={handleInputChange} />
                            </div> */}
                            {/* <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="deamonAppClientId">Client ID</label>
                                <InputText id="deamonAppClientId" name="deamonAppClientId" value={newTenantData.deamonAppClientId} onChange={handleInputChange} />
                            </div> */}
                            {/* <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="deamonAppClientSecret">Client Secret</label>
                                <InputText id="deamonAppClientSecret" name="deamonAppClientSecret" value={newTenantData.deamonAppClientSecret} onChange={handleInputChange} />
                            </div> */}
                            <div className="p-field" style={{ marginBottom: '10px', padding: '10px' }}>
                                <label htmlFor="status">Status<span style={{ color: 'red' }}>&nbsp;*</span></label>
                                <Dropdown
                                    id="status"
                                    name="status"
                                    value={newTenantData.isEnabled}
                                    options={[
                                        { label: 'Enable', value: true },
                                        { label: 'Disable', value: false }
                                    ]}
                                    onChange={(e) => {
                                        const isEnabled = e.value;
                                        setNewTenantData((prevData) => ({ ...prevData, isEnabled }));

                                        // Add validation logic
                                        setStatusValid(true); // Assuming that the status dropdown always has a value

                                    }}
                                    placeholder="Select Status"
                                />
                            </div>
                            {/* <div className="p-field" style={{ marginBottom: '20px', padding: '10px' }}>
                                <label htmlFor="status" style={{marginBottom:'20px'}}>Status</label>
                                <ToggleButton
                                    id="status"
                                    onIcon="pi pi-check"
                                    offIcon="pi pi-times"
                                    onLabel="Enable"
                                    offLabel="Disable"
                                    checked={newTenantData.isEnabled}
                                    onChange={(e) => {
                                        const isEnabled = e.value;
                                        setNewTenantData((prevData) => ({ ...prevData, isEnabled }));
                                    }}
                                />
                            </div> */}
                        </div>
                        <div className="p-dialog-footer" style={{ marginTop: '10px', justifyContent: 'space-between' }}>
                            <Button label="Cancel" icon="pi pi-times" onClick={hideAddTenantDialog} className="p-button-text" />
                            <Button label="Save" icon="pi pi-check" onClick={handleSaveTenant} 
                              disabled={
                                !isTenantIdValid ||
                                !isTenantNameValid ||
                                !isPrimaryDomainValid ||
                                !isStatusValid
                            } />
                        </div>
                    </Dialog>

                    <Dialog
                        visible={confirmationVisible}
                        onHide={() => setConfirmationVisible(false)}
                        header="Confirmation"
                        modal
                        footer={
                            <div>
                                <Button label="Cancel" icon="pi pi-times" onClick={() => setConfirmationVisible(false)} className="p-button-text" />
                                <Button label="Yes" icon="pi pi-check" onClick={handleConfirmation} />
                            </div>
                        }
                    >
                        <div className="p-fluid">
                            <div className="p-field">
                                <label htmlFor="confirmationText">Do you really want to {statusText} the selected Tenant?</label>
                            </div>
                        </div>
                    </Dialog>

                    {isEditDialogVisible && editedData && (
                        <EditDialogComponent
                            rowData={editedData}
                            onClose={closeEditDialog}
                            onSave={(editedData) => {
                                closeEditDialog();
                            }}
                        />
                    )}

                    {/* <DeleteDialogComponent isVisible={isDeleteDialogVisible} onDelete={() => handleDelete(editedData)} onClose={closeDeleteDialog} /> */}
                </div>
            </div>
        </div>
    );
};

export default TableDemo;
