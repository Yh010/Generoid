import axios from "axios";

async function getuserData() {
  const response = await axios.get("http://localhost:3000/api/ai");
  return response.data;
}
export default async function chatPage() {
  const userdetails = await getuserData();
  return (
    <div>
      hi chat
      <div>
        user details: name is {userdetails?.name}
        email is {userdetails?.email}
      </div>
    </div>
  );
}
