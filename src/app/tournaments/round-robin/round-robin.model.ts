import { Timestamp } from "@angular/fire/firestore"

export interface RoundRobin {
    id: string,
    name: string
    date: Timestamp,
    place: string,
}