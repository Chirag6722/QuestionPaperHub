import { db } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';

const PAPERS_COLLECTION = 'papers';

export const addPaper = async (paperData) => {
    return await addDoc(collection(db, PAPERS_COLLECTION), {
        ...paperData,
        createdAt: Timestamp.now()
    });
};

export const getPapers = async (filters = {}) => {
    let q = query(collection(db, PAPERS_COLLECTION), orderBy('createdAt', 'desc'));

    // Apply filters
    if (filters.subject) {
        q = query(q, where('subject', '==', filters.subject));
    }
    if (filters.course) {
        q = query(q, where('course', '==', filters.course));
    }
    if (filters.branch) {
        q = query(q, where('branch', '==', filters.branch));
    }
    if (filters.semester) {
        q = query(q, where('semester', '==', filters.semester));
    }
    if (filters.examType) {
        q = query(q, where('examType', '==', filters.examType));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// Get papers uploaded by a specific user
export const getUserPapers = async (userId) => {
    const q = query(
        collection(db, PAPERS_COLLECTION),
        where('uploaderId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// Get a single paper by ID
export const getPaperById = async (paperId) => {
    const docRef = doc(db, PAPERS_COLLECTION, paperId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...docSnap.data()
        };
    }
    return null;
};

// Update an existing paper
export const updatePaper = async (paperId, updatedData) => {
    const docRef = doc(db, PAPERS_COLLECTION, paperId);
    await updateDoc(docRef, {
        ...updatedData,
        updatedAt: Timestamp.now()
    });
};

// Delete a paper
export const deletePaper = async (paperId) => {
    const docRef = doc(db, PAPERS_COLLECTION, paperId);
    await deleteDoc(docRef);
};
