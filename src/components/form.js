import { useState, useEffect, useRef } from "react";
import "./form.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ViewModal } from "./viewModal";
import { DeleteModal } from "./deleteModal";
import Toast from "react-bootstrap/Toast";
import { createUser, getAllUsers, updateUser } from "./apiCall";
import { UserList } from "./userList";

export const Form = () => {
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const phonePart2Ref = useRef(null);
  const phonePart3Ref = useRef(null);
  const [phone, setPhone] = useState({
    phonePart1: "",
    phonePart2: "",
    phonePart3: "",
  });

  //form initialState
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    qualification: "",
    comments: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [id, setId] = useState();
  const [update, setUpdate] = useState(false);
  const [showToast, setShowToast] = useState(false);

  //initial userlist fetching
  const fetchUsers = () => {
    getAllUsers().then((response) => {
      setData(response);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (count > 0) {
      toast();
    }
  }, [count]);
  //Input field value change function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (
      name === "phonePart1" ||
      name === "phonePart2" ||
      name === "phonePart3"
    ) {
      setPhone({ ...phone, [name]: value });
    }

    if (name === "phonePart1" && value.length === 3) {
      phonePart2Ref.current.focus();
    } else if (name === "phonePart2" && value.length === 4) {
      phonePart3Ref.current.focus();
    }

    validateField(name, value);
  };

  //field Validation function
  const validateField = (name, value) => {
    let error = "";
    let isValid = true;

    switch (name) {
      case "address1":
      case "address2":
      case "qualification":
      case "comments":
      case "city":
      case "zipCode":
      case "state":
      case "country":
        if (!value.trim()) {
          error = "This field is required.";
          isValid = false;
        }
        break;
      case "firstName":
        if (!value.trim()) {
          error = "This field is required.";
          isValid = false;
        } else if (!/^[A-Za-z]+$/.test(value)) {
          error = "Only letters are allowed.";
          isValid = false;
        } else if (value.length > 20) {
          error = "Maximum 20 letters.";
          isValid = false;
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "This field is required.";
          isValid = false;
        } else if (!/^[A-Za-z]+$/.test(value)) {
          error = "Only letters are allowed.";
          isValid = false;
        } else if (value.length > 20) {
          error = "Maximum 20 letters.";
          isValid = false;
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "This field is required.";
          isValid = false;
        }
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid.";
          isValid = false;
        }
        break;
      case "phonePart1":
        if (!value.trim()) {
          error = "This field is required.";
          isValid = false;
        } else if (!/^\d{3}$/.test(value)) {
          error = "Required 3 digits number.";
          isValid = false;
        }
        break;
      case "phonePart2":
        if (!value.trim()) {
          error = "This field is required.";
          isValid = false;
        } else if (!/^\d{4}$/.test(value)) {
          error = "Required 3 digits number.";
          isValid = false;
        }
        break;
      case "phonePart3":
        if (!value.trim()) {
          error = "This field is required.";
          isValid = false;
        } else if (!/^\d{3}$/.test(value)) {
          error = "Required 3 digits number.";
          isValid = false;
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    return isValid;
  };

  //validating the form
  const validateForm = () => {
    let isValid = true;
    for (const [name, value] of Object.entries(formData)) {
      if (!validateField(name, value)) {
        isValid = false;
      }
    }
    for (const [name, value] of Object.entries(phone)) {
      if (!validateField(name, value)) {
        isValid = false;
      }
    }
    return isValid;
  };

  //form submission function
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      const combinedPhoneNumber = `${phone.phonePart1}${phone.phonePart2}${phone.phonePart3}`;
      const updatedFormData = { ...formData, phoneNumber: combinedPhoneNumber };

      //api call
      createUser(updatedFormData).then((data) => {
        setFormData(initialState);
        setPhone({
          phonePart1: "",
          phonePart2: "",
          phonePart3: "",
        });
        setCount((x) => x + 1);
        setMessage("User created successfully");
        fetchUsers();
      });
    } else {
      setMessage("Please fix the errors in the form");
    }
  };

  //handleEdit button function
  const handleEdit = (item) => {
    setFormData(item);
    setPhone({
      ...phone,
      phonePart1: (item?.phoneNumber).slice(0, 3),
      phonePart2: (item?.phoneNumber).slice(3, 7),
      phonePart3: (item?.phoneNumber).slice(7, 10),
    });
    setUpdate(true);
  };

  //form updation fubction
  function handleUpdate(event) {
    event.preventDefault();

    const userId = formData?.id;
    updateUser(userId, formData).then(() => {
      setFormData(initialState);
      setPhone({
        ...phone,
        phonePart1: "",
        phonePart2: "",
        phonePart3: "",
      });
      setMessage("update successfull");
      toast();
      fetchUsers();
      setUpdate(false);
    });
  }

  //toast function
  function toast() {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setMessage("");
    }, 2000);
  }

  return (
    <div className="container">
      {/* //view modal component */}
      <ViewModal id={id} />

      {/* delete MOdal */}
      <DeleteModal
        id={id}
        setMessage={setMessage}
        setCount={setCount}
        fetchUsers={fetchUsers}
      />

      {/* Toast notification */}
      <Toast
        show={showToast}
        bg="success"
        onClose={() => {
          setShowToast(!showToast);
        }}
        className="position-fixed top-0 start-50 translate-middle-x mt-3"
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>
          <strong className="me-auto text-light">{message}</strong>
        </Toast.Body>
      </Toast>

      {/* form */}

      <div className="register col-md-5 col-sm-6">
        <h1 className="title">
          <strong>Bio Data</strong>
        </h1>

        <form>
          <div className="form-group mb-0">
            <label className="reg_txt">
              Name <span>*</span>
            </label>

            <div className="controls form-inline">
              <div style={{ display: "flex" }}>
                <div className="d-flex justify-content-between  w-100">
                  <div className="w-45">
                    <input
                      type="text"
                      className={`input-name w-100 ${
                        errors.firstName ? "not-valid" : ""
                      }`}
                      placeholder="First"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.firstName && (
                      <small className="text-danger">{errors.firstName}</small>
                    )}
                  </div>

                  <div className="w-45">
                    <input
                      type="text"
                      className={`input-name w-100 ${
                        errors.lastName ? "not-valid" : ""
                      }`}
                      placeholder="Last"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.lastName && (
                      <small className="text-danger">{errors.lastName}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix"></div>
          <div className="form-group">
            <label className="reg_txt">
              Email <span>*</span>
            </label>
            <input
              type="text"
              className="form-register text"
              id=""
              placeholder="E-mail"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>
          <div className="clearfix"></div>
          <div className="form-group " style={{ height: "70px" }}>
            <label className="reg_txt">
              Phone Number <span>*</span>
            </label>
            <div className="clearfix"></div>
            <div className="wsite-form " style={{ marginBottom: "20px" }}>
              <input
                type="text"
                className="text input-name1"
                name="phonePart1"
                value={phone?.phonePart1}
                onChange={handleInputChange}
                maxLength={3}
              />
              {errors.phonePart1 && (
                <small className="text-danger">{errors.phonePart1}</small>
              )}
            </div>

            <div className="line">-</div>
            <div className="wsite-form" style={{ marginBottom: "20px" }}>
              <input
                type="text"
                className="text input-name1"
                name="phonePart2"
                value={phone?.phonePart2}
                onChange={handleInputChange}
                maxLength={4}
                ref={phonePart2Ref}
              />
              {errors.phonePart2 && (
                <small className="text-danger">{errors.phonePart2}</small>
              )}
            </div>
            <div className="line">-</div>
            <div className="wsite-form" style={{ marginBottom: "20px" }}>
              <input
                type="text"
                className="text input-name1"
                name="phonePart3"
                // value={formData?.phoneNumber}
                value={phone?.phonePart3}
                onChange={handleInputChange}
                maxLength={3}
                ref={phonePart3Ref}
              />
              {errors.phonePart3 && (
                <small className="text-danger">{errors.phonePart3}</small>
              )}
            </div>
          </div>
          <div className="clearfix"></div>
          <div className="clearfix"></div>

          <div className="form-group">
            <label className="reg_txt">
              Address <span>*</span>
            </label>
            <input
              type="text"
              className="form-register text"
              id=""
              placeholder="Line 1"
              style={{ marginBottom: "15px" }}
              name="address1"
              value={formData?.address1}
              onChange={handleInputChange}
            />
            {errors.address1 && (
              <p className="text-danger">{errors.address1}</p>
            )}
            <input
              type="text"
              className="form-register text"
              id=""
              placeholder="Line 2"
              name="address2"
              value={formData?.address2}
              onChange={handleInputChange}
            />
            {errors.address2 && (
              <p className="text-danger">{errors.address2}</p>
            )}
          </div>
          <div className="form-group  mb-0">
            <div className="controls form-inline">
              <div className="d-flex justify-content-between  w-100">
                <div className="w-45">
                  <input
                    type="text"
                    className="input-name w-100"
                    placeholder="City"
                    name="city"
                    value={formData?.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && <p className="text-danger">{errors.city}</p>}
                </div>
                <div className="w-45">
                  <input
                    type="text"
                    className="input-name w-100"
                    placeholder="State"
                    name="state"
                    value={formData?.state}
                    onChange={handleInputChange}
                  />
                  {errors.state && (
                    <p className="text-danger">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="controls form-inline">
              <div className="d-flex justify-content-between  w-100">
                <div className="w-45">
                  <input
                    type="text"
                    className="input-name w-100"
                    placeholder="Zip Code"
                    name="zipCode"
                    value={formData?.zipCode}
                    onChange={handleInputChange}
                  />
                  {errors.zipCode && (
                    <p className="text-danger">{errors.zipCode}</p>
                  )}
                </div>
                <div className="w-45">
                  <input
                    type="text"
                    className="input-name w-100"
                    placeholder="Country"
                    name="country"
                    value={formData?.country}
                    onChange={handleInputChange}
                  />
                  {errors.country && (
                    <p className="text-danger">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="reg_txt">
              Write Your qualification <span>*</span>
            </label>
            <input
              type="text"
              className="form-register text"
              id=""
              placeholder=""
              style={{ marginBottom: "15px" }}
              name="qualification"
              value={formData?.qualification}
              onChange={handleInputChange}
            />
            {errors.qualification && (
              <p className="text-danger">{errors.qualification}</p>
            )}
          </div>
          <div className="clearfix"></div>
          <div className="form-group">
            <label className="reg_txt">
              Comment <span>*</span>
            </label>
            <textarea
              className="form-register text"
              name="comments"
              value={formData?.comments}
              onChange={handleInputChange}
            ></textarea>
            {errors.comments && (
              <p className="text-danger">{errors.comments}</p>
            )}
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary submit"
              style={{ width: "97%" }}
              onClick={update ? handleUpdate : handleSubmit}
            >
              {update ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* userlist Componet */}

      <div className="col-md-6 tabt">
        <table className="table">
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, i) => (
                <UserList
                  item={item}
                  key={i}
                  handleEdit={handleEdit}
                  setId={setId}
                />
              ))
            ) : (
              <tr>No Data Found</tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
