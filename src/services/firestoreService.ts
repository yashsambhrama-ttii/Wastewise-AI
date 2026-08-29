import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { WasteBin, CollectionRoute, CitizenReport } from "../types";
import { INITIAL_BINS, INITIAL_ROUTES, INITIAL_REPORTS } from "../data/mockData";

export const BINS_COLLECTION = "wasteBins";
export const ROUTES_COLLECTION = "collectionRoutes";
export const REPORTS_COLLECTION = "citizenReports";

/**
 * Seed initial Bengaluru municipal data into Firestore if empty
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  if (!db) return;
  try {
    const binsSnapshot = await getDocs(collection(db, BINS_COLLECTION));
    if (binsSnapshot.empty) {
      console.log("WasteWise: Seeding initial Bengaluru smart bins to Firestore...");
      const batch = writeBatch(db);
      for (const bin of INITIAL_BINS) {
        const binRef = doc(db, BINS_COLLECTION, bin.id);
        batch.set(binRef, bin);
      }
      for (const route of INITIAL_ROUTES) {
        const routeRef = doc(db, ROUTES_COLLECTION, route.id);
        batch.set(routeRef, route);
      }
      for (const report of INITIAL_REPORTS) {
        const reportRef = doc(db, REPORTS_COLLECTION, report.id);
        batch.set(reportRef, report);
      }
      await batch.commit();
      console.log("WasteWise: Initial Firestore dataset successfully seeded.");
    }
  } catch (error) {
    console.warn("Firestore auto-seed notice (continuing with local cache):", error);
  }
}

/**
 * Subscribe to realtime Waste Bins updates
 */
export function subscribeToBins(
  onUpdate: (bins: WasteBin[]) => void,
  onError?: (err: any) => void
): () => void {
  if (!db) return () => {};
  const path = BINS_COLLECTION;
  try {
    const q = collection(db, path);
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const binsData: WasteBin[] = [];
          snapshot.forEach((docSnap) => {
            binsData.push(docSnap.data() as WasteBin);
          });
          onUpdate(binsData);
        }
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Subscribe to realtime Collection Routes
 */
export function subscribeToRoutes(
  onUpdate: (routes: CollectionRoute[]) => void,
  onError?: (err: any) => void
): () => void {
  if (!db) return () => {};
  const path = ROUTES_COLLECTION;
  try {
    const q = collection(db, path);
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const routesData: CollectionRoute[] = [];
          snapshot.forEach((docSnap) => {
            routesData.push(docSnap.data() as CollectionRoute);
          });
          onUpdate(routesData);
        }
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Subscribe to realtime Citizen Reports
 */
export function subscribeToReports(
  onUpdate: (reports: CitizenReport[]) => void,
  onError?: (err: any) => void
): () => void {
  if (!db) return () => {};
  const path = REPORTS_COLLECTION;
  try {
    const q = collection(db, path);
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const reportsData: CitizenReport[] = [];
          snapshot.forEach((docSnap) => {
            reportsData.push(docSnap.data() as CitizenReport);
          });
          onUpdate(reportsData);
        }
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Update Bin Fill level / Status in Firestore
 */
export async function updateBinInFirestore(binId: string, updates: Partial<WasteBin>): Promise<void> {
  if (!db) return;
  const path = `${BINS_COLLECTION}/${binId}`;
  try {
    const binRef = doc(db, BINS_COLLECTION, binId);
    await updateDoc(binRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save new citizen report to Firestore
 */
export async function saveCitizenReportToFirestore(report: CitizenReport): Promise<void> {
  if (!db) return;
  const path = `${REPORTS_COLLECTION}/${report.id}`;
  try {
    const reportRef = doc(db, REPORTS_COLLECTION, report.id);
    await setDoc(reportRef, report);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update collection route status in Firestore
 */
export async function updateRouteInFirestore(routeId: string, updates: Partial<CollectionRoute>): Promise<void> {
  if (!db) return;
  const path = `${ROUTES_COLLECTION}/${routeId}`;
  try {
    const routeRef = doc(db, ROUTES_COLLECTION, routeId);
    await updateDoc(routeRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
