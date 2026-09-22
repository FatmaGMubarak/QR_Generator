import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/user/ui/UserSidebar';
import { useUserOptions } from '../context/UserOptionsContext';
import UserTopbar from '../components/user/ui/UserTopbar';


export default function UserLayout() {
     const {isSidebarOpen} = useUserOptions()
    
  return (
    <div className="flex min-h-screen">
      <UserTopbar />
      <UserSidebar />
      <main className={`flex-1 ${isSidebarOpen ? 'lg:mr-60' : 'lg:mr-20'} overflow-hidden`}>
        <Outlet />
      </main>
    </div>
  );
}