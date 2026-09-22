import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/ui/AdminSidebar';
import AdminTopbar from '../components/admin/ui/AdminTopbar';
import { useUserOptions } from '../context/UserOptionsContext';

export default function AdminLayout() {
  const {isSidebarOpen} = useUserOptions()
  return (
    <div className="flex min-h-screen">
        <AdminTopbar />
      
      <AdminSidebar />
      <main className={`flex-1 ${isSidebarOpen ? 'lg:mr-60' : 'lg:mr-20'} overflow-hidden` }>
        <Outlet />
      </main>
    </div>
  );
}