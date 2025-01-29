import { Suspense, useEffect, useState } from "react";
import { useGlobal } from './context';
import { Button } from '../components/Button';
import { Title } from '../components/Title';
import { classnames } from '../components/utils';
import { toast, ToastContainer } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { FaTrash, FaXmark } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import Loadding from "./Loadding";
import axios from "axios";
import styles from './style/chatoptionsconfig.module.less';
import './style/chatinstituation.less';

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
    const institutionApiUrl = import.meta.env.VITE_API_INSTITUTION_URL;
    const [institutionData, setInstitutionData] = useState({
        clientName: "",
        applicationURL: "",
        redirectURL: "",
        clientID: "",
        clientSecret: "",
        edveinUsername: "",
        edveinPassword: "",
    });
    const [listings, setListings] = useState([]);
    const [editApi, setEditApi] = useState({ id: null, apiKey: "" });
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        handleListings();
    }, []);

    //Inserting Apikey
    const handleApi = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api`, {
                ...institutionData
            }, {
                headers: { "Content-Type": "application/json" }
            });
            if (response?.status === 201 || response?.status === 200) {
                toast?.success("API added successfully");
                setInstitutionData({
                    clientName: "",
                    applicationURL: "",
                    redirectURL: "",
                    clientID: "",
                    clientSecret: "",
                    edveinUsername: "",
                    edveinPassword: "",
                });
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
            const response = await axios.get(`${institutionApiUrl}/experimentalbrain/api/v1/techclient/alltechveinclients`,
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
                            <div className="inline-col">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Manage Institutions</h5>
                                    </div>
                                    <div className="myBtn">
                                        <button className="btn btn-primary" onClick={() => {
                                            setModalOpen(true)
                                        }}>Add Institution</button>
                                    </div>
                                    <div className="table-responsive">
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
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listings?.length > 0 ? (
                                                    listings.map((apidata, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{apidata?.id || 'N/A'}</td>
                                                            <td>{apidata?.clientName || 'N/A'}</td>
                                                            <td>
                                                                <a
                                                                    href={apidata?.appUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    {apidata?.appUrl || 'N/A'}
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <a
                                                                    href={apidata?.redirectUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    {apidata?.redirectUrl || 'N/A'}
                                                                </a>
                                                            </td>
                                                            <td>{apidata?.clientId || 'N/A'}</td>
                                                            <td>{apidata?.clientSecret || 'N/A'}</td>
                                                            <td>{apidata?.edveinName || 'N/A'}</td>
                                                            <td>{apidata?.edveinPsswd || 'N/A'}</td>
                                                            <td>
                                                                {editApi?.id === apidata?.id ? (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleUpdate(apidata?.id)}
                                                                            className="button success"
                                                                        >
                                                                            <IoMdCheckmark />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={handleCancelEdit}
                                                                            className="button danger"
                                                                        >
                                                                            <FaXmark />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleEditClick(apidata)}
                                                                            className="button"
                                                                        >
                                                                            <FaRegEdit />
                                                                        </button>
                                                                        {/* <button
                                                                            type="button"
                                                                            onClick={() => handleDelete(apidata?.id)}
                                                                            className="button danger"
                                                                        >
                                                                            <FaTrash />
                                                                        </button> */}
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10">No data available</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>
                            &times;
                        </span>
                        <h5>Add New Institution</h5>
                        <form onSubmit={handleApi}>
                            <div className="form-group">
                                <label htmlFor="apiKey">Client Name</label>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client Name"
                                    value={institutionData?.clientName}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apiKey">Application URL</label>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Application URL"
                                    value={institutionData?.applicationURL}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, applicationURL: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apiKey">Redirect URL</label>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Redirect URL"
                                    value={institutionData?.redirectURL}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, redirectURL: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apiKey">Client ID</label>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client ID"
                                    value={institutionData?.clientID}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientID: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apiKey">Client Secret</label>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client Secret"
                                    value={institutionData?.clientSecret}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientSecret: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apiKey">EDVEIN Username</label>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter EDVEIN Username"
                                    value={institutionData?.edveinUsername}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, edveinUsername: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apiKey">EDVEIN Password</label>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter EDVEIN Password"
                                    value={institutionData?.edveinPassword}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, edveinPassword: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Suspense>
    );
}