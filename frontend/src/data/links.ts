import {
	Building2Icon,
	FilePenIcon,
	LogOutIcon,
	SettingsIcon,
	UsersIcon,
} from 'lucide-react';

export const navigationLinks = [
	{
		label: 'Applications',
		Icon: FilePenIcon,
		href: '/my-applications',
	},
	{
		label: 'Recruitments',
		Icon: UsersIcon,
		href: '/my-recruitments',
	},
	{
		label: 'Companies',
		Icon: Building2Icon,
		href: '/my-companies',
	},
	{
		label: 'Settings',
		Icon: SettingsIcon,
		href: '/settings',
	},
	{
		label: 'Logout',
		Icon: LogOutIcon,
		href: `${import.meta.env.VITE_API_URI}/logout`,
	},
];
