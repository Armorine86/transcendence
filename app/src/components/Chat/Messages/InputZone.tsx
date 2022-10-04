import ChatInput from "./ChatInput";
import { useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import styles from "./InputZone.module.css";
import { InputZone_ } from "../../../interfaces";
import { Message_ } from "../../../interfaces";
import { ProfileContext } from "../../../App";

const InputZone = (props: InputZone_) => {
  const profileName = useContext(ProfileContext);
  let send: Message_ = {
    msg: "",
    author: "",
    chatRoom: props.chatRoom,
  };
  const messageListener = (message: Message_) => {
    props.setMessages([...props.messages, message]);
  };
  props.socket?.on("message", messageListener);
  useEffect(() => {
    console.log("on mount");
    props.socket?.on("message", messageListener);
    return () => {
      props.socket?.off("message", messageListener);
      console.log("LISTETING IS OVER");
    };
  }, []);
  const sendMsg = (message: string) => {
    if (message !== "") {
      send.msg = message;
      send.chatRoom = props.chatRoom;
      send.author = profileName;
      props.socket?.emit("message", send);
    }
  };

  return (
    <div className={styles["type-zone"]}>
      <ChatInput sendMsg={sendMsg}></ChatInput>
    </div>
  );
};

export default InputZone;
