import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useStore } from "../zustand/store";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
function SignUp() {
  const email = useRef();
  const password = useRef();
  const confPassword = useRef();
  const { setIsUser , setDialogOpen } = useStore();
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.current.value === confPassword.current.value) {
      try {
        createUserWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        ).then(() => {
          setDialogOpen(false)
          setIsUser(true);
        });
      } catch (error) {}
    } else {
      console.log("password not match")
    }
  };
  return (
    <div className=" flex flex-col gap-2 items-center">
      <h1 className=" font-semibold text-xl mt-3">Create a new Account</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="w-full">
          <Label>Email</Label>
          <Input type="email " ref={email} />
        </div>
        <div className="w-full">
          <Label>Password</Label>
          <Input type="password" ref={password} />
        </div>
        <div className="w-full">
          <Label>Confirm Password</Label>
          <Input type="password" ref={confPassword} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default SignUp;
