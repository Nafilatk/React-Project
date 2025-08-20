import { useState, useEffect } from 'react';
import { FiTrash2, FiUserX, FiUserCheck } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const UsersAdmin = () => {
  const colors = {
    primary: "#0B2B26",
    secondary: "#1A5347",
    accent: "#8EB69B",
    highlight: "#DAF1DE",
    background: "#F5F5F5",
    card: "#FFFFFF",
    textDark: "#383832",
    textLight: "#FFFFFF"
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/users');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleBlockUser = async (id, isBlock) => {
    if (!window.confirm(`Are you sure you want to ${isBlock ? "unblock" : "block"} this user?`)) {
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/users/${id}`, { isBlock: !isBlock });
      setUsers(users.map(user => user.id === id ? { ...user, isBlock: !isBlock } : user));
      toast.success(`User ${isBlock ? "unblocked" : "blocked"} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: colors.primary, fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Manage Users
      </h1>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `3px solid ${colors.primary}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: colors.card, 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: colors.primary }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: colors.textLight }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: colors.textLight }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: colors.textLight }}>Role</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: colors.textLight }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: colors.textLight }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', color: colors.textDark }}>{user.name}</td>
                    <td style={{ padding: '12px 16px', color: colors.textDark }}>{user.email}</td>
                    <td style={{ padding: '12px 16px', color: colors.textDark }}>{user.role}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        backgroundColor: user.isBlock ? '#FEE2E2' : '#DCFCE7',
                        color: user.isBlock ? '#B91C1C' : '#166534',
                        fontSize: '12px'
                      }}>
                        {user.isBlock ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => toggleBlockUser(user.id, user.isBlock)}
                          style={{ 
                            color: user.isBlock ? colors.accent : '#EF4444',
                            padding: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {user.isBlock ? <FiUserCheck size={18} /> : <FiUserX size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          style={{ 
                            color: '#EF4444',
                            padding: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
