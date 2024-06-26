import { deleteUserById } from "./apiCall";

export const DeleteModal = ({ id, setMessage, setCount, fetchUsers }) => {
  const userId = id;

  const handleDelete = () => {
    deleteUserById(userId).then((response) => {
      setMessage(response);
      setCount((x) => x + 1);
      fetchUsers();
    });
  };

  return (
    <>
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteModalLabel">
                Delete Confirmation
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <p className="text-center">
                Are you sure you want to delete this user data ?
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
