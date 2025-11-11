import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './AdminNav';
import { useNavigate } from 'react-router-dom';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('/api/staffauth/staffuser');
        setStaff(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching staff members');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const handleSave = async (staffId, updatedData) => {
    try {
      const response = await axios.put(`/api/staffauth/staffuser/${staffId}`, updatedData);
      setStaff((prev) =>
        prev.map((member) => (member._id === staffId ? response.data : member))
      );
      setEditingStaff(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating staff member');
    }
  };

  const handleRemove = async (staffId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this staff member?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/api/staffauth/staffuser/${staffId}`);
      setStaff((prev) => prev.filter((member) => member._id !== staffId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting staff member');
    }
  };
  

  const filteredStaff = staff.filter(
    (member) =>
      (member.Department?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (member.Role?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  // Navigate to the staff member's info page
  const handleViewInfo = (staffId) => {
    navigate(`/staffinfo/${staffId}`);
  };

  return (
    <div>
      <Nav />
      <div className="container-fluid">
        {loading && <div className="alert alert-info">Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <h1>Staff List</h1>

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-75"
            placeholder="Search by Department or Role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-success ml-3" onClick={() => navigate('/newstaffform')}>
            Add New Staff
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member._id}>
                  {editingStaff?._id === member._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="firstName"
                          value={editingStaff?.firstName || ''}
                          onChange={(e) => setEditingStaff({...editingStaff, firstName: e.target.value})}
                          className="form-control mb-2"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={editingStaff?.lastName || ''}
                          onChange={(e) => setEditingStaff({...editingStaff, lastName: e.target.value})}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editingStaff?.email || ''}
                          onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="Department"
                          value={editingStaff?.Department || ''}
                          onChange={(e) => setEditingStaff({...editingStaff, Department: e.target.value})}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="Role"
                          value={editingStaff?.Role || ''}
                          onChange={(e) => setEditingStaff({...editingStaff, Role: e.target.value})}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleSave(member._id, editingStaff)}
                        >
                          Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{`${member.firstName} ${member.lastName}`}</td>
                      <td>{member.email}</td>
                      <td>{member.Department}</td>
                      <td>{member.Role}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => setEditingStaff(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ml-2"
                          onClick={() => handleRemove(member._id)}
                        >
                          Remove
                        </button>
                    
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffList;
