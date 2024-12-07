import ReactLoading from "react-loading";
import './style/loadding.less';

export default function Loadding() {
    return (
        <div className="loading-container">
            <ReactLoading type="spin" color="#f35a2e" height={100} width={50} />
            <h2>Loading</h2>
        </div>
    );
}
