import React, { createContext, useContext, useMemo, useState } from "react";
import { AppContext, AuthContext } from ".";
import useFirestore from "../../hook/useFirestore";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [mentionId, setMentionId] = useState("");

  const { user } = useContext(AuthContext);
  const { roomId } = useContext(AppContext);

  const conditionMessages = useMemo(() => {
    return {
      fieldName: "roomId",
      operator: "==",
      compareValue: roomId,
    };
  }, [roomId]);

  const messages = useFirestore("messages", conditionMessages);

  const conditionMentionMessages = useMemo(() => {
    return {
      fieldName: "mention",
      operator: "array-contains",
      compareValue: user.uid,
    };
  }, [user.uid]);

  const messagesMentionUser = useFirestore(
    "messages",
    conditionMentionMessages
  );

  const messagesMentionId = useMemo(() => {
    return messagesMentionUser.map((mention) => {
      return mention.id;
    });
  }, [messagesMentionUser.length]);

  return (
    <ChatContext.Provider
      value={{
        mentionId,
        setMentionId,
        messagesMentionId,
        messagesMentionUser,
        messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
