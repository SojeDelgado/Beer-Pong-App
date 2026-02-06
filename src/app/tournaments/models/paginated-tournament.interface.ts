import { PaginationMeta } from "../../common/models/pagination-meta.interface";
import { TournamentData } from "../../common/models/single-elimination-data.model";

export interface PaginatedTournament{
    data: TournamentData[]
    meta: PaginationMeta
}