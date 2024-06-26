import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserById } from "./apiCall";

export const ViewModal = (id) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (id) {
      getUserById(id).then((response) => {
        setData(response);
      });
    }
  }, [id]);

  return (
    <div
      className="modal fade"
      id="viewModal"
      tabIndex="-1"
      aria-labelledby="viewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="viewModalLabel">
              {data?.firstName}'s Detail
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <table className="table">
              <tbody>
                {Object.entries(data)
                  .filter(([key, value]) => key !== "id")
                  .map(([key, value]) => (
                    <tr key={key}>
                      <th scope="row" className="text-start">
                        {key}
                      </th>
                      <td className="text-start">{value ? value : "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
