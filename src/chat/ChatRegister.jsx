import { Suspense, useEffect, useState } from "react";
import { Button } from '../components/Button';
import { Title } from '../components/Title';
import { useGlobal } from './context';
import { classnames } from '../components/utils';
import { toast, ToastContainer } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { FaTrash, FaXmark } from "react-icons/fa6"
import { IoMdCheckmark } from "react-icons/io";
import axios from "axios";
import Loadding from "./Loadding";
import styles from './style/chatoptionsconfig.module.less';
import './style/chatregisterapi.less';

export function ConfigHeader() {
    const { setIs, is } = useGlobal()
    return (
        <div className={classnames(styles.header, 'flex-c-sb')}>
            <Title type="h5">Admin | Manage User</Title>
            <div className="flex-c">
                <Button type="icon" onClick={() => setIs({ ChatRegister: false })} icon="back" />
                <Button type="icon" onClick={() => setIs({ config: !is.config, ChatRegister: false })} icon="close" />
            </div>
        </div>
    );
}

export default function ChatRegister() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [editData, setEditData] = useState({ id: null, email: "", password: "", role: "" });
    const [listings, setListings] = useState([]);

    useEffect(() => {
        handleListings();
    }, [setListings]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const usersResponse = await axios.get(`${apiUrl}/users`);
            if (usersResponse?.status !== 200) throw new Error("Failed to fetch user data");

            const users = usersResponse?.data;
            if (users?.some(user => user.email === formData.email)) {
                toast?.warn("User Already Exists");
                return;
            }
            const response = await axios.post(`${apiUrl}/users`,
                { ...formData, role: "User" },
                { headers: { "Content-Type": "application/json" } });
            if (response?.status === 201 || response?.status === 200) {
                toast?.success("Registration successful");
                setFormData({ email: "", password: "" });
                handleListings();
            } else {
                throw new Error("Failed to register user");
            }
        } catch (error) {
            toast?.error("Registration error");
        }
    };

    const handleListings = async () => {
        try {
            const response = await axios.get(`${apiUrl}/users`);
            setListings(response?.data);
        } catch (error) {
            toast?.error("Failed to fetch listings");
        }
    };

    const handleEditClick = (user) => {
        setEditData({ id: user.id, email: user.email, password: user.password, role: user.role });
    };

    const handleCancelEdit = () => {
        setEditData({ id: null, email: "", password: "", role: "" });
    };

    const handleUpdate = async (id) => {
        try {
            const response = await axios.patch(`${apiUrl}/users/${id}`, {
                email: editData.email,
                password: editData.password,
                role: editData.role
            });
            if (response?.status === 200) {
                toast?.info("User Edited successfully");
                handleListings();
                handleCancelEdit();
            } else {
                throw new Error("Failed to edit user");
            }
        } catch (error) {
            toast?.error("Error updating user");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/users/${id}`);
            if (response?.status === 200) {
                toast?.error("User deleted successfully");
                setListings(listings?.filter(user => user.id !== id));
            } else {
                throw new Error("Failed to delete user");
            }
        } catch (error) {
            toast?.error("Error deleting user");
        }
    };
    return (
        <Suspense fallback={<Loadding />}>
            <div className={classnames(styles.config)}>
                <ConfigHeader />
                <ToastContainer draggable theme="colored" />
                <div className={classnames(styles.inner, 'flex-1')}>
                    <div className="container">
                        <div className="row">
                            <div className="inline-col dfsfd">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Add Users</h5>
                                        <form className="form-inline" onSubmit={handleRegister}>
                                            <div className="form-inline d-flex">
                                                <div className="input-group mr-10">
                                                    <label className="sr-only" >Email</label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter your email"
                                                        autoComplete="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label className="sr-only" >Password</label>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        autoComplete="password"
                                                        className="form-control"
                                                        placeholder="Enter your password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="btn">Submit</button>
                                            </div>

                                            <h5 className="card-title">Manage Users</h5>
                                            <div className="input-group2">
                                                <table className="user-table">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Email</th>
                                                            <th>Password</th>
                                                            <th>Roll</th>
                                                            <th>Manage</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listings.map((user, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {editData.id === user.id ? (
                                                                        <input
                                                                            type="email"
                                                                            className="form-control"
                                                                            value={editData.email}
                                                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                                        />
                                                                    ) : (
                                                                        user.email
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {editData.id === user.id ? (
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={editData.password}
                                                                            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                                                        />
                                                                    ) : (
                                                                        user.password
                                                                    )}
                                                                </td> <td>
                                                                    {editData.id === user.id ? (
                                                                        <select
                                                                            className="category-select"
                                                                            value={editData.role}
                                                                            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                                                        >
                                                                            <option>Admin</option>
                                                                            <option>User</option>
                                                                        </select>
                                                                    ) : (
                                                                        user.role
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {editData.id === user.id ? (
                                                                        <>
                                                                            <button type="button" onClick={() => handleUpdate(user.id)} className="button"><IoMdCheckmark /></button>
                                                                            <button type="button" onClick={handleCancelEdit} className="button"><FaXmark /></button>
                                                                        </>
                                                                    ) : (
                                                                        <button type="button" onClick={() => handleEditClick(user)} className="button"><FaRegEdit /> </button>
                                                                    )}
                                                                    <button type="button" onClick={() => handleDelete(user.id)} className="button"><FaTrash /> </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}
