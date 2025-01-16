import { Suspense, useEffect, useState } from "react";
import { useGlobal } from './context';
import { Button } from '../components/Button';
import { Title } from '../components/Title';
import { classnames } from '../components/utils';
import { toast, ToastContainer } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { FaTrash, FaXmark } from "react-icons/fa6"
import { IoMdCheckmark } from "react-icons/io";
import Loadding from "./Loadding";
import axios from "axios";
import styles from './style/chatoptionsconfig.module.less';
import './style/chatregisterapi.less';

export function ConfigHeader() {
    const { setIs, is } = useGlobal()
    return (
        <div className={classnames(styles.header, 'flex-c-sb')}>
            <Title type="h5">Admin | Manage Institution</Title>
            <div className="flex-c">
                <Button type="icon" onClick={() => setIs({ ChatInstitution: false })} icon="back" />
                <Button type="icon" onClick={() => setIs({ config: !is.config, ChatInstitution: false })} icon="close" />
            </div>
        </div>
    );
}

export default function ChatInstitution() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [apiData, setApiData] = useState({ apiKey: "" });
    const [listings, setListings] = useState([]);
    const [editApi, setEditApi] = useState({ id: null, apiKey: "" });

    useEffect(() => {
        handleListings();
    }, []);

    //Inserting Apikey
    const handleApi = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api`, {
                ...apiData
            }, {
                headers: { "Content-Type": "application/json" }
            });
            if (response?.status === 201 || response?.status === 200) {
                toast?.success("API added successfully");
                setApiData({ apiKey: "" });
                handleListings();
            } else {
                throw new Error("Failed to add API");
            }
        } catch (error) {
            toast?.error("Registration error");
        }
    };

    //Listing Apikey
    const handleListings = async () => {
        const token = JSON.parse(localStorage.getItem("userData"))?.token || null;
        try {
            const response = await axios.get(`http://192.46.208.144:8080/experimentalbrain/api/v1/techclient/alltechveinclients`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setListings(response?.data);
        } catch (error) {
            toast?.error("Failed to fetch listings");
        }
    };

    //Updating Apikey
    const handleEditClick = (apidata) => {
        setEditApi({ id: apidata.id, apiKey: apidata.apiKey });
    };
    const handleCancelEdit = () => {
        setEditApi({ id: null, apiKey: "" });
    };
    const handleUpdate = async (id) => {
        try {
            const response = await axios.patch(`${apiUrl}/api/${id}`, {
                apiKey: editApi.apiKey,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response?.status === 200) {
                toast?.info("API edited successfully");
                handleListings();
                handleCancelEdit();
            } else {
                throw new Error(`Failed to edit API. Status code: ${response?.status}`);
            }
        } catch (error) {
            toast?.error("Error updating API");
        }
    };

    //Deleting Apikey
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${apiUrl}/api/${id}`);
            if (response?.status === 200 || response?.status === 204) {
                toast.error("API deleted successfully");
                setListings(listings?.filter(apidata => apidata.id !== id));
            } else {
                throw new Error(`Failed to delete API. Status code: ${response?.status}`);
            }
        } catch (error) {
            toast?.error("Error deleting API");
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
                                        <h5 className="card-title">Institution Creation</h5>
                                    </div>
                                    <form className="form-inline" onSubmit={handleApi}>
                                        <div className="input-group">
                                            <label className="sr-only">API Keys</label>
                                            <input
                                                name="apiKey"
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter your API"
                                                value={apiData.apiKey}
                                                onChange={(e) => setApiData({ apiKey: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn">Submit</button>
                                    </form>
                                    <div className="card-body">
                                        <h5 className="card-title">Manage API Keys</h5>
                                    </div>
                                    <div className="input-group2">
                                        <table className="user-table">
                                            <thead>
                                                <tr>
                                                    <th>SL No</th>
                                                    <th>Techvein ID</th>
                                                    <th>Client Name</th>
                                                    <th>Application URL</th>
                                                    <th>Redirect URL</th>
                                                    <th>Client ID</th>
                                                    <th>Client Secret</th>
                                                    <th>EDVEIN Username</th>
                                                    <th>EDVEIN Password</th>
                                                    <th>Edit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listings?.length > 0 && listings?.map((apidata, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{apidata?.id || 'N/A'}</td>
                                                        <td>{apidata?.clientName || 'N/A'}</td>
                                                        <td>{apidata?.appUrl || 'N/A'}</td>
                                                        <td>{apidata?.redirectUrl || 'N/A'}</td>
                                                        <td>{apidata?.clientId || 'N/A'}</td>
                                                        <td>{apidata?.clientServer || 'N/A'}</td>
                                                        <td>{apidata?.edveinName || 'N/A'}</td>
                                                        <td>{apidata?.edveinPsswd || 'N/A'}</td>
                                                        <td>
                                                            {editApi?.id === apidata?.id ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleUpdate(apidata?.id)}
                                                                        className="button"
                                                                    >
                                                                        <IoMdCheckmark />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleCancelEdit}
                                                                        className="button"
                                                                    >
                                                                        <FaXmark />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditClick(apidata)}
                                                                    className="button"
                                                                >
                                                                    <FaRegEdit />
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(apidata?.id)}
                                                                className="button"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
