import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from 'axios'; 

const EditStaffModal = ({ show, onHide, staffDetails, handleUpdate }) => {
 
  const [updatedDetails, setUpdatedDetails] = useState({
    firstName: staffDetails.firstName || '',
    lastName: staffDetails.lastName || '',
    email: staffDetails.email || '',
    phone: staffDetails.phone || '',
    gender: staffDetails.gender || 'Male',  
    department: staffDetails.department || '',
    role: staffDetails.role || '',
  });

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({
      ...updatedDetails,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();  
    try {
      
      const response = await axios.put(`/api/staffauth/staffuser/${staffDetails._id}`, updatedDetails);

      
      handleUpdate(response.data);

      
      onHide();  
    } catch (err) {
      console.error('Error updating staff member:', err.response?.data?.message || err.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Staff Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="firstName"
              value={updatedDetails.firstName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="lastName"
              value={updatedDetails.lastName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={updatedDetails.email}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phone"
              value={updatedDetails.phone}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={updatedDetails.gender}
              onChange={handleInputChange}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department"
              name="department"
              value={updatedDetails.department}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter role"
              name="role"
              value={updatedDetails.role}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditStaffModal;
