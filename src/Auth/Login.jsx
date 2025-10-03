import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useStore } from "../zustand/store";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Login() {

  const email = useRef();
  const password = useRef();
  const { setIsUser, setDialogOpen } = useStore();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      ).then((user) => {
        setDialogOpen(false);
        setIsUser(true);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" flex flex-col gap-2 items-center ">
      <h1 className=" font-semibold text-xl mt-3">Login to Continue</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <Label>Email</Label>
          <Input type="email" ref={email} />
        </div>
        <div className="w-full">
          <Label>Password</Label>
          <Input type="password" ref={password} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default Login;
