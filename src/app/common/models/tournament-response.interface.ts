import { PaginationMeta } from "./pagination-meta.interface"
import { TournamentData } from "./single-elimination-data.model"

export interface TournamentResponse {
    data: TournamentData[]
    meta: PaginationMeta
}