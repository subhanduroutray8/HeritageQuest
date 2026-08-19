import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";


export async function registerUser(name, email, password) {
    // 1. Create Firebase Authentication account
    const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    // 2. Firebase gives this account a unique UID
    const user = credential.user;

    // 3. Create GeoQuest player profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
    username: name,
    email: user.email,

    role: "Registered Explorer",
    isGuest: false,

    level: 1,
    xp: 0,
    nextLevelXp: 1000,

    title: "Novice Cartographer",

    streak: 0,

    stats: {
        missionsCompleted: 0,
        relicsDiscovered: 0,
        countriesExplored: 0,
        totalDistanceKm: 0
    },

    konark: {
    virtual: {
        completed: false,
        xpEarned: 0,
        attempts: 0
    },

    physical: {
        completed: false,
        xpEarned: 0,
        attempts: 0
    }
},

    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
});

    return user;
}


export async function loginUser(email, password) {
    const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = credential.user;

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        throw new Error("USER_PROFILE_NOT_FOUND");
    }

    const profile = userSnapshot.data();

    await setDoc(
        userRef,
        {
            lastLoginAt: serverTimestamp()
        },
        { merge: true }
    );

    return {
        user,
        profile
    };
}


export async function logoutUser() {
    await signOut(auth);
}