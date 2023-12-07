/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: '',
            items: [
                // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                // { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                // { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
                // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
                // { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
                 { label: 'Tenants', icon: 'pi pi-fw pi-table', to: '/uikit/tenants' },
                 { label: 'Subscriptions', icon: 'pi pi-fw pi-table', to: '/uikit/subscriptions' },
                // { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
                // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
                // { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                // { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
                // { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
                // { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
                // { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                // { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },

                    {
                                label: 'Checklist',
                                icon: 'pi pi-fw pi-user',
                                items: [
                                    {
                                        label: 'Summary',
                                        icon: 'pi pi-fw pi-sign-in',
                                        to: '/uikit/checklists'
                                    },
                                    {
                                        label: 'Domains',
                                        icon: 'pi pi-fw pi-times-circle',
                                        to: '/uikit/domains'
                                    },
                                    {
                                        label: 'Inactive Users with License',
                                        icon: 'pi pi-fw pi-lock',
                                        to: '/auth/access'
                                    },
                                    {
                                        label: 'Inactive Users Login Enabled',
                                        icon: 'pi pi-fw pi-lock',
                                        to: '/auth/access'
                                    }
                                ]
                            },
                    {
                        label: 'Reports Menu',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Checklist Report for all Tenants',
                                icon: 'pi pi-fw pi-sign-in',
                                //to: '/auth/login'
                            }
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
