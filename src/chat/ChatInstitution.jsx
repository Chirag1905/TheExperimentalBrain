import { Suspense, useEffect, useState } from "react";
import { useGlobal } from './context';
import { Button } from '../components/Button';
import { Title } from '../components/Title';
import { classnames } from '../components/utils';
import { toast, ToastContainer } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
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
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [institutionID, setInstitutionID] = useState(null)


    const getInstitutionList = async () => {
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


    useEffect(() => {
        getInstitutionList();
    }, []);

    const handleOnSubmit = async (e) => {

        e.preventDefault();

        const token = JSON.parse(localStorage.getItem("userData"))?.token || null;

        const institutionObject = {
            appUrl: institutionData.applicationURL,
            clientId: institutionData.clientID,
            clientSecret: institutionData.clientSecret,
            edveinPsswd: institutionData.edveinPassword,
            edveinUserName: institutionData.edveinUsername,
            isActive: true,
            redirectUrl: institutionData.redirectURL,
            schoolName: institutionData.clientName
        }

        console.log(institutionObject, "institutionObject")

        try {
            const response = await axios.post(`${institutionApiUrl}/experimentalbrain/api/v1/techclient/createtechveinclient`, institutionObject, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            const newResponse = response?.data
            if (response.status === 201) {
                if (newResponse?.response === "success") {
                    setModalOpen(false);
                    getInstitutionList();
                    toast.success(newResponse?.responseReason, { theme: "colored" });
                    setInstitutionData({
                        clientName: "",
                        applicationURL: "",
                        redirectURL: "",
                        clientID: "",
                        clientSecret: "",
                        edveinUsername: "",
                        edveinPassword: "",
                    });
                } else {
                    throw new Error("Failed to add API");
                }
            }

        } catch (error) {
            console.log(error);
        }
    };


    const InstitutionUpdate = async (Id) => {

        const token = JSON.parse(localStorage.getItem("userData"))?.token || null;
        const response = await axios.get(`${institutionApiUrl}/experimentalbrain/api/v1/techclient/techveinclient/${Id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        const details = response?.data || {};

        setInstitutionID(Id)

        setInstitutionData({
            clientName: details.schoolName || "",
            applicationURL: details.appUrl || "",
            redirectURL: details.redirectUrl || "",
            clientID: details.clientId || "",
            clientSecret: details.clientServer || "",
            edveinUsername: details.edveinName || "",
            edveinPassword: details.edveinPsswd || "",
        });
    };

    const handleOnUpdate = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem("userData"))?.token || null;

        const institutionObject = {
            appUrl: institutionData.applicationURL,
            clientId: institutionData.clientID,
            clientSecret: institutionData.clientSecret,
            edveinPsswd: institutionData.edveinPassword,
            edveinUserName: institutionData.edveinUsername,
            isActive: true,
            redirectUrl: institutionData.redirectURL,
            schoolName: institutionData.clientName
        }
        try {
            const response = await axios.put(`${institutionApiUrl}/experimentalbrain/api/v1/techclient/updatetechveinclient/${institutionID}`, institutionObject, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(response.status === 200);

            const newResponse = response?.data

            if (response.status === 200) {
                if (newResponse?.response === "success") {
                    setIsModalEdit(false);
                    getInstitutionList();
                    toast.success(newResponse?.responseReason, { theme: "colored" });
                } else {
                    throw new Error("Failed to add API");
                }
            }

        } catch (error) {
            console.log(error)
        }
    }


    const handleAddClick = () => {
        setIsModalEdit(false);
        setInstitutionID(null)
        setModalOpen(true)
        setInstitutionData({
            clientName: "",
            applicationURL: "",
            redirectURL: "",
            clientID: "",
            clientSecret: "",
            edveinUsername: "",
            edveinPassword: "",
        });
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
                                            handleAddClick()
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
                                                            <td>{apidata?.clientServer || 'N/A'}</td>
                                                            <td>{apidata?.edveinName || 'N/A'}</td>
                                                            <td>{apidata?.edveinPsswd || 'N/A'}</td>
                                                            <td>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => { InstitutionUpdate(apidata?.id); setIsModalEdit(true); }}
                                                                    className="button"
                                                                >
                                                                    <FaRegEdit />
                                                                </button>
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

            {/*================================ add modal========================================== */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>
                            &times;
                        </span>
                        <h5>Add New Institution</h5>
                        <form onSubmit={handleOnSubmit}>
                            <div className="form-group">
                                <label htmlFor="clientName">Client Name</label>
                                <input
                                    id="clientName"
                                    name="clientName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client Name"
                                    value={institutionData?.clientName || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="applicationURL">Application URL</label>
                                <input
                                    id="applicationURL"
                                    name="applicationURL"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Application URL"
                                    value={institutionData?.applicationURL || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, applicationURL: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="redirectURL">Redirect URL</label>
                                <input
                                    id="redirectURL"
                                    name="redirectURL"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Redirect URL"
                                    value={institutionData?.redirectURL || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, redirectURL: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="clientID">Client ID</label>
                                <input
                                    id="clientID"
                                    name="clientID"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client ID"
                                    value={institutionData?.clientID || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientID: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="clientSecret">Client Secret</label>
                                <input
                                    id="clientSecret"
                                    name="clientSecret"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client Secret"
                                    value={institutionData?.clientSecret || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientSecret: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edveinUsername">EDVEIN Username</label>
                                <input
                                    id="edveinUsername"
                                    name="edveinUsername"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter EDVEIN Username"
                                    value={institutionData?.edveinUsername || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, edveinUsername: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edveinPassword">EDVEIN Password</label>
                                <input
                                    id="edveinPassword"
                                    name="edveinPassword"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter EDVEIN Password"
                                    value={institutionData?.edveinPassword || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, edveinPassword: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <button type="submit" className="btn" style={{ cursor: "pointer" }}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/*================================ edit modal========================================== */}

            {isModalEdit && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalEdit(false)}>
                            &times;
                        </span>
                        <h5>Update Institution</h5>
                        <form onSubmit={handleOnUpdate}>
                            <div className="form-group">
                                <label htmlFor="clientName">Client Name</label>
                                <input
                                    id="clientName"
                                    name="clientName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client Name"
                                    value={institutionData?.clientName || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="applicationURL">Application URL</label>
                                <input
                                    id="applicationURL"
                                    name="applicationURL"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Application URL"
                                    value={institutionData?.applicationURL || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, applicationURL: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="redirectURL">Redirect URL</label>
                                <input
                                    id="redirectURL"
                                    name="redirectURL"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Redirect URL"
                                    value={institutionData?.redirectURL || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, redirectURL: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="clientID">Client ID</label>
                                <input
                                    id="clientID"
                                    name="clientID"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client ID"
                                    value={institutionData?.clientID || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientID: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="clientSecret">Client Secret</label>
                                <input
                                    id="clientSecret"
                                    name="clientSecret"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Client Secret"
                                    value={institutionData?.clientSecret || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, clientSecret: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edveinUsername">EDVEIN Username</label>
                                <input
                                    id="edveinUsername"
                                    name="edveinUsername"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter EDVEIN Username"
                                    value={institutionData?.edveinUsername || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, edveinUsername: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edveinPassword">EDVEIN Password</label>
                                <input
                                    id="edveinPassword"
                                    name="edveinPassword"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter EDVEIN Password"
                                    value={institutionData?.edveinPassword || ""}
                                    onChange={(e) =>
                                        setInstitutionData({ ...institutionData, edveinPassword: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success" style={{ cursor: "pointer" }}>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Suspense>
    );
}