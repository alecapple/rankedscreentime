/* eslint-disable */

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserProfile = functions.auth.user().onCreate(async (user) => {
    const uid = user.uid;
  
    const userDocRef = db.collection("users").doc(uid);
  
    const defaultData = {
      elo: 0,
      streak: 0,
      placementMatchesCompleted: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      username: user.email?.split("@")[0] || "unknown",
    };
  
    try {
      await userDocRef.set(defaultData);
      console.log(`Created user document for UID: ${uid}`);
    } catch (error) {
      console.error("Error creating user document:", error);
    }
});

/**
 * This function will delete the stored user document when the 'onDelete'
 * trigger is called from Firebase authentication, which fires when the account
 * is deleted for any reason.
 */
export const deleteUserDocOnDelete = functions.auth.user().onDelete((user) => {
    // Find the record with the given user's UID
    const userDocRef = db.collection("users").doc(user.uid);

    // Delete the user's document entry
    return userDocRef.delete();
});