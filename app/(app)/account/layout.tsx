import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'My Account',
  description:
    'Manage your Memento Mori account. Orders, addresses, wishlist, settings.',
  path: '/account',
  noIndex: true,
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
