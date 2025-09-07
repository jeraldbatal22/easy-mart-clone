'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useLogout } from '@/lib/hooks/useLogout';
import { Button } from '@/components/ui/button';

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const { logout } = useLogout();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">User Profile</h3>
      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
        {user.verifiedAt && (
          <p><strong>Verified At:</strong> {new Date(user.verifiedAt).toLocaleDateString()}</p>
        )}
      </div>
      <Button 
        onClick={logout}
        variant="outline"
        className="mt-4"
      >
        Logout
      </Button>
    </div>
  );
}
