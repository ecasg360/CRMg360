import { FuseNavigation } from '@fuse/types';
export const navigation: FuseNavigation[] =
    [
        {
            "children": [
                {
                    "id": "dashboard",
                    "title": "Dashboard",
                    "translate": "NAV.DASHBOARD",
                    "type": "collapsable",
                    "url": null,
                    "children": [
                        {
                            "id": "dashboardProject",
                            "title": "dashboard Project",
                            "translate": "NAV.PROJECTS",
                            "type": "item",
                            "url": "/dashboard/dashboard-projects"
                        },
                        {
                            "id": "dashboardContracts",
                            "title": "dashboard Contracts",
                            "translate": "NAV.CONTRACTS",
                            "type": "item",
                            "url": "/dashboard/dashboard-contracts"
                        },
                        {
                            "id": "Marketing",
                            "title": "Marketing",
                            "translate": "NAV.MARKETING",
                            "type": "item",
                            "url": "dashboard/dashboard-marketing"
                        }
                    ],
                },
                {
                    "id": "general",
                    "title": "General",
                    "translate": "NAV.GENERAL",
                    "type": "collapsable",
                    "url": null,
                    "children": [
                        {
                            "id": "catalogs",
                            "title": "Catalogs",
                            "translate": "NAV.CATALOGS",
                            "type": "item",
                            "url": null
                        }
                    ],
                },
                {
                    "id": "label",
                    "title": "Label",
                    "translate": "NAV.LABEL",
                    "type": "collapsable",
                    "url": null,
                    "children": [
                        {
                            "id": "artists",
                            "title": "Artists",
                            "translate": "NAV.ARTISTS",
                            "type": "item",
                            "url": "/artist/manage"
                        },
                        {
                            "id": "albumRelease",
                            "title": "album Release",
                            "translate": "NAV.ALBUMRELEASE",
                            "type": "item",
                            "url": "/projects/add/1"
                        },
                        {
                            "id": "singleRelease",
                            "title": "Single Release",
                            "translate": "NAV.SINGLERELEASE",
                            "type": "item",
                            "url": "/projects/add/2"
                        },
                        {
                            "id": "musicVideo",
                            "title": "Music Video",
                            "translate": "NAV.MUSICVIDEO",
                            "type": "item",
                            "url": "/projects/add/3"
                        },
                        {
                            "id": "videoLyricMusic",
                            "title": "Music Video",
                            "translate": "NAV.VIDEOLYRICMUSIC",
                            "type": "item",
                            "url": "/projects/add/4"
                        },
                        {
                            "id": "contentVideo",
                            "title": "Content Video",
                            "translate": "NAV.CONTENTVIDEO",
                            "type": "item",
                            "url": "/projects/add/7"
                        }
                    ],
                },
                {
                    "id": "publishing",
                    "title": "Publishing",
                    "translate": "NAV.PUBLISHING",
                    "type": "collapsable",
                    "url": null,
                    "children": [
                        {
                            "id": "composer",
                            "title": "Composer",
                            "translate": "NAV.COMPOSER",
                            "type": "item",
                            "url": "/composer/manage"
                        },
                        {
                            "id": "worksmanage",
                            "title": "Composition",
                            "translate": "NAV.COMPOSITION",
                            "type": "item",
                            "url": "/general/works"
                        },
                        {
                            "id": "EditoraDashboard",
                            "title": "Dashboard",
                            "translate": "NAV.DASHBOARD",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": "publishingReports",
                            "title": "Reports",
                            "translate": "NAV.REPORTS",
                            "type": "item",
                            "url": "/404"
                        }
                    ],

                },
                {
                    "id": "events",
                    "title": "Events",
                    "translate": "NAV.EVENTS",
                    "type": "collapsable",
                    "url": null,
                    "children": [
                        {
                            "id": "manageEvents",
                            "title": "manage Events",
                            "translate": "NAV.MANAGE",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": "contractsEvents",
                            "title": "Contracts Events",
                            "translate": "NAV.CONTRACTS",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": "EventsMarketing",
                            "title": "Marketing",
                            "translate": "NAV.MARKETING",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": "eventsReports",
                            "title": "Events Reports",
                            "translate": "NAV.REPORTS",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": "EventosDashboard",
                            "title": "Dashboard",
                            "translate": "NAV.DASHBOARD",
                            "type": "item",
                            "url": "/404"
                        }
                    ],
                },
                {
                    "id": "agency",
                    "title": "agency",
                    "translate": "NAV.AGENCY",
                    "type": "collapsable",
                    "url": null,
                    "children": [
                        {
                            "id": "artistsSaleAgency",
                            "title": "Artists Sale Agency",
                            "translate": "NAV.SALEARTISTS",
                            "type": "item",
                            "url": "/projects/add/6"
                        },
                        {
                            "id": "contratosAgency",
                            "title": "Contracts Agency",
                            "translate": "NAV.CONTRACTS",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": "marketingAgency",
                            "title": "Marketing Agency",
                            "translate": "NAV.MARKETING",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": "sponsorAgency",
                            "title": "Sponsor Agency",
                            "translate": "NAV.SPONSOR",
                            "type": "item",
                            "url": "/operations/sponsor"
                        },
                        {
                            "id": "reportsAgency",
                            "title": "Reports Agency",
                            "translate": "NAV.REPORTS",
                            "type": "item",
                            "url": "/404"
                        },
                        {
                            "id": 'promoters',
                            "title": 'Promoters',
                            "type": 'item',
                            "translate": 'NAV.PROMOTERS',
                            "url": '/checklist/promoters'
                        },
                    ],
                },
                {
                    "id": "security",
                    "title": "Security",
                    "translate": "NAV.SECURITY",
                    "type": "collapsable",
                    "url": null,
                    "children": [
                        {
                            "id": "securityRoles",
                            "title": "Security Roles",
                            "translate": "NAV.ROLE",
                            "type": "item",
                            "url": "/security/role"
                        },
                        {
                            id: 'user',
                            title: 'Users',
                            translate: 'NAV.USERS',
                            type: 'item',
                            url: '/security/user',
                        }
                    ],
                },
                {
                    id: 'settings',
                    title: 'Settings',
                    translate: 'NAV.SETTINGS',
                    type: 'collapsable',
                    children: [
                        {
                            id: 'mainActivity',
                            title: 'Main Activity',
                            translate: 'NAV.MAINACTIVITY',
                            type: 'item',
                            url: '/settings/main-activity',
                        },
                        {
                            id: 'artisttype',
                            title: 'Artist Type',
                            translate: 'NAV.ARTISTTYPE',
                            type: 'item',
                            url: '/artist/type',
                        },
                        {
                            id: 'musicalInstrument',
                            title: 'Musical Instrument',
                            type: 'item',
                            translate: 'NAV.MUSICALINSTRUMENTS',
                            url: '/artist/musical-instrument'
                        },
                        {
                            id: 'catalogTypes',
                            title: 'Catalog Types',
                            translate: 'NAV.CATALOGTYPES',
                            type: 'item',
                            url: '/settings/catalog-type',
                        },
                        {
                            id: 'company',
                            title: 'Company',
                            type: 'item',
                            translate: 'NAV.COMPANY',
                            url: '/settings/company'
                        },
                        {
                            id: 'currency',
                            title: 'Currency',
                            type: 'item',
                            translate: 'NAV.CURRENCY',
                            url: '/settings/currency'
                        },
                        {
                            id: 'time',
                            title: 'Time',
                            type: 'item',
                            translate: 'NAV.TIME',
                            url: '/settings/time'
                        },
                        {
                            id: 'location',
                            title: 'Location',
                            type: 'item',
                            translate: 'NAV.LOCATION',
                            url: '/settings/location'
                        },
                        {
                            id: 'menu',
                            title: 'Configuration Menu',
                            type: 'item',
                            translate: 'NAV.MENU',
                            url: '/settings/menu'
                        },
                        {
                            id: 'musicalGenre',
                            title: 'Musical Genre',
                            type: 'item',
                            translate: 'NAV.MUSICALGENRE',
                            url: '/settings/musical-genre'
                        },
                        {
                            id: 'preferences',
                            title: 'Preferences',
                            type: 'item',
                            translate: 'NAV.PREFERENCES',
                            url: '/settings/preferences'
                        },
                        {
                            id: 'roleNotifications',
                            title: 'Role Notifications',
                            type: 'item',
                            translate: 'NAV.ROLENOTIFICATION',
                            url: '/settings/role-notification'
                        },
                        {
                            id: 'artistType',
                            title: 'Artist Type',
                            type: 'item',
                            translate: 'NAV.ARTISTTYPE',
                            url: '/artist/type'
                        },
                        {
                            id: 'contract-markers',
                            title: 'Contract Document Markers',
                            type: 'item',
                            translate: 'NAV.CONTRACT-MAKERS',
                            url: '/settings/contract-markers'
                        },
                    ]
                },
                {
                    id: 'metas',
                    title: 'Metas',
                    translate: 'NAV.metas',
                    type: 'collapsable',
                    children: [
                        {
                            id: 'meta',
                            title: 'Manage',
                            type: 'item',
                            translate: 'NAV.MANAGE_META',
                            url: '/metas/list'
                        },
                    ]
                },
            ],
            "id": "applications",
            "title": "Applications",
            "translate": "NAV.APPLICATIONS",
            "type": "group",
            "url": null
        }
    ]
