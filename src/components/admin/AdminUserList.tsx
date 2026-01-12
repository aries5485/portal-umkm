'use client'

import { Profile } from '@/types'
import { deleteUser, toggleProStatus, toggleSuspendUser } from '@/actions/admin-actions'
import { useState } from 'react'

export default function AdminUserList({ users }: { users: Profile[] }) {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

    const handleAction = async (id: string, actionFn: any, ...args: any[]) => {
        if (!confirm('Apakah Anda yakin?')) return

        setLoadingMap(prev => ({ ...prev, [id]: true }))
        try {
            await actionFn(id, ...args)
        } catch (error) {
            alert('Gagal melakukan aksi')
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }))
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <tr>
                        <th className="p-4">UMKM / Pemilik</th>
                        <th className="p-4">Status Akun</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                            <td className="p-4">
                                <div className="font-bold text-gray-900">{user.nama_umkm}</div>
                                <div className="text-sm text-gray-500">{user.nama_pemilik || '-'}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${user.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        {user.status || 'active'}
                                    </span>
                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${user.tipe_akun === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.tipe_akun}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                                {user.role || 'user'}
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <button
                                        disabled={loadingMap[user.id]}
                                        onClick={() => handleAction(user.id, toggleProStatus, user.tipe_akun)}
                                        className="text-xs px-3 py-1 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 disabled:opacity-50"
                                    >
                                        {user.tipe_akun === 'premium' ? 'Downgrade' : 'Set PRO'}
                                    </button>
                                    <button
                                        disabled={loadingMap[user.id]}
                                        onClick={() => handleAction(user.id, toggleSuspendUser, user.status || 'active')}
                                        className={`text-xs px-3 py-1 rounded disabled:opacity-50 ${user.status === 'suspended'
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                            }`}
                                    >
                                        {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                    </button>
                                    <button
                                        disabled={loadingMap[user.id]}
                                        onClick={() => handleAction(user.id, deleteUser)}
                                        className="text-xs px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">Belum ada user terdaftar.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
