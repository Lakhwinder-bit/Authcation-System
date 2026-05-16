// components/toast/WelcomeToast.js

import toast from "react-hot-toast";
// import CustomToast from "./Toaster";

const WelcomeToast = () => {
const storename = localStorage.getItem("user")
const user = (JSON.parse(storename));
toast.success(`welcome Back ${user.username}`, {
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
    fontSize:"18px"
  },
  iconTheme: {
    primary: '#713200',
    secondary: '#FFFAEE',
  },
});
};

export default WelcomeToast;