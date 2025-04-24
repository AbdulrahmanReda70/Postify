import * as React from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import { fetch_u } from "../utility/fetch";
import { saveUserInfo } from "../auth/authService";
import AlertPopup from "./AlertPopup";

export default function InputModal({ modalOpen, setModalOpen, from, setUser }) {
  function renderModalContent() {
    switch (from) {
      case "username":
        return ModalF(modalOpen, setModalOpen, "username", setUser);
      case "email":
        return ModalF(modalOpen, setModalOpen, "email", setUser);
      case "password":
        return ModalF(modalOpen, setModalOpen, "password", setUser);
      default:
        return null;
    }
  }

  return <>{renderModalContent()}</>;
}

function ModalF(modalOpen, setModalOpen, title, setUser) {
  const [openPop, setOpenPop] = React.useState(false);
  const [res, setRes] = React.useState(false);

  async function handleUpdate(field, value, confirmPass) {
    if (field === "password" && value !== confirmPass) {
      setRes({ error: true, message: "Passwords should match" });
      setOpenPop(true);
      return null;
    }

    const res = await fetch_u("http://localhost:8000/api/user_update", "POST", {
      [field]: value,
    });

    if (res.error) {
      setRes({ error: true, message: res.message });
    } else {
      setRes({ error: false, message: res.data.message });
      console.log(res);
      saveUserInfo(res.data.user);
      setUser(res.data.user);
    }
    setOpenPop(true);
  }

  return (
    <>
      <AlertPopup is_open={openPop} setIs_open={setOpenPop} status={res} />
      <React.Fragment>
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogActions>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const inputValue = event.target[0].value;
                const confirmPass = event.target[1].value;
                handleUpdate(title, inputValue, confirmPass);
                setModalOpen(false);
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <Input
                    className="h-[40px] p-5 pl-1"
                    autoFocus
                    required
                    placeholder={`Enter ${title.toLowerCase()}`}
                  />
                  {title === "password" && (
                    <Input
                      className="h-[40px] p-3 mt-5 pl-1"
                      autoFocus
                      required
                      placeholder={`Confirm Password`}
                    />
                  )}
                </FormControl>
                <Button type="submit">Update</Button>
              </Stack>
            </form>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}
