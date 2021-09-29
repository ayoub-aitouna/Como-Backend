const users_container = document.getElementById("users-container");
const usersTabTemp = (user) => {
  return `<tr>
      <td class="py-1"> <img src="${user.profileImage}" alt="image"/></td>
      <td>${user.name}</td>
      <td>${user.activationStatus == 0}</td>
      <td>${user.coins}</td>
      <td>${user.age}</td>
      <td>
          <button type="button" class="btn btn-danger" onclick="DeleteUser(${
            user.idUser
          })">delete</button>
      </td>
    </tr>`;
};

const Getusers = async () => {
  const data = await fetch("http://localhost:3000/data/GetAllUsers", {
    method: "GET",
    mode: "cors",
  });
  const users = await data.json();

  users.map((item) => {
    users_container.innerHTML += usersTabTemp(item);
  });
};
Getusers();
const DeleteUser = async (id) => {
  console.log(id);
  await fetch(`http://localhost:3000/data/DeleteUser`, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ id: 1 }),
  });
  users_container.innerHTML = "";
  Getusers();
};
