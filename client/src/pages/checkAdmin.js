import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CheckAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const email = localStorage.getItem('userEmail'); // Assuming email is stored in localStorage
                if (!email) {
                    setError('No email found in localStorage.');
                    setLoading(false);
                    return;
                }
                const response = await axios.post('http://localhost:5001/api/admin/check-admin', { email });
                if (response.data.isAdmin) {
                    setIsAdmin(true);
                } else {
                    setError('You are not an admin');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    setError(`An error occurred while checking admin status: ${error.response.data.message}`);
                } else {
                    setError(`An error occurred while checking admin status: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isAdmin ? (
                <h1>You have admin privileges</h1>
            ) : (
                <h1>You are not an admin</h1>
            )}
        </div>
    );
};

export default CheckAdmin;