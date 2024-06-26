export const UserList = ({ item, setId, handleEdit }) => {
  return (
    <tr key={item?.id}>
      <td>{item?.firstName}</td>
      <td>{item?.email}</td>
      <td>{item?.phoneNumber}</td>
      <td>
        <button
          className="ed"
          onClick={() => {
            handleEdit(item);
          }}
        >
          Edit
        </button>
      </td>
      <td>
        <button
          className="ed"
          style={{ background: "#f00" }}
          data-bs-toggle="modal"
          data-bs-target="#deleteModal"
          onClick={() => {
            setId(item?.id);
          }}
        >
          Delete
        </button>
      </td>
      <td>
        <button
          className="ed"
          style={{ background: "#000" }}
          // data-bs-config={{ backdrop: true }}
          data-bs-toggle="modal"
          data-bs-target="#viewModal"
          onClick={() => {
            setId(item?.id);
          }}
        >
          View
        </button>
      </td>
    </tr>
    // </div>
  );
};