/*export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'NAV.DASHBOARD',
                type: 'item',
                icon: 'dashboard',
                url: '/dashboard'
            },
            {
                id: 'general',
                title: 'General',
                translate: 'NAV.GENERAL',
                type: 'collapsable',
                icon: 'video_library',
                children: [
                    {
                        id: 'department',
                        title: 'Department',
                        type: 'item',
                        icon: 'videocam',
                        translate: 'NAV.DEPARTMENT',
                        url: 'general/department'
                    },
                ]
            },
            {
                id: 'operations',
                title: 'Operations',
                translate: 'NAV.OPERATIONS',
                type: 'collapsable',
                icon: 'dashboard',
                children: [
                    {
                        id: 'artist',
                        title: 'Artist',
                        translate: 'NAV.ARTIST',
                        type: 'collapsable',
                        icon: 'people_outline',
                        children: [
                            {
                                id: 'manage',
                                title: 'Manage',
                                type: 'item',
                                icon: 'assignment_ind',
                                translate: 'NAV.MANAGE',
                                url: '/artist/manage'
                            },
                            {
                                id: 'album',
                                title: 'Album',
                                type: 'item',
                                translate: 'NAV.ALBUMS',
                                url: '/artist/albumes'
                            },
                            //{
                            //    id: 'tripPreference',
                            //    title: 'Trip Preference',
                            //    type: 'item',
                            //    translate: 'NAV.TRIPPREFERENCE',
                            //    url: '/artist/trip-preference'
                            //},
                            {
                                id: 'artistGroup',
                                title: 'Artist Group',
                                type: 'item',
                                translate: 'NAV.ARTISTGROUP',
                                url: '/artist/group'
                            },

                        ]
                    },
                    {
                        id: 'composers',
                        title: 'Composers',
                        translate: 'NAV.COMPOSER',
                        type: 'collapsable',
                        icon: 'people_outline',
                        children: [
                            {
                                id: 'manageComposer',
                                title: 'Manage Composer',
                                type: 'item',
                                translate: 'NAV.MANAGE',
                                icon: 'assignment_ind',
                                url: '/composer/manage'
                            },
                            {
                                id: 'works',
                                title: 'Works',
                                translate: 'NAV.WORKS',
                                type: 'item',
                                icon: 'audiotrack',
                                url: '/composer/works'
                            },
                        ]
                    },
                    {
                        id: 'projects',
                        title: 'Projects',
                        translate: 'NAV.PROJECTS',
                        type: 'collapsable',
                        icon: 'people_outline',
                        children: [
                            {
                                id: 'manageProjects',
                                title: 'Manage Projects',
                                type: 'item',
                                translate: 'NAV.MANAGE',
                                icon: 'assignment_ind',
                                url: '/projects'
                            },
                            {
                                id: 'eventCalendar',
                                title: 'Events Calendar',
                                type: 'item',
                                translate: 'NAV.EVENT_CALENDAR',
                                icon: 'calendar_today',
                                url: '/projects/event-calendar'
                            }
                        ]
                    },
                    {
                        id: 'promoter',
                        title: 'Promoter',
                        translate: 'NAV.PROMOTER',
                        type: 'item',
                        icon: 'supervisor_account',
                        url: '/operations/promoter',
                    },
                    {
                        id: 'sponsor',
                        title: 'Sponsor',
                        translate: 'NAV.SPONSOR',
                        type: 'item',
                        icon: 'supervisor_account',
                        url: '/operations/sponsor',
                    },
                ]
            },
            {
                id: 'library',
                title: 'Biblioteca',
                translate: 'NAV.LIBRARY',
                type: 'collapsable',
                icon: 'video_library',
                children: [
                    {
                        id: 'videoLibrary',
                        title: 'Video Library',
                        type: 'item',
                        icon: 'videocam',
                        translate: 'NAV.VIDEOLIBRARY',
                        url: 'library/video'
                    },
                    {
                        id: 'album',
                        title: 'Album',
                        type: 'item',
                        icon: 'audiotrack',
                        translate: 'NAV.AUDIOLIBRARY',
                        url: 'library/audio'
                    }
                ]
            },
            {
                id: 'settings',
                title: 'Settings',
                translate: 'NAV.SETTINGS',
                type: 'collapsable',
                icon: 'settings',
                children: [
                    {
                        id: 'mainActivity',
                        title: 'Main Activity',
                        translate: 'NAV.MAINACTIVITY',
                        type: 'item',
                        url: '/settings/main-activity',
                    },
                    {
                        id: 'musicalInstrument',
                        title: 'Musical Instrument',
                        type: 'item',
                        translate: 'NAV.MUSICALINSTRUMENTS',
                        url: '/artist/musical-instrument'
                    },
                    {
                        id: 'catalogTypes',
                        title: 'Catalog Types',
                        translate: 'NAV.CATALOGTYPES',
                        type: 'item',
                        url: '/settings/catalog-type',
                    },
                    {
                        id: 'company',
                        title: 'Company',
                        type: 'item',
                        translate: 'NAV.COMPANY',
                        url: '/settings/company'
                    },
                    {
                        id: 'currency',
                        title: 'Currency',
                        type: 'item',
                        translate: 'NAV.CURRENCY',
                        url: '/settings/currency'
                    },
                    {
                        id: 'location',
                        title: 'Location',
                        type: 'item',
                        translate: 'NAV.LOCATION',
                        url: '/settings/location'
                    },
                    {
                        id: 'menu',
                        title: 'Configuration Menu',
                        type: 'item',
                        translate: 'NAV.MENU',
                        url: '/settings/menu'
                    },
                    {
                        id: 'musicalGenre',
                        title: 'Musical Genre',
                        type: 'item',
                        translate: 'NAV.MUSICALGENRE',
                        url: '/settings/musical-genre'
                    },
                    {
                        id: 'preferences',
                        title: 'Preferences',
                        type: 'item',
                        translate: 'NAV.PREFERENCES',
                        url: '/settings/preferences'
                    },
                    {
                        id: 'roleNotifications',
                        title: 'Role Notifications',
                        type: 'item',
                        translate: 'NAV.ROLENOTIFICATION',
                        url: '/settings/role-notification'
                    },
                    {
                        id: 'artistType',
                        title: 'Artist Type',
                        type: 'item',
                        translate: 'NAV.ARTISTTYPE',
                        url: '/artist/type'
                    },
                    {
                        id: 'time',
                        title: 'Time',
                        type: 'item',
                        icon: 'library_music',
                        translate: 'NAV.TIME',
                        url: '/settings/time'
                    },
                ]
            },
            {
                id: 'security',
                title: 'Security',
                translate: 'NAV.SECURITY',
                type: 'collapsable',
                icon: 'security',
                children: [
                    {
                        id: 'user',
                        title: 'Users',
                        translate: 'NAV.USERS',
                        type: 'item',
                        url: '/security/user',
                    },
                    {
                        id: 'Role',
                        title: 'Roles',
                        translate: 'NAV.ROLE',
                        type: 'item',
                        url: '/security/role',
                    }
                ]
            },
        ]
    }
];

*/