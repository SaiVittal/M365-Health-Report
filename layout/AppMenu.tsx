/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
// import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        // {
        //     label: 'Home',
        //     items: []
        // },
        {
            label: '',
            items: [
                // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                // { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                // { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
                // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
                // { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
                { label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/dashboard' }, 
                { label: 'Subscriptions', icon: 'pi pi-fw pi-money-bill', to: '/subscriptions' },
                // { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
                // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
                // { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                // { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
                // { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
                // { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
                // { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                // { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
                // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
                    {
                                label: 'Checklist',
                                icon: 'pi pi-fw pi-list',
                                items: [
                                    {
                                        label: 'Summary',
                                        icon: 'pi pi-fw pi-info-circle',
                                        to: '/checklist/summary'
                                    },
                                    {
                                        label: 'Domains',
                                        icon: 'pi pi-fw pi-globe',
                                        to: '/checklist/domains'
                                    },
                                    {
                                        label: 'Inactive Users with License',
                                        icon: 'pi pi-fw pi-user-minus',
                                        to: '/checklist/inactiveuserswithlicenses'
                                    },
                                    {
                                        label: 'Inactive Users Login Enabled',
                                        icon: 'pi pi-fw pi-lock',
                                        to: '/checklist/inactiveusersloginenabled'
                                    },
                                    {
                                        label: 'Global Admins',
                                        icon: 'pi pi-fw pi-globe',
                                        to: '/checklist/globalAdmins'
                                    },
                                    
                                ]
                            },
                    {
                        label: 'Admin',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Checklist Report for all Tenants',
                                icon: 'pi pi-fw pi-chart-bar',
                                to: '/admin/checklistreportforalltenants'
                                //to: '/auth/login'
                            },
                            { label: 'Tenants', icon: 'pi pi-fw pi-users', to: '/admin/tenants' },
                        ]
                    },
            ]
        },

    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
