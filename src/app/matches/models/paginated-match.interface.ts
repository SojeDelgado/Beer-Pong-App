import { PaginationMeta } from "../../common/models/pagination-meta.interface";
import { Match } from "../matches-list/match/match.model";

export interface PaginatedMatch {
    data: Match[]
    meta: PaginationMeta
}
