//baseUrl
const baseUrl = "http://54.202.218.249:9501";

//api call for fetch All users
export const getAllUsers = async () => {
  try {
    const response = await fetch(baseUrl + "/api/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//api call for fetch user by id
export const getUserById = async (id) => {
  const userId = id?.id;
  try {
    const response = await fetch(baseUrl + `/api/users/` + userId);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//api call for delete user by id
export const deleteUserById = async (id) => {
  try {
    const response = await fetch(baseUrl + `/api/users/` + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return "User deleted successfully";
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return error.message;
  }
};

//api call for create new users

export const createUser = async (formData) => {
  try {
    const response = await fetch(baseUrl + "/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
};

//api call for update user deatil by user id

export const updateUser = async (userId, formData) => {
  try {
    const response = await fetch(`${baseUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};
