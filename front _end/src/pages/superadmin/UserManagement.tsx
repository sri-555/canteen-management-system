import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'super_admin';
  status: 'active' | 'blocked';
  joinedAt: string;
  avatar: string;
}
const INITIAL_USERS: User[] = [
{
  id: '1',
  name: 'Alex Student',
  email: 'alex@student.com',
  role: 'student',
  status: 'active',
  joinedAt: '2023-09-15',
  avatar: 'https://ui-avatars.com/api/?name=Alex+Student&background=random'
},
{
  id: '2',
  name: 'Sarah Admin',
  email: 'sarah@admin.com',
  role: 'admin',
  status: 'active',
  joinedAt: '2023-08-20',
  avatar: 'https://ui-avatars.com/api/?name=Sarah+Admin&background=random'
},
{
  id: '3',
  name: 'Super Admin',
  email: 'super@admin.com',
  role: 'super_admin',
  status: 'active',
  joinedAt: '2023-01-01',
  avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=random'
},
{
  id: '4',
  name: 'John Doe',
  email: 'john@student.com',
  role: 'student',
  status: 'blocked',
  joinedAt: '2023-10-05',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
},
{
  id: '5',
  name: 'Mike Manager',
  email: 'mike@admin.com',
  role: 'admin',
  status: 'active',
  joinedAt: '2023-09-01',
  avatar: 'https://ui-avatars.com/api/?name=Mike+Manager&background=random'
},
{
  id: '6',
  name: 'Emily Chen',
  email: 'emily@student.com',
  role: 'student',
  status: 'active',
  joinedAt: '2023-11-12',
  avatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=random'
},
{
  id: '7',
  name: 'David Wilson',
  email: 'david@student.com',
  role: 'student',
  status: 'active',
  joinedAt: '2023-11-15',
  avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=random'
},
{
  id: '8',
  name: 'Lisa Taylor',
  email: 'lisa@admin.com',
  role: 'admin',
  status: 'active',
  joinedAt: '2023-09-10',
  avatar: 'https://ui-avatars.com/api/?name=Lisa+Taylor&background=random'
}];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<
    'all' | 'student' | 'admin' | 'super_admin'>(
    'all');
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const toggleBlockStatus = (id: string) => {
    setUsers((prev) =>
    prev.map((user) =>
    user.id === id ?
    {
      ...user,
      status: user.status === 'active' ? 'blocked' : 'active'
    } :
    user
    )
    );
  };
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="error">Super Admin</Badge>;
      case 'admin':
        return <Badge variant="warning">Admin</Badge>;
      case 'student':
        return <Badge variant="info">Student</Badge>;
      default:
        return <Badge variant="neutral">{role}</Badge>;
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="text-sm text-gray-500">Total Users: {users.length}</div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Search by name or email..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />

        </div>
        <div className="flex gap-2">
          {(['all', 'student', 'admin', 'super_admin'] as const).map((role) =>
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${roleFilter === role ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>

              {role === 'all' ?
            'All' :
            role.
            replace('_', ' ').
            replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          )}
        </div>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              <AnimatePresence>
                {filteredUsers.map((user, index) =>
                <motion.tr
                  key={user.id}
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                  className="group hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                        className="h-10 w-10 rounded-full bg-gray-200"
                        src={user.avatar}
                        alt="" />

                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                      variant={
                      user.status === 'active' ? 'success' : 'neutral'
                      }>

                        {user.status === 'active' ? 'Active' : 'Blocked'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.role !== 'super_admin' &&
                    <Button
                      variant={
                      user.status === 'active' ? 'danger' : 'secondary'
                      }
                      size="sm"
                      onClick={() => toggleBlockStatus(user.id)}
                      className="w-24">

                          {user.status === 'active' ?
                      <>
                              <Ban className="w-3 h-3 mr-1.5" />
                              Block
                            </> :

                      <>
                              <CheckCircle className="w-3 h-3 mr-1.5" />
                              Unblock
                            </>
                      }
                        </Button>
                    }
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}