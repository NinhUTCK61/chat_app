import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";

export default function useFirestore(cltn, condition) {
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    let collectionRef = collection(db, cltn);
    let q;
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        setDataArray([]);
        return;
      }
      q = query(
        collectionRef,
        where(condition.fieldName, condition.operator, condition.compareValue),
        orderBy("createdAt")
      );
    }

    const unsub = onSnapshot(q, (docSnapshot) => {
      const docoments = docSnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      setDataArray(docoments);
    });
    return unsub;
  }, [cltn, condition]);
  return dataArray;
}
